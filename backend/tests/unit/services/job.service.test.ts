import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeJobInput } from '../../helpers/factories.js'
import { createJob, getJobs, getJobById, updateJob, deleteJob } from '../../../services/job.service.js'

const USER = 'user_test'

describe('job.service', () => {
  describe('createJob', () => {
    it('creates a job owned by the user', async () => {
      const input = makeJobInput()
      const job = makeJob(input)
      prismaMock.job.create.mockResolvedValue(job as any)

      const result = await createJob(USER, input as any)

      expect(result).toEqual(job)
      expect(prismaMock.job.create).toHaveBeenCalledWith({ data: { ...input, userId: USER } })
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
        where: { userId: USER },
        skip: 10,
        take: 10,
        orderBy: { createdAt: 'desc' },
      })
      expect(prismaMock.job.count).toHaveBeenCalledWith({ where: { userId: USER } })
    })
  })

  describe('getJobById', () => {
    it('returns job when found and owned', async () => {
      const job = makeJob()
      prismaMock.job.findFirst.mockResolvedValue(job as any)

      const result = await getJobById(job.id, USER)

      expect(result).toEqual(job)
      expect(prismaMock.job.findFirst).toHaveBeenCalledWith({ where: { id: job.id, userId: USER } })
    })

    it('returns null when not found or not owned', async () => {
      prismaMock.job.findFirst.mockResolvedValue(null)

      const result = await getJobById('nonexistent', USER)

      expect(result).toBeNull()
    })
  })

  describe('updateJob', () => {
    it('updates and returns the job when owned', async () => {
      const job = makeJob()
      prismaMock.job.updateMany.mockResolvedValue({ count: 1 } as any)
      prismaMock.job.findUniqueOrThrow.mockResolvedValue(job as any)

      const result = await updateJob(job.id, USER, { subject: 'updated' } as any)

      expect(result).toEqual(job)
      expect(prismaMock.job.updateMany).toHaveBeenCalledWith({
        where: { id: job.id, userId: USER },
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
      prismaMock.job.deleteMany.mockResolvedValue({ count: 1 } as any)

      await deleteJob('job-123', USER)

      expect(prismaMock.job.deleteMany).toHaveBeenCalledWith({ where: { id: 'job-123', userId: USER } })
    })

    it('throws P2025 when not found or not owned', async () => {
      prismaMock.job.deleteMany.mockResolvedValue({ count: 0 } as any)

      await expect(deleteJob('nope', USER)).rejects.toMatchObject({ code: 'P2025' })
    })
  })
})
