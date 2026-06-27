import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeLoad, makeLoadInput } from '../../helpers/factories.js'
import { upsertLoad, getLoads, getLoadByJobId, updateLoad, deleteLoad } from '../../../services/load.service.js'

describe('load.service', () => {
  describe('upsertLoad', () => {
    it('upserts a load for the given job', async () => {
      const { jobId, ...data } = makeLoadInput('job-1')
      const load = makeLoad({ jobId: 'job-1', ...data })
      prismaMock.load.upsert.mockResolvedValue(load as any)

      const result = await upsertLoad('job-1', data)

      expect(result).toEqual(load)
      expect(prismaMock.load.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        create: { jobId: 'job-1', ...data },
        update: { ...data },
      })
    })

    it('handles upsert with no data', async () => {
      const load = makeLoad({ jobId: 'job-2' })
      prismaMock.load.upsert.mockResolvedValue(load as any)

      const result = await upsertLoad('job-2', {})

      expect(result).toEqual(load)
      expect(prismaMock.load.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-2' },
        create: { jobId: 'job-2' },
        update: {},
      })
    })
  })

  describe('getLoads', () => {
    it('returns paginated loads', async () => {
      const loads = [makeLoad(), makeLoad()]
      prismaMock.load.findMany.mockResolvedValue(loads as any)
      prismaMock.load.count.mockResolvedValue(2)

      const result = await getLoads(2, 10)

      expect(result).toEqual({ data: loads, total: 2, page: 2, pageSize: 10 })
      expect(prismaMock.load.findMany).toHaveBeenCalledWith({
        skip: 10, take: 10, orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('getLoadByJobId', () => {
    it('returns load when found', async () => {
      const load = makeLoad()
      prismaMock.load.findUnique.mockResolvedValue(load as any)

      const result = await getLoadByJobId('job-1')

      expect(result).toEqual(load)
      expect(prismaMock.load.findUnique).toHaveBeenCalledWith({ where: { jobId: 'job-1' } })
    })

    it('returns null when not found', async () => {
      prismaMock.load.findUnique.mockResolvedValue(null)

      const result = await getLoadByJobId('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('updateLoad', () => {
    it('updates a load by job ID', async () => {
      const load = makeLoad()
      const data = { snowLoad: 4, earthquakeLoad: 2.5 }
      prismaMock.load.update.mockResolvedValue(load as any)

      const result = await updateLoad('job-1', data)

      expect(result).toEqual(load)
      expect(prismaMock.load.update).toHaveBeenCalledWith({ where: { jobId: 'job-1' }, data })
    })
  })

  describe('deleteLoad', () => {
    it('deletes the load by job ID', async () => {
      prismaMock.load.delete.mockResolvedValue({} as any)

      await deleteLoad('job-1')

      expect(prismaMock.load.delete).toHaveBeenCalledWith({ where: { jobId: 'job-1' } })
    })
  })
})
