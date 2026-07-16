import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeRate } from '../../helpers/factories.js'
import { createRate, getRates, getRateById, updateRate, deleteRate } from '../../../services/rate.service.js'

describe('rate.service', () => {
  describe('createRate', () => {
    it('creates a rate and attaches the derived breakdown', async () => {
      const rate = makeRate({ item: 'STEEL STRUCTURE', unit: 'KG', material: 63, installation: 8, loadingUnloading: 3, marginPercentage: 15 })
      prismaMock.rate.create.mockResolvedValue(rate as any)

      const data = { item: 'STEEL STRUCTURE', unit: 'KG' as const }
      const result = await createRate(data)

      expect(prismaMock.rate.create).toHaveBeenCalledWith({ data })
      // fabricationRate = ceil(63*1.15) = 73, erectionRate = ceil(8*1.15) = 10, loading = 3
      expect(result).toMatchObject({ id: rate.id, fabricationRate: 73, erectionRate: 10, loadingRate: 3, totalRate: 86 })
    })
  })

  describe('getRates', () => {
    it('returns paginated rates each with a derived breakdown', async () => {
      const rates = [makeRate(), makeRate()]
      prismaMock.rate.findMany.mockResolvedValue(rates as any)
      prismaMock.rate.count.mockResolvedValue(2)

      const result = await getRates(2, 10)

      expect(result.total).toBe(2)
      expect(result.page).toBe(2)
      expect(result.data).toHaveLength(2)
      expect(result.data[0]).toHaveProperty('totalRate')
      expect(prismaMock.rate.findMany).toHaveBeenCalledWith({ skip: 10, take: 10, orderBy: { createdAt: 'desc' } })
      expect(prismaMock.rate.count).toHaveBeenCalledWith()
    })
  })

  describe('getRateById', () => {
    it('returns the rate with breakdown when found', async () => {
      const rate = makeRate()
      prismaMock.rate.findUnique.mockResolvedValue(rate as any)

      const result = await getRateById(rate.id)

      expect(result).toMatchObject({ id: rate.id, totalRate: 0 })
      expect(prismaMock.rate.findUnique).toHaveBeenCalledWith({ where: { id: rate.id } })
    })

    it('returns null when not found', async () => {
      prismaMock.rate.findUnique.mockResolvedValue(null)
      expect(await getRateById('nope')).toBeNull()
    })
  })

  describe('updateRate', () => {
    it('updates a rate and attaches the breakdown', async () => {
      const rate = makeRate({ marginPercentage: 0, material: 100, overheads: 5 })
      prismaMock.rate.update.mockResolvedValue(rate as any)

      const result = await updateRate(rate.id, { marginPercentage: 0 })

      expect(prismaMock.rate.update).toHaveBeenCalledWith({ where: { id: rate.id }, data: { marginPercentage: 0 } })
      // fabricationRate = ceil(100*1 + 5) = 105
      expect(result.fabricationRate).toBe(105)
    })
  })

  describe('deleteRate', () => {
    it('deletes the rate by id', async () => {
      prismaMock.rate.delete.mockResolvedValue({} as any)
      await deleteRate('rate-1')
      expect(prismaMock.rate.delete).toHaveBeenCalledWith({ where: { id: 'rate-1' } })
    })
  })
})
