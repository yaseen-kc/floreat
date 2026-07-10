import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeCanopy, makeCanopyItem } from '../../helpers/factories.js'
import { upsertCanopy, getCanopies, getCanopyByJobId, updateCanopy, deleteCanopy } from '../../../services/canopy.service.js'

describe('canopy.service', () => {
  describe('upsertCanopy', () => {
    it('upserts a canopy with canopies for the given job', async () => {
      const canopies = [makeCanopyItem()]
      const canopy = makeCanopy({ jobId: 'job-1', canopies })
      prismaMock.canopy.upsert.mockResolvedValue(canopy as any)

      const result = await upsertCanopy('job-1', { canopies })

      expect(result).toEqual(canopy)
      expect(prismaMock.canopy.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        create: { jobId: 'job-1', canopies: { createMany: { data: canopies } } },
        update: { canopies: { deleteMany: {}, createMany: { data: canopies } } },
        include: { canopies: true },
      })
    })

    it('handles upsert with no canopies', async () => {
      const canopy = makeCanopy({ jobId: 'job-2' })
      prismaMock.canopy.upsert.mockResolvedValue(canopy as any)

      const result = await upsertCanopy('job-2', {})

      expect(result).toEqual(canopy)
      expect(prismaMock.canopy.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-2' },
        create: { jobId: 'job-2', canopies: { createMany: { data: [] } } },
        update: { canopies: { deleteMany: {}, createMany: { data: [] } } },
        include: { canopies: true },
      })
    })
  })

  describe('getCanopies', () => {
    it('returns the user\'s paginated canopies', async () => {
      const canopies = [makeCanopy(), makeCanopy()]
      prismaMock.canopy.findMany.mockResolvedValue(canopies as any)
      prismaMock.canopy.count.mockResolvedValue(2)

      const result = await getCanopies('user_1', 2, 10)

      expect(result).toEqual({ data: canopies, total: 2, page: 2, pageSize: 10 })
      expect(prismaMock.canopy.findMany).toHaveBeenCalledWith({
        where: { job: { userId: 'user_1' } }, skip: 10, take: 10, orderBy: { createdAt: 'desc' }, include: { canopies: true },
      })
      expect(prismaMock.canopy.count).toHaveBeenCalledWith({ where: { job: { userId: 'user_1' } } })
    })
  })

  describe('getCanopyByJobId', () => {
    it('returns canopy when found', async () => {
      const canopy = makeCanopy()
      prismaMock.canopy.findUnique.mockResolvedValue(canopy as any)

      const result = await getCanopyByJobId('job-1')

      expect(result).toEqual(canopy)
      expect(prismaMock.canopy.findUnique).toHaveBeenCalledWith({ where: { jobId: 'job-1' }, include: { canopies: true } })
    })

    it('returns null when not found', async () => {
      prismaMock.canopy.findUnique.mockResolvedValue(null)

      const result = await getCanopyByJobId('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('updateCanopy', () => {
    it('updates canopy and replaces canopies when provided', async () => {
      const canopy = makeCanopy()
      const canopies = [makeCanopyItem({ code: 'CANOPY-2' })]
      prismaMock.canopy.update.mockResolvedValue(canopy as any)

      const result = await updateCanopy('job-1', { canopies })

      expect(result).toEqual(canopy)
      expect(prismaMock.canopy.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: { canopies: { deleteMany: {}, createMany: { data: canopies } } },
        include: { canopies: true },
      })
    })

    it('updates canopy without touching canopies when not provided', async () => {
      const canopy = makeCanopy()
      prismaMock.canopy.update.mockResolvedValue(canopy as any)

      const result = await updateCanopy('job-1', {})

      expect(result).toEqual(canopy)
      expect(prismaMock.canopy.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: {},
        include: { canopies: true },
      })
    })
  })

  describe('deleteCanopy', () => {
    it('deletes the canopy by job ID', async () => {
      prismaMock.canopy.delete.mockResolvedValue({} as any)

      await deleteCanopy('job-1')

      expect(prismaMock.canopy.delete).toHaveBeenCalledWith({ where: { jobId: 'job-1' } })
    })
  })
})
