import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeRoof, makeRoofInput } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

describe('Roof routes integration', () => {
  describe('authentication', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetAuth.mockReturnValueOnce({ userId: null })
      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/roof' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/jobs/:jobId/roof', () => {
    it('upserts a roof with sidewalls', async () => {
      const input = makeRoofInput('job-1')
      const { jobId, ...body } = input
      const sidewalls = [{ side: 'FRONT', wallType: 'BRICK', thickness: 0.23, height: 3.5 }]
      const roof = makeRoof({ jobId: 'job-1', sidewalls })
      prismaMock.roof.upsert.mockResolvedValue(roof as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/roof',
        payload: { ...body, sidewalls },
      })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(roof.id)
      expect(res.json().sidewalls).toEqual(sidewalls)
    })

    it('accepts and persists material consumption and SAG rod fields', async () => {
      const input = makeRoofInput('job-1')
      const { jobId, ...body } = input
      const extras = {
        materialConsumptionExcludingPurlin: 12.5,
        DiaOfRoofSagRod: 12,
        DiaOfCladdingSagRod: 10,
      }
      const roof = makeRoof({ jobId: 'job-1', ...extras })
      prismaMock.roof.upsert.mockResolvedValue(roof as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/roof',
        payload: { ...body, ...extras },
      })

      expect(res.statusCode).toBe(200)
      expect(prismaMock.roof.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining(extras),
        }),
      )
      expect(res.json().materialConsumptionExcludingPurlin).toBe(12.5)
      expect(res.json().DiaOfRoofSagRod).toBe(12)
      expect(res.json().DiaOfCladdingSagRod).toBe(10)
    })

    it('rejects a negative SAG rod diameter', async () => {
      const input = makeRoofInput('job-1')
      const { jobId, ...body } = input
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/roof',
        payload: { ...body, DiaOfRoofSagRod: -1 },
      })
      expect(res.statusCode).toBe(400)
    })

    it('rejects invalid payload', async () => {
      const res = await app.inject({ method: 'POST', url: '/api/jobs/job-1/roof', payload: { roofSlope: -1 } })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs/:jobId/roof', () => {
    it('returns roof with sidewalls', async () => {
      const roof = makeRoof({ jobId: 'job-1' })
      prismaMock.roof.findUnique.mockResolvedValue(roof as any)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/roof' })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(roof.id)
    })

    it('returns 404 when no roof exists for job', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/nope/roof' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('GET /api/roofs', () => {
    it('returns paginated roofs list', async () => {
      const roofs = [makeRoof(), makeRoof()]
      prismaMock.roof.findMany.mockResolvedValue(roofs as any)
      prismaMock.roof.count.mockResolvedValue(2)

      const res = await app.inject({ method: 'GET', url: '/api/roofs?page=1&pageSize=10' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(2)
      expect(res.json().total).toBe(2)
    })
  })

  describe('PUT /api/jobs/:jobId/roof', () => {
    it('updates a roof', async () => {
      const roof = makeRoof({ jobId: 'job-1' })
      prismaMock.roof.update.mockResolvedValue(roof as any)

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/job-1/roof',
        payload: { roofSlope: 10 },
      })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when not found', async () => {
      prismaMock.roof.update.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/nope/roof',
        payload: { roofSlope: 10 },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:jobId/roof', () => {
    it('deletes a roof', async () => {
      prismaMock.roof.delete.mockResolvedValue({} as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/roof' })

      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when not found', async () => {
      prismaMock.roof.delete.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/nope/roof' })

      expect(res.statusCode).toBe(404)
    })
  })
})
