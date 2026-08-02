import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeRate } from '../../helpers/factories.js'
import { createRate, getRates, getRateById, updateRate, deleteRate } from '../../../services/rate.service.js'

const JOB = 'job-1'

describe('rate.service', () => {
  it('creates a job-owned rate with derived fields', async () => {
    const rate = makeRate({ jobId: JOB })
    prismaMock.rate.create.mockResolvedValue(rate as any)
    const result = await createRate(JOB, { item: 'STEEL STRUCTURE', unit: 'KG', material: 63, installation: 8, loadingUnloading: 3, marginPercentage: 15 })
    expect(result).toEqual(rate)
    expect(prismaMock.rate.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ jobId: JOB, item: 'STEEL STRUCTURE' }) }))
  })

  it('lists only one job\'s rates', async () => {
    prismaMock.rate.findMany.mockResolvedValue([makeRate()] as any)
    prismaMock.rate.count.mockResolvedValue(1)
    const result = await getRates(JOB, 2, 10)
    expect(result).toMatchObject({ total: 1, page: 2, pageSize: 10 })
    expect(prismaMock.rate.findMany).toHaveBeenCalledWith({ where: { jobId: JOB }, skip: 10, take: 10, orderBy: { createdAt: 'desc' } })
    expect(prismaMock.rate.count).toHaveBeenCalledWith({ where: { jobId: JOB } })
  })

  it('scopes reads, updates, and deletes by jobId', async () => {
    const rate = makeRate({ jobId: JOB })
    prismaMock.rate.findFirst.mockResolvedValue(rate as any)
    prismaMock.rate.update.mockResolvedValue(rate as any)
    prismaMock.rate.delete.mockResolvedValue(rate as any)
    await expect(getRateById(JOB, rate.id)).resolves.toEqual(rate)
    await updateRate(JOB, rate.id, { marginPercentage: 0 })
    await deleteRate(JOB, rate.id)
    expect(prismaMock.rate.findFirst).toHaveBeenCalledWith({ where: { id: rate.id, jobId: JOB } })
    expect(prismaMock.rate.delete).toHaveBeenCalledWith({ where: { id: rate.id } })
  })

  it('returns not found for a rate ID owned by another job', async () => {
    prismaMock.rate.findFirst.mockResolvedValue(null)
    await expect(getRateById('other-job', 'rate-1')).resolves.toBeNull()
    await expect(updateRate('other-job', 'rate-1', {})).rejects.toMatchObject({ code: 'P2025' })
    await expect(deleteRate('other-job', 'rate-1')).rejects.toMatchObject({ code: 'P2025' })
  })
})
