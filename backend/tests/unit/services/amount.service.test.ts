import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeAmount, makeAmountItem } from '../../helpers/factories.js'
import {
  upsertAmount, getAmounts, getAmountByJobId, updateAmount, deleteAmount,
} from '../../../services/amount.service.js'

const INCLUDE = { items: true }

describe('amount.service', () => {
  describe('upsertAmount', () => {
    it('creates with items on first save', async () => {
      const item = makeAmountItem()
      const amount = makeAmount({ jobId: 'job-1', items: [item] })
      prismaMock.amount.upsert.mockResolvedValue(amount as any)

      const result = await upsertAmount('job-1', { items: [item] })

      expect(result).toEqual(amount)
      expect(prismaMock.amount.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { jobId: 'job-1' },
          create: expect.objectContaining({ jobId: 'job-1' }),
          include: INCLUDE,
        }),
      )
    })

    it('replaces items on subsequent save', async () => {
      const amount = makeAmount({ jobId: 'job-1' })
      prismaMock.amount.upsert.mockResolvedValue(amount as any)

      await upsertAmount('job-1', { items: [] })

      expect(prismaMock.amount.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: { items: { deleteMany: {}, createMany: { data: [] } } },
          include: INCLUDE,
        }),
      )
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
        where: { job: { userId: 'user_1' } }, skip: 10, take: 10, orderBy: { createdAt: 'desc' }, include: INCLUDE,
      })
    })
  })

  describe('getAmountByJobId', () => {
    it('returns amount when found', async () => {
      const amount = makeAmount()
      prismaMock.amount.findUnique.mockResolvedValue(amount as any)

      const result = await getAmountByJobId('job-1')

      expect(result).toEqual(amount)
      expect(prismaMock.amount.findUnique).toHaveBeenCalledWith({ where: { jobId: 'job-1' }, include: INCLUDE })
    })

    it('returns null when not found', async () => {
      prismaMock.amount.findUnique.mockResolvedValue(null)
      expect(await getAmountByJobId('nope')).toBeNull()
    })
  })

  describe('updateAmount', () => {
    it('replaces items wholesale', async () => {
      const item = makeAmountItem()
      const amount = makeAmount({ jobId: 'job-1', items: [item] })
      prismaMock.amount.update.mockResolvedValue(amount as any)

      const result = await updateAmount('job-1', { items: [item] })

      expect(result).toEqual(amount)
      expect(prismaMock.amount.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: { items: { deleteMany: {}, createMany: { data: [item] } } },
        include: INCLUDE,
      })
    })

    it('clears items when empty array provided', async () => {
      prismaMock.amount.update.mockResolvedValue(makeAmount({ jobId: 'job-1' }) as any)
      await updateAmount('job-1', { items: [] })
      expect(prismaMock.amount.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: { items: { deleteMany: {}, createMany: { data: [] } } },
        include: INCLUDE,
      })
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
