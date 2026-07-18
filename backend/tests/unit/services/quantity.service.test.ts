import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeQuantity, makeQuantityPebRoof, makeQuantityMezzanine } from '../../helpers/factories.js'
import {
  upsertQuantity, getQuantities, getQuantityByJobId, updateQuantity, deleteQuantity,
} from '../../../services/quantity.service.js'

const INCLUDE = {
  pebRoof: true, cladding: true, canopy: true, accessories: true,
  mezzanine: true, stair: true, additionalBolts: true,
}

describe('quantity.service', () => {
  describe('upsertQuantity', () => {
    it('creates sections with nested create and upserts them on update', async () => {
      const pebRoof = makeQuantityPebRoof()
      const quantity = makeQuantity({ jobId: 'job-1', pebRoof })
      prismaMock.quantity.upsert.mockResolvedValue(quantity as any)

      const result = await upsertQuantity('job-1', { pebRoof })

      expect(result).toEqual(quantity)
      expect(prismaMock.quantity.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        create: { jobId: 'job-1', pebRoof: { create: pebRoof } },
        update: { pebRoof: { upsert: { create: pebRoof, update: pebRoof } } },
        include: INCLUDE,
      })
    })

    it('omits sections that were not provided', async () => {
      const quantity = makeQuantity({ jobId: 'job-2' })
      prismaMock.quantity.upsert.mockResolvedValue(quantity as any)

      await upsertQuantity('job-2', {})

      expect(prismaMock.quantity.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-2' },
        create: { jobId: 'job-2' },
        update: {},
        include: INCLUDE,
      })
    })
  })

  describe('getQuantities', () => {
    it("returns the user's paginated quantities", async () => {
      const quantities = [makeQuantity(), makeQuantity()]
      prismaMock.quantity.findMany.mockResolvedValue(quantities as any)
      prismaMock.quantity.count.mockResolvedValue(2)

      const result = await getQuantities('user_1', 2, 10)

      expect(result).toEqual({ data: quantities, total: 2, page: 2, pageSize: 10 })
      expect(prismaMock.quantity.findMany).toHaveBeenCalledWith({
        where: { job: { userId: 'user_1' } }, skip: 10, take: 10, orderBy: { createdAt: 'desc' }, include: INCLUDE,
      })
      expect(prismaMock.quantity.count).toHaveBeenCalledWith({ where: { job: { userId: 'user_1' } } })
    })
  })

  describe('getQuantityByJobId', () => {
    it('returns quantity when found', async () => {
      const quantity = makeQuantity()
      prismaMock.quantity.findUnique.mockResolvedValue(quantity as any)

      const result = await getQuantityByJobId('job-1')

      expect(result).toEqual(quantity)
      expect(prismaMock.quantity.findUnique).toHaveBeenCalledWith({ where: { jobId: 'job-1' }, include: INCLUDE })
    })

    it('returns null when not found', async () => {
      prismaMock.quantity.findUnique.mockResolvedValue(null)
      expect(await getQuantityByJobId('nope')).toBeNull()
    })
  })

  describe('updateQuantity', () => {
    it('upserts each provided section', async () => {
      const mezzanine = makeQuantityMezzanine()
      const quantity = makeQuantity({ jobId: 'job-1', mezzanine })
      prismaMock.quantity.update.mockResolvedValue(quantity as any)

      const result = await updateQuantity('job-1', { mezzanine })

      expect(result).toEqual(quantity)
      expect(prismaMock.quantity.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: { mezzanine: { upsert: { create: mezzanine, update: mezzanine } } },
        include: INCLUDE,
      })
    })

    it('sends an empty data object when no sections are provided', async () => {
      prismaMock.quantity.update.mockResolvedValue(makeQuantity() as any)

      await updateQuantity('job-1', {})

      expect(prismaMock.quantity.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' }, data: {}, include: INCLUDE,
      })
    })
  })

  describe('deleteQuantity', () => {
    it('deletes the quantity by job ID', async () => {
      prismaMock.quantity.delete.mockResolvedValue({} as any)
      await deleteQuantity('job-1')
      expect(prismaMock.quantity.delete).toHaveBeenCalledWith({ where: { jobId: 'job-1' } })
    })
  })
})
