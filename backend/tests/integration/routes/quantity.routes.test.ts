import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeQuantity, makeQuantityPebRoof } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

// jobOwnership preHandler resolves the owning job for every /jobs/:jobId route.
beforeEach(() => { prismaMock.job.findFirst.mockResolvedValue(makeJob() as any) })

describe('Quantity routes integration', () => {
  describe('authentication', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetAuth.mockReturnValueOnce({ userId: null })
      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/quantity' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/jobs/:jobId/quantity', () => {
    it('upserts a quantity with a section', async () => {
      const pebRoof = makeQuantityPebRoof()
      const quantity = makeQuantity({ jobId: 'job-1', pebRoof })
      prismaMock.quantity.upsert.mockResolvedValue(quantity as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/quantity',
        payload: { pebRoof },
      })

      if (res.statusCode !== 200) console.log(JSON.stringify(res.json().error?.fieldErrors, null, 2))
      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(quantity.id)
      expect(prismaMock.quantity.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ create: { jobId: 'job-1', pebRoof: { create: expect.any(Object) } } }),
      )
    })

    it('accepts an empty payload (draft save)', async () => {
      prismaMock.quantity.upsert.mockResolvedValue(makeQuantity({ jobId: 'job-1' }) as any)
      const res = await app.inject({ method: 'POST', url: '/api/jobs/job-1/quantity', payload: {} })
      expect(res.statusCode).toBe(200)
    })

    it('rejects an invalid data type', async () => {
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/quantity',
        payload: { pebRoof: { pebRoofQuantity: 'TONNES' } },
      })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs/:jobId/quantity', () => {
    it('returns the quantity with sections', async () => {
      const quantity = makeQuantity({ jobId: 'job-1' })
      prismaMock.quantity.findUnique.mockResolvedValue(quantity as any)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/quantity' })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(quantity.id)
    })

    it('returns 404 when no quantity exists for job', async () => {
      prismaMock.quantity.findUnique.mockResolvedValue(null)
      const res = await app.inject({ method: 'GET', url: '/api/jobs/nope/quantity' })
      expect(res.statusCode).toBe(404)
    })
  })

  describe('GET /api/quantities', () => {
    it('returns paginated quantities list', async () => {
      prismaMock.quantity.findMany.mockResolvedValue([makeQuantity(), makeQuantity()] as any)
      prismaMock.quantity.count.mockResolvedValue(2)

      const res = await app.inject({ method: 'GET', url: '/api/quantities?page=1&pageSize=10' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(2)
      expect(res.json().total).toBe(2)
    })
  })

  describe('PUT /api/jobs/:jobId/quantity', () => {
    it('updates a quantity', async () => {
      prismaMock.quantity.update.mockResolvedValue(makeQuantity({ jobId: 'job-1' }) as any)
      const res = await app.inject({
        method: 'PUT',
        url: '/api/jobs/job-1/quantity',
        payload: { stair: { totalWeightofStepsQuantity: 12 } },
      })
      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when not found', async () => {
      prismaMock.quantity.update.mockRejectedValue(new Error('Not found'))
      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/nope/quantity', payload: { stair: {} },
      })
      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:jobId/quantity', () => {
    it('deletes a quantity', async () => {
      prismaMock.quantity.delete.mockResolvedValue({} as any)
      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/quantity' })
      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when not found', async () => {
      prismaMock.quantity.delete.mockRejectedValue(Object.assign(new Error('Not found'), { code: 'P2025' }))
      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/nope/quantity' })
      expect(res.statusCode).toBe(404)
    })
  })
})
