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

    it('recomputes sideColumnsWidthHeight from the payload and overwrites any client value', async () => {
      const { jobId, ...rest } = makeRoofInput('job-1')
      prismaMock.roof.upsert.mockResolvedValue(makeRoof({ jobId: 'job-1' }) as any)

      // eave 6 − ext 1 · tan(10°) = 5.824 — client sends a bogus 999 that must be ignored.
      await upsertRoof('job-1', {
        ...rest,
        eaveHeight: 6,
        roofSlope: 10,
        claddingExtensionWidthHeight: 1,
        sideColumnsWidthHeight: 999,
      })

      expect(prismaMock.roof.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ sideColumnsWidthHeight: 5.824 }),
          update: expect.objectContaining({ sideColumnsWidthHeight: 5.824 }),
        }),
      )
    })
  })

  describe('getRoofs', () => {
    it('returns paginated roofs', async () => {
      const roofs = [makeRoof(), makeRoof()]
      prismaMock.roof.findMany.mockResolvedValue(roofs as any)
      prismaMock.roof.count.mockResolvedValue(2)

      const result = await getRoofs(2, 10)

      expect(result).toEqual({ data: roofs, total: 2, page: 2, pageSize: 10 })
      expect(prismaMock.roof.findMany).toHaveBeenCalledWith({
        skip: 10, take: 10, orderBy: { createdAt: 'desc' }, include: { sidewalls: true },
      })
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

    it('recomputes sideColumnsWidthHeight by merging the incoming change with the DB row', async () => {
      // DB has eave 6 + slope 10; only the cladding extension changes to 1 → 5.824.
      prismaMock.roof.findUnique.mockResolvedValue({
        eaveHeight: 6, roofSlope: 10, claddingExtensionWidthHeight: 2,
      } as any)
      prismaMock.roof.update.mockResolvedValue(makeRoof({ jobId: 'job-1' }) as any)

      await updateRoof('job-1', { claddingExtensionWidthHeight: 1 })

      expect(prismaMock.roof.findUnique).toHaveBeenCalledWith({ where: { jobId: 'job-1' } })
      expect(prismaMock.roof.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { jobId: 'job-1' },
          data: expect.objectContaining({ claddingExtensionWidthHeight: 1, sideColumnsWidthHeight: 5.824 }),
        }),
      )
    })

    it('drops a client-supplied sideColumnsWidthHeight when none of its inputs change', async () => {
      prismaMock.roof.update.mockResolvedValue(makeRoof({ jobId: 'job-1' }) as any)

      await updateRoof('job-1', { mainRoofFrames: 5, sideColumnsWidthHeight: 999 })

      expect(prismaMock.roof.findUnique).not.toHaveBeenCalled()
      const data = (prismaMock.roof.update.mock.calls[0][0] as any).data
      expect(data).not.toHaveProperty('sideColumnsWidthHeight')
      expect(data).toMatchObject({ mainRoofFrames: 5 })
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
