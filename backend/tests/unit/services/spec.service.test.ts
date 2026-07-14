import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeSpec, makeSpecInput } from '../../helpers/factories.js'
import { upsertSpec, getSpecs, getSpecByJobId, updateSpec, deleteSpec } from '../../../services/spec.service.js'

describe('spec.service', () => {
  describe('upsertSpec', () => {
    it('upserts a spec for the given job', async () => {
      const input = makeSpecInput()
      const spec = makeSpec({ jobId: 'job-1', ...input })
      prismaMock.spec.upsert.mockResolvedValue(spec as any)

      const result = await upsertSpec('job-1', input)

      expect(result).toEqual(spec)
      expect(prismaMock.spec.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        create: { jobId: 'job-1', ...input },
        update: { ...input },
      })
    })
  })

  describe('getSpecs', () => {
    it("returns the user's paginated specs", async () => {
      const specs = [makeSpec(), makeSpec()]
      prismaMock.spec.findMany.mockResolvedValue(specs as any)
      prismaMock.spec.count.mockResolvedValue(2)

      const result = await getSpecs('user_1', 2, 10)

      expect(result).toEqual({ data: specs, total: 2, page: 2, pageSize: 10 })
      expect(prismaMock.spec.findMany).toHaveBeenCalledWith({
        where: { job: { userId: 'user_1' } }, skip: 10, take: 10, orderBy: { createdAt: 'desc' },
      })
      expect(prismaMock.spec.count).toHaveBeenCalledWith({ where: { job: { userId: 'user_1' } } })
    })
  })

  describe('getSpecByJobId', () => {
    it('returns spec when found', async () => {
      const spec = makeSpec()
      prismaMock.spec.findUnique.mockResolvedValue(spec as any)

      const result = await getSpecByJobId('job-1')

      expect(result).toEqual(spec)
      expect(prismaMock.spec.findUnique).toHaveBeenCalledWith({ where: { jobId: 'job-1' } })
    })

    it('returns null when not found', async () => {
      prismaMock.spec.findUnique.mockResolvedValue(null)

      const result = await getSpecByJobId('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('updateSpec', () => {
    it('updates a spec by job ID', async () => {
      const spec = makeSpec()
      const data = { description: 'Updated description' }
      prismaMock.spec.update.mockResolvedValue(spec as any)

      const result = await updateSpec('job-1', data)

      expect(result).toEqual(spec)
      expect(prismaMock.spec.update).toHaveBeenCalledWith({ where: { jobId: 'job-1' }, data })
    })
  })

  describe('deleteSpec', () => {
    it('deletes the spec by job ID', async () => {
      prismaMock.spec.delete.mockResolvedValue({} as any)

      await deleteSpec('job-1')

      expect(prismaMock.spec.delete).toHaveBeenCalledWith({ where: { jobId: 'job-1' } })
    })
  })
})
