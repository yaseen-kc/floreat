import { describe, it, expect, beforeEach } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeAmount, makeAmountInput } from '../../helpers/factories.js'
import {
  upsertAmount, getAmounts, getAmountByJobId, updateAmount, deleteAmount,
} from '../../../services/amount.service.js'
import { DEFAULT_AMOUNT_ITEMS } from '@floreat/shared/schemas'

beforeEach(() => {
  prismaMock.job.findUnique.mockResolvedValue({ id: 'job-1', roof: null, mezzanine: null, stair: null, canopy: null, accessories: null, joint: null, quantity: null } as any)
  prismaMock.rate.findMany.mockResolvedValue(DEFAULT_AMOUNT_ITEMS.map((item) => ({ item: item.rateItem ?? item.description, fabricationRate: 50, erectionRate: 20, loadingRate: 5 })) as any)
})

describe('amount.service', () => {
  describe('upsertAmount', () => {
    it('creates or updates amount with flat fields', async () => {
      const input = makeAmountInput()
      const amount = makeAmount({ jobId: 'job-1', ...input })
      prismaMock.amount.upsert.mockResolvedValue(amount as any)

      const result = await upsertAmount('job-1', input)

      expect(result).toEqual(amount)
      expect(prismaMock.amount.upsert).toHaveBeenCalledWith(expect.objectContaining({
        where: { jobId: 'job-1' },
        create: expect.objectContaining({ jobId: 'job-1', calculationVersion: 'amount-v1', isStale: false }),
        update: expect.objectContaining({ calculationVersion: 'amount-v1', isStale: false }),
      }))
    })

    it('accepts empty payload', async () => {
      prismaMock.amount.upsert.mockResolvedValue(makeAmount({ jobId: 'job-2' }) as any)
      await upsertAmount('job-2', {})
      expect(prismaMock.amount.upsert).toHaveBeenCalled()
    })
  })

  describe('getAmounts', () => {
    it("returns the user's paginated amounts", async () => {
      const amounts = [makeAmount(), makeAmount()]
      prismaMock.amount.findMany.mockResolvedValue(amounts as any)
      prismaMock.amount.count.mockResolvedValue(2)

      const result = await getAmounts('user_1', 2, 10)

      expect(result).toEqual({ data: amounts, total: 2, page: 2, pageSize: 10 })
      expect(prismaMock.amount.findMany).toHaveBeenCalledWith({
        where: { job: { userId: 'user_1' } }, skip: 10, take: 10, orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('getAmountByJobId', () => {
    it('returns amount when found', async () => {
      const amount = makeAmount()
      prismaMock.amount.findUnique.mockResolvedValue(amount as any)

      const result = await getAmountByJobId('job-1')

      expect(result).toEqual(amount)
      expect(prismaMock.amount.findUnique).toHaveBeenCalledWith({ where: { jobId: 'job-1' } })
    })

    it('returns null when not found', async () => {
      prismaMock.amount.findUnique.mockResolvedValue(null)
      expect(await getAmountByJobId('nope')).toBeNull()
    })
  })

  describe('updateAmount', () => {
    it('updates flat fields', async () => {
      const input = makeAmountInput()
      const amount = makeAmount({ jobId: 'job-1', ...input })
      prismaMock.amount.update.mockResolvedValue(amount as any)

      const result = await updateAmount('job-1', input)

      expect(result).toEqual(amount)
      expect(prismaMock.amount.update).toHaveBeenCalledWith(expect.objectContaining({ where: { jobId: 'job-1' }, data: expect.objectContaining({ calculationVersion: 'amount-v1' }) }))
    })
  })

  describe('deleteAmount', () => {
    it('deletes the amount by job ID', async () => {
      prismaMock.amount.delete.mockResolvedValue({} as any)
      await deleteAmount('job-1')
      expect(prismaMock.amount.delete).toHaveBeenCalledWith({ where: { jobId: 'job-1' } })
    })
  })
})
