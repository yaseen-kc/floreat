import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeJobInput } from '../../helpers/factories.js'
import { createJob, getJobs, getJobById, updateJob, deleteJob } from '../../../services/job.service.js'

describe('job.service', () => {
  describe('createJob', () => {
    it('creates a job with given data', async () => {
      const input = makeJobInput()
      const job = makeJob(input)
      prismaMock.job.create.mockResolvedValue(job as any)

      const result = await createJob(input as any)

      expect(result).toEqual(job)
      expect(prismaMock.job.create).toHaveBeenCalledWith({ data: input })
    })
  })

  describe('getJobs', () => {
    it('returns paginated jobs', async () => {
      const jobs = [makeJob(), makeJob()]
      prismaMock.job.findMany.mockResolvedValue(jobs as any)
      prismaMock.job.count.mockResolvedValue(2)

      const result = await getJobs(2, 10)

      expect(result).toEqual({ data: jobs, total: 2, page: 2, pageSize: 10 })
      expect(prismaMock.job.findMany).toHaveBeenCalledWith({
        skip: 10,
        take: 10,
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('getJobById', () => {
    it('returns job when found', async () => {
      const job = makeJob()
      prismaMock.job.findUnique.mockResolvedValue(job as any)

      const result = await getJobById(job.id)

      expect(result).toEqual(job)
    })

    it('returns null when not found', async () => {
      prismaMock.job.findUnique.mockResolvedValue(null)

      const result = await getJobById('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('updateJob', () => {
    it('updates and returns the job', async () => {
      const job = makeJob()
      prismaMock.job.update.mockResolvedValue(job as any)

      const result = await updateJob(job.id, { subject: 'updated' } as any)

      expect(result).toEqual(job)
      expect(prismaMock.job.update).toHaveBeenCalledWith({
        where: { id: job.id },
        data: { subject: 'updated' },
      })
    })
  })

  describe('deleteJob', () => {
    it('deletes the job by id', async () => {
      prismaMock.job.delete.mockResolvedValue({} as any)

      await deleteJob('job-123')

      expect(prismaMock.job.delete).toHaveBeenCalledWith({ where: { id: 'job-123' } })
    })
  })
})
