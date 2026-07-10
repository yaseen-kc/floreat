import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeRoof, makeRoofInput } from '../../helpers/factories.js'
import { upsertRoof, getRoofs, getRoofByJobId, updateRoof, deleteRoof } from '../../../services/roof.service.js'

describe('roof.service', () => {
  describe('upsertRoof', () => {
    it('upserts a roof with sidewalls for the given job', async () => {
      const input = makeRoofInput('job-1')
      const { jobId, ...rest } = input
      const sidewalls = [{ side: 'FRONT' as const, wallType: 'BRICK' as const, thickness: 0.23, height: 3.5 }]
      const roof = makeRoof({ jobId: 'job-1', sidewalls })
      prismaMock.roof.upsert.mockResolvedValue(roof as any)

      const result = await upsertRoof('job-1', { ...rest, sidewalls })

      expect(result).toEqual(roof)
      expect(prismaMock.roof.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        create: { jobId: 'job-1', ...rest, sidewalls: { createMany: { data: sidewalls } } },
        update: { ...rest, sidewalls: { deleteMany: {}, createMany: { data: sidewalls } } },
        include: { sidewalls: true },
      })
    })

    it('handles upsert with no sidewalls', async () => {
      const input = makeRoofInput('job-2')
      const { jobId, ...rest } = input
      const roof = makeRoof({ jobId: 'job-2' })
      prismaMock.roof.upsert.mockResolvedValue(roof as any)

      const result = await upsertRoof('job-2', rest)

      expect(result).toEqual(roof)
      expect(prismaMock.roof.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-2' },
        create: { jobId: 'job-2', ...rest, sidewalls: { createMany: { data: [] } } },
        update: { ...rest, sidewalls: { deleteMany: {}, createMany: { data: [] } } },
        include: { sidewalls: true },
      })
    })

    it('forces sideColumnsMidFrameCount/EndFrameCount to equal their claddingExtension counterparts', async () => {
      const input = makeRoofInput('job-3')
      const { jobId, ...rest } = input
      const roof = makeRoof({ jobId: 'job-3' })
      prismaMock.roof.upsert.mockResolvedValue(roof as any)

      // Client sends mismatched side-column counts — the service overrides both.
      await upsertRoof('job-3', {
        ...rest,
        claddingExtensionMidFrameCount: 6,
        sideColumnsMidFrameCount: 99,
        claddingExtensionEndFrameCount: 2,
        sideColumnsEndFrameCount: 88,
      })

      const expected = {
        ...rest,
        claddingExtensionMidFrameCount: 6,
        sideColumnsMidFrameCount: 6,
        claddingExtensionEndFrameCount: 2,
        sideColumnsEndFrameCount: 2,
      }
      expect(prismaMock.roof.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-3' },
        create: { jobId: 'job-3', ...expected, sidewalls: { createMany: { data: [] } } },
        update: { ...expected, sidewalls: { deleteMany: {}, createMany: { data: [] } } },
        include: { sidewalls: true },
      })
    })
  })

  describe('getRoofs', () => {
    it('returns the user\'s paginated roofs', async () => {
      const roofs = [makeRoof(), makeRoof()]
      prismaMock.roof.findMany.mockResolvedValue(roofs as any)
      prismaMock.roof.count.mockResolvedValue(2)

      const result = await getRoofs('user_1', 2, 10)

      expect(result).toEqual({ data: roofs, total: 2, page: 2, pageSize: 10 })
      expect(prismaMock.roof.findMany).toHaveBeenCalledWith({
        where: { job: { userId: 'user_1' } }, skip: 10, take: 10, orderBy: { createdAt: 'desc' }, include: { sidewalls: true },
      })
      expect(prismaMock.roof.count).toHaveBeenCalledWith({ where: { job: { userId: 'user_1' } } })
    })
  })

  describe('getRoofByJobId', () => {
    it('returns roof when found', async () => {
      const roof = makeRoof()
      prismaMock.roof.findUnique.mockResolvedValue(roof as any)

      const result = await getRoofByJobId('job-1')

      expect(result).toEqual(roof)
      expect(prismaMock.roof.findUnique).toHaveBeenCalledWith({ where: { jobId: 'job-1' }, include: { sidewalls: true } })
    })

    it('returns null when not found', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(null)

      const result = await getRoofByJobId('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('updateRoof', () => {
    it('updates roof and replaces sidewalls when provided', async () => {
      const roof = makeRoof()
      const sidewalls = [{ side: 'BACK' as const, wallType: 'PANEL' as const, thickness: 0.15, height: 4.0 }]
      prismaMock.roof.update.mockResolvedValue(roof as any)

      const result = await updateRoof('job-1', { roofSlope: 8, sidewalls })

      expect(result).toEqual(roof)
      expect(prismaMock.roof.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: { roofSlope: 8, sidewalls: { deleteMany: {}, createMany: { data: sidewalls } } },
        include: { sidewalls: true },
      })
    })

    it('updates roof without touching sidewalls when not provided', async () => {
      const roof = makeRoof()
      prismaMock.roof.update.mockResolvedValue(roof as any)

      const result = await updateRoof('job-1', { roofSlope: 10 })

      expect(result).toEqual(roof)
      expect(prismaMock.roof.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: { roofSlope: 10 },
        include: { sidewalls: true },
      })
    })

    it('forces sideColumnsMidFrameCount/EndFrameCount to equal their claddingExtension counterparts when updated', async () => {
      const roof = makeRoof()
      prismaMock.roof.update.mockResolvedValue(roof as any)

      await updateRoof('job-1', {
        claddingExtensionMidFrameCount: 5,
        sideColumnsMidFrameCount: 99,
        claddingExtensionEndFrameCount: 2,
        sideColumnsEndFrameCount: 88,
      })

      expect(prismaMock.roof.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: {
          claddingExtensionMidFrameCount: 5,
          sideColumnsMidFrameCount: 5,
          claddingExtensionEndFrameCount: 2,
          sideColumnsEndFrameCount: 2,
        },
        include: { sidewalls: true },
      })
    })
  })

  describe('deleteRoof', () => {
    it('deletes the roof by job ID', async () => {
      prismaMock.roof.delete.mockResolvedValue({} as any)

      await deleteRoof('job-1')

      expect(prismaMock.roof.delete).toHaveBeenCalledWith({ where: { jobId: 'job-1' } })
    })
  })
})
