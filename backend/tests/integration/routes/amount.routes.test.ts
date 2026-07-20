import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeAmount, makeAmountItem } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

beforeEach(() => { prismaMock.job.findFirst.mockResolvedValue(makeJob() as any) })

describe('Amount routes integration', () => {
  describe('authentication', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetAuth.mockReturnValueOnce({ userId: null })
      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/amount' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/jobs/:jobId/amount', () => {
    it('upserts an amount with items', async () => {
      const item = makeAmountItem()
      const amount = makeAmount({ jobId: 'job-1', items: [item] })
      prismaMock.amount.upsert.mockResolvedValue(amount as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/amount',
        payload: { items: [item] },
      })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(amount.id)
    })

    it('accepts an empty payload (draft save)', async () => {
      prismaMock.amount.upsert.mockResolvedValue(makeAmount({ jobId: 'job-1' }) as any)
      const res = await app.inject({ method: 'POST', url: '/api/jobs/job-1/amount', payload: {} })
      expect(res.statusCode).toBe(200)
    })

    it('rejects an invalid unit enum', async () => {
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/amount',
        payload: { items: [{ unit: 'TONNES' }] },
      })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs/:jobId/amount', () => {
    it('returns the amount with items', async () => {
      const amount = makeAmount({ jobId: 'job-1' })
      prismaMock.amount.findUnique.mockResolvedValue(amount as any)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/amount' })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(amount.id)
    })

    it('returns 404 when no amount exists for job', async () => {
      prismaMock.amount.findUnique.mockResolvedValue(null)
      const res = await app.inject({ method: 'GET', url: '/api/jobs/nope/amount' })
      expect(res.statusCode).toBe(404)
    })
  })

  describe('GET /api/amounts', () => {
    it('returns paginated amounts list', async () => {
      prismaMock.amount.findMany.mockResolvedValue([makeAmount(), makeAmount()] as any)
      prismaMock.amount.count.mockResolvedValue(2)

      const res = await app.inject({ method: 'GET', url: '/api/amounts?page=1&pageSize=10' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(2)
      expect(res.json().total).toBe(2)
    })
  })

  describe('PUT /api/jobs/:jobId/amount', () => {
    it('updates an amount', async () => {
      prismaMock.amount.update.mockResolvedValue(makeAmount({ jobId: 'job-1' }) as any)
      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/job-1/amount',
        payload: { items: [makeAmountItem()] },
      })
      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when not found', async () => {
      prismaMock.amount.update.mockRejectedValue(new Error('Not found'))
      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/nope/amount', payload: {},
      })
      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:jobId/amount', () => {
    it('deletes an amount', async () => {
      prismaMock.amount.delete.mockResolvedValue({} as any)
      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/amount' })
      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when not found', async () => {
      prismaMock.amount.delete.mockRejectedValue(Object.assign(new Error('Not found'), { code: 'P2025' }))
      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/nope/amount' })
      expect(res.statusCode).toBe(404)
    })
  })
})
