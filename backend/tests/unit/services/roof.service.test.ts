import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeRoof, makeRoofInput } from '../../helpers/factories.js'
import { createRoof, getRoofById, getRoofByJobId, updateRoof, deleteRoof } from '../../../services/roof.service.js'

describe('roof.service', () => {
  describe('createRoof', () => {
    it('creates a roof with given data', async () => {
      const input = makeRoofInput()
      const roof = makeRoof(input)
      prismaMock.roof.create.mockResolvedValue(roof as any)

      const result = await createRoof(input as any)

      expect(result).toEqual(roof)
      expect(prismaMock.roof.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: input })
      )
    })
  })

  describe('getRoofById', () => {
    it('returns roof when found', async () => {
      const roof = makeRoof()
      prismaMock.roof.findUnique.mockResolvedValue(roof as any)

      const result = await getRoofById(roof.id)

      expect(result).toEqual(roof)
    })

    it('returns null when not found', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(null)

      const result = await getRoofById('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('getRoofByJobId', () => {
    it('returns roof when found', async () => {
      const roof = makeRoof()
      prismaMock.roof.findUnique.mockResolvedValue(roof as any)

      const result = await getRoofByJobId(roof.jobId)

      expect(result).toEqual(roof)
    })

    it('returns null when not found', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(null)

      const result = await getRoofByJobId('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('updateRoof', () => {
    it('runs transaction and returns updated roof', async () => {
      const roof = makeRoof()
      // $transaction calls the callback with a tx object; mock it to invoke the callback
      prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock))
      prismaMock.roof.update.mockResolvedValue(roof as any)
      prismaMock.roof.findUnique.mockResolvedValue(roof as any)

      const result = await updateRoof(roof.id, { eaveHeight: 6 })

      expect(prismaMock.roof.update).toHaveBeenCalledWith({
        where: { id: roof.id },
        data: { eaveHeight: 6 },
      })
      expect(result).toEqual(roof)
    })
  })

  describe('deleteRoof', () => {
    it('deletes the roof by id', async () => {
      prismaMock.roof.delete.mockResolvedValue({} as any)

      await deleteRoof('roof-123')

      expect(prismaMock.roof.delete).toHaveBeenCalledWith({ where: { id: 'roof-123' } })
    })
  })
})
