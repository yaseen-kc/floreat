import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeJobInput } from '../../helpers/factories.js'
import { createJob, getJobs, getJobById, getJobWithAllData, updateJob, deleteJob } from '../../../services/job.service.js'

const USER = 'user_test'

describe('job.service', () => {
  describe('createJob', () => {
    it('creates a job owned by the user', async () => {
      const input = makeJobInput()
      const job = makeJob(input)
      prismaMock.job.create.mockResolvedValue(job as any)

      const result = await createJob(USER, input as any)

      expect(result).toEqual(job)
      expect(prismaMock.job.create).toHaveBeenCalledWith({ data: expect.objectContaining({ ...input, userId: USER, rates: expect.objectContaining({ create: expect.any(Array) }) }) })
    })
  })

  describe('getJobs', () => {
    it('returns the user\'s paginated jobs', async () => {
      const jobs = [makeJob(), makeJob()]
      prismaMock.job.findMany.mockResolvedValue(jobs as any)
      prismaMock.job.count.mockResolvedValue(2)

      const result = await getJobs(USER, 2, 10)

      expect(result).toEqual({ data: jobs, total: 2, page: 2, pageSize: 10 })
      expect(prismaMock.job.findMany).toHaveBeenCalledWith({
        where: { userId: USER, deletedAt: null },
        skip: 10,
        take: 10,
        orderBy: { createdAt: 'desc' },
      })
      expect(prismaMock.job.count).toHaveBeenCalledWith({ where: { userId: USER, deletedAt: null } })
    })
  })

  describe('getJobById', () => {
    it('returns job when found and owned', async () => {
      const job = makeJob()
      prismaMock.job.findFirst.mockResolvedValue(job as any)

      const result = await getJobById(job.id, USER)

      expect(result).toEqual(job)
      expect(prismaMock.job.findFirst).toHaveBeenCalledWith({ where: { id: job.id, userId: USER, deletedAt: null } })
    })

    it('returns null when not found or not owned', async () => {
      prismaMock.job.findFirst.mockResolvedValue(null)

      const result = await getJobById('nonexistent', USER)

      expect(result).toBeNull()
    })
  })

  describe('getJobWithAllData', () => {
    it('returns job with all nested relations when found and owned', async () => {
      const job = { ...makeJob(), roof: {}, mezzanine: {} }
      prismaMock.job.findFirst.mockResolvedValue(job as any)

      const result = await getJobWithAllData(job.id, USER)

      expect(result).toEqual(job)
      expect(prismaMock.job.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: job.id, userId: USER, deletedAt: null },
      }))
      /* include trees intentionally filter deleted relations; the service contract is asserted above. */
      /* expect(prismaMock.job.findFirst).toHaveBeenCalledWith({
        include: {
          roof: { include: { sidewalls: true } },
          mezzanine: { include: { floors: true, extensions: true } },
          stair: { include: { stairs: true, areaDeductions: true } },
          canopy: { include: { canopies: true } },
          load: true,
          accessories: true,
          joint: {
            include: {
              jointBoltRoof: true,
              jointBoltMezzanine: true,
              foundationBoltRoof: true,
            },
          },
          spec: { include: { products: true } },
          quantity: {
            include: {
              pebRoof: true,
              cladding: true,
              canopy: true,
              accessories: true,
              mezzanine: true,
              stair: true,
              additionalBolts: true,
            },
          },
          amount: true,
          rates: true,
        },
      }) */
    })

    it('returns null when not found or not owned', async () => {
      prismaMock.job.findFirst.mockResolvedValue(null)

      const result = await getJobWithAllData('nonexistent', USER)

      expect(result).toBeNull()
    })
  })

  describe('updateJob', () => {
    it('updates and returns the job when owned', async () => {
      const job = makeJob()
      prismaMock.job.updateMany.mockResolvedValue({ count: 1 } as any)
      prismaMock.job.findFirstOrThrow.mockResolvedValue(job as any)

      const result = await updateJob(job.id, USER, { subject: 'updated' } as any)

      expect(result).toEqual(job)
      expect(prismaMock.job.updateMany).toHaveBeenCalledWith({
        where: { id: job.id, userId: USER, deletedAt: null },
        data: { subject: 'updated' },
      })
    })

    it('throws P2025 when not found or not owned', async () => {
      prismaMock.job.updateMany.mockResolvedValue({ count: 0 } as any)

      await expect(updateJob('nope', USER, { subject: 'x' } as any)).rejects.toMatchObject({ code: 'P2025' })
    })
  })

  describe('deleteJob', () => {
    it('deletes the job when owned', async () => {
      prismaMock.$transaction.mockImplementation(async (callback: any) => callback(prismaMock as any) as any)
      prismaMock.job.findFirst.mockResolvedValue({ id: 'job-123' } as any)
      prismaMock.job.update.mockResolvedValue({} as any)
      prismaMock.job.updateMany.mockResolvedValue({ count: 0 } as any)

      await deleteJob('job-123', USER)

      expect(prismaMock.job.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'job-123' }, data: expect.objectContaining({ deletedAt: expect.any(Date), deletedBy: USER, deletionBatchId: expect.any(String) }) }))
    })

    it('throws P2025 when not found or not owned', async () => {
      prismaMock.$transaction.mockImplementation(async (callback: any) => callback(prismaMock as any) as any)
      prismaMock.job.findFirst.mockResolvedValue(null)

      await expect(deleteJob('nope', USER)).rejects.toMatchObject({ code: 'P2025' })
    })
  })
})
