import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeMezzanine, makeMezzanineFloor, makeMezzanineExtension } from '../../helpers/factories.js'
import { upsertMezzanine, getMezzanines, getMezzanineByJobId, updateMezzanine, deleteMezzanine } from '../../../services/mezzanine.service.js'

describe('mezzanine.service', () => {
  describe('upsertMezzanine', () => {
    it('upserts a mezzanine with floors and extensions for the given job', async () => {
      const floors = [makeMezzanineFloor()]
      const extensions = [makeMezzanineExtension()]
      const mezzanine = makeMezzanine({ jobId: 'job-1', floors, extensions })
      prismaMock.mezzanine.upsert.mockResolvedValue(mezzanine as any)

      const result = await upsertMezzanine('job-1', { floors, extensions })

      expect(result).toEqual(mezzanine)
      expect(prismaMock.mezzanine.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        create: {
          jobId: 'job-1',
          floors: { createMany: { data: floors } },
          extensions: { createMany: { data: extensions } },
        },
        update: {
          floors: { deleteMany: {}, createMany: { data: floors } },
          extensions: { deleteMany: {}, createMany: { data: extensions } },
        },
        include: { floors: true, extensions: true },
      })
    })

    it('handles upsert with no floors or extensions', async () => {
      const mezzanine = makeMezzanine({ jobId: 'job-2' })
      prismaMock.mezzanine.upsert.mockResolvedValue(mezzanine as any)

      const result = await upsertMezzanine('job-2', {})

      expect(result).toEqual(mezzanine)
      expect(prismaMock.mezzanine.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-2' },
        create: {
          jobId: 'job-2',
          floors: { createMany: { data: [] } },
          extensions: { createMany: { data: [] } },
        },
        update: {
          floors: { deleteMany: {}, createMany: { data: [] } },
          extensions: { deleteMany: {}, createMany: { data: [] } },
        },
        include: { floors: true, extensions: true },
      })
    })
  })

  describe('getMezzanines', () => {
    it('returns paginated mezzanines', async () => {
      const mezzanines = [makeMezzanine(), makeMezzanine()]
      prismaMock.mezzanine.findMany.mockResolvedValue(mezzanines as any)
      prismaMock.mezzanine.count.mockResolvedValue(2)

      const result = await getMezzanines(2, 10)

      expect(result).toEqual({ data: mezzanines, total: 2, page: 2, pageSize: 10 })
      expect(prismaMock.mezzanine.findMany).toHaveBeenCalledWith({
        skip: 10, take: 10, orderBy: { createdAt: 'desc' }, include: { floors: true, extensions: true },
      })
    })
  })

  describe('getMezzanineByJobId', () => {
    it('returns mezzanine when found', async () => {
      const mezzanine = makeMezzanine()
      prismaMock.mezzanine.findUnique.mockResolvedValue(mezzanine as any)

      const result = await getMezzanineByJobId('job-1')

      expect(result).toEqual(mezzanine)
      expect(prismaMock.mezzanine.findUnique).toHaveBeenCalledWith({ where: { jobId: 'job-1' }, include: { floors: true, extensions: true } })
    })

    it('returns null when not found', async () => {
      prismaMock.mezzanine.findUnique.mockResolvedValue(null)

      const result = await getMezzanineByJobId('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('updateMezzanine', () => {
    it('updates mezzanine and replaces floors and extensions when provided', async () => {
      const mezzanine = makeMezzanine()
      const floors = [makeMezzanineFloor({ code: 'MEZ-2', floor: 'FLOOR_2' })]
      const extensions = [makeMezzanineExtension()]
      prismaMock.mezzanine.update.mockResolvedValue(mezzanine as any)

      const result = await updateMezzanine('job-1', { floors, extensions })

      expect(result).toEqual(mezzanine)
      expect(prismaMock.mezzanine.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: {
          floors: { deleteMany: {}, createMany: { data: floors } },
          extensions: { deleteMany: {}, createMany: { data: extensions } },
        },
        include: { floors: true, extensions: true },
      })
    })

    it('updates mezzanine without touching floors/extensions when not provided', async () => {
      const mezzanine = makeMezzanine()
      prismaMock.mezzanine.update.mockResolvedValue(mezzanine as any)

      const result = await updateMezzanine('job-1', {})

      expect(result).toEqual(mezzanine)
      expect(prismaMock.mezzanine.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: {},
        include: { floors: true, extensions: true },
      })
    })
  })

  describe('deleteMezzanine', () => {
    it('deletes the mezzanine by job ID', async () => {
      prismaMock.mezzanine.delete.mockResolvedValue({} as any)

      await deleteMezzanine('job-1')

      expect(prismaMock.mezzanine.delete).toHaveBeenCalledWith({ where: { jobId: 'job-1' } })
    })
  })
})
