import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeRoof, makeRoofInput } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

describe('roof controller', () => {
  describe('POST /api/jobs/:jobId/roof', () => {
    it('returns 200 with valid body (upsert)', async () => {
      const input = makeRoofInput('job-1')
      const { jobId, ...body } = input
      const roof = makeRoof({ jobId: 'job-1' })
      prismaMock.roof.upsert.mockResolvedValue(roof as any)

      const res = await app.inject({ method: 'POST', url: '/api/jobs/job-1/roof', payload: body })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(roof.id)
    })

    it('returns 400 with invalid body', async () => {
      const res = await app.inject({ method: 'POST', url: '/api/jobs/job-1/roof', payload: {} })

      expect(res.statusCode).toBe(400)
      expect(res.json().error).toBeDefined()
    })
  })

  describe('GET /api/roofs', () => {
    it('returns 200 with paginated data', async () => {
      const roofs = [makeRoof()]
      prismaMock.roof.findMany.mockResolvedValue(roofs as any)
      prismaMock.roof.count.mockResolvedValue(1)

      const res = await app.inject({ method: 'GET', url: '/api/roofs' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(1)
      expect(res.json().total).toBe(1)
    })

    it('returns 400 with invalid pagination', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/roofs?page=-1' })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs/:jobId/roof', () => {
    it('returns 200 when found', async () => {
      const roof = makeRoof({ jobId: 'job-1' })
      prismaMock.roof.findUnique.mockResolvedValue(roof as any)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/roof' })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(roof.id)
    })

    it('returns 404 when not found', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/nonexistent/roof' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('PUT /api/jobs/:jobId/roof', () => {
    it('returns 200 with valid update', async () => {
      const roof = makeRoof({ jobId: 'job-1' })
      prismaMock.roof.update.mockResolvedValue(roof as any)

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/job-1/roof',
        payload: { roofSlope: 8 },
      })

      expect(res.statusCode).toBe(200)
    })

    it('returns 400 with invalid body', async () => {
      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/job-1/roof',
        payload: { mainRoofFrames: -5 },
      })

      expect(res.statusCode).toBe(400)
    })

    it('returns 404 when roof not found', async () => {
      prismaMock.roof.update.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/nonexistent/roof',
        payload: { roofSlope: 8 },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:jobId/roof', () => {
    it('returns 204 on success', async () => {
      prismaMock.roof.delete.mockResolvedValue({} as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/roof' })

      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when roof not found', async () => {
      prismaMock.roof.delete.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/nonexistent/roof' })

      expect(res.statusCode).toBe(404)
    })
  })
})
