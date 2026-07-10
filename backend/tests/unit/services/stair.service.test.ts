import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeStair, makeStairItem, makeAreaDeduction } from '../../helpers/factories.js'
import { upsertStair, getStairs, getStairByJobId, updateStair, deleteStair } from '../../../services/stair.service.js'

describe('stair.service', () => {
  describe('upsertStair', () => {
    it('upserts a stair with stairs and area deductions for the given job', async () => {
      const stairs = [makeStairItem()]
      const areaDeductions = [makeAreaDeduction()]
      const stair = makeStair({ jobId: 'job-1', stairs, areaDeductions })
      prismaMock.stair.upsert.mockResolvedValue(stair as any)

      const result = await upsertStair('job-1', { stairs, areaDeductions })

      expect(result).toEqual(stair)
      expect(prismaMock.stair.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        create: {
          jobId: 'job-1',
          stairs: { createMany: { data: stairs } },
          areaDeductions: { createMany: { data: areaDeductions } },
        },
        update: {
          stairs: { deleteMany: {}, createMany: { data: stairs } },
          areaDeductions: { deleteMany: {}, createMany: { data: areaDeductions } },
        },
        include: { stairs: true, areaDeductions: true },
      })
    })

    it('handles upsert with no stairs or deductions', async () => {
      const stair = makeStair({ jobId: 'job-2' })
      prismaMock.stair.upsert.mockResolvedValue(stair as any)

      const result = await upsertStair('job-2', {})

      expect(result).toEqual(stair)
      expect(prismaMock.stair.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-2' },
        create: {
          jobId: 'job-2',
          stairs: { createMany: { data: [] } },
          areaDeductions: { createMany: { data: [] } },
        },
        update: {
          stairs: { deleteMany: {}, createMany: { data: [] } },
          areaDeductions: { deleteMany: {}, createMany: { data: [] } },
        },
        include: { stairs: true, areaDeductions: true },
      })
    })
  })

  describe('getStairs', () => {
    it('returns paginated stairs', async () => {
      const stairs = [makeStair(), makeStair()]
      prismaMock.stair.findMany.mockResolvedValue(stairs as any)
      prismaMock.stair.count.mockResolvedValue(2)

      const result = await getStairs('user_1', 2, 10)

      expect(result).toEqual({ data: stairs, total: 2, page: 2, pageSize: 10 })
      expect(prismaMock.stair.findMany).toHaveBeenCalledWith({
        where: { job: { userId: 'user_1' } }, skip: 10, take: 10, orderBy: { createdAt: 'desc' }, include: { stairs: true, areaDeductions: true },
      })
      expect(prismaMock.stair.count).toHaveBeenCalledWith({ where: { job: { userId: 'user_1' } } })
    })
  })

  describe('getStairByJobId', () => {
    it('returns stair when found', async () => {
      const stair = makeStair()
      prismaMock.stair.findUnique.mockResolvedValue(stair as any)

      const result = await getStairByJobId('job-1')

      expect(result).toEqual(stair)
      expect(prismaMock.stair.findUnique).toHaveBeenCalledWith({ where: { jobId: 'job-1' }, include: { stairs: true, areaDeductions: true } })
    })

    it('returns null when not found', async () => {
      prismaMock.stair.findUnique.mockResolvedValue(null)

      const result = await getStairByJobId('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('updateStair', () => {
    it('updates stair and replaces stairs and deductions when provided', async () => {
      const stair = makeStair()
      const stairs = [makeStairItem({ code: 'STAIR-2' })]
      const areaDeductions = [makeAreaDeduction()]
      prismaMock.stair.update.mockResolvedValue(stair as any)

      const result = await updateStair('job-1', { stairs, areaDeductions })

      expect(result).toEqual(stair)
      expect(prismaMock.stair.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: {
          stairs: { deleteMany: {}, createMany: { data: stairs } },
          areaDeductions: { deleteMany: {}, createMany: { data: areaDeductions } },
        },
        include: { stairs: true, areaDeductions: true },
      })
    })

    it('updates stair without touching stairs/deductions when not provided', async () => {
      const stair = makeStair()
      prismaMock.stair.update.mockResolvedValue(stair as any)

      const result = await updateStair('job-1', {})

      expect(result).toEqual(stair)
      expect(prismaMock.stair.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: {},
        include: { stairs: true, areaDeductions: true },
      })
    })
  })

  describe('deleteStair', () => {
    it('deletes the stair by job ID', async () => {
      prismaMock.stair.delete.mockResolvedValue({} as any)

      await deleteStair('job-1')

      expect(prismaMock.stair.delete).toHaveBeenCalledWith({ where: { jobId: 'job-1' } })
    })
  })
})
