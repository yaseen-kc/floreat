import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeLoad, makeLoadInput } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

describe('load controller', () => {
  describe('POST /api/jobs/:jobId/load', () => {
    it('returns 200 with valid body (upsert)', async () => {
      const { jobId, ...body } = makeLoadInput('job-1')
      const load = makeLoad({ jobId: 'job-1' })
      prismaMock.load.upsert.mockResolvedValue(load as any)

      const res = await app.inject({ method: 'POST', url: '/api/jobs/job-1/load', payload: body })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(load.id)
    })

    it('returns 200 with an empty body (all fields optional)', async () => {
      prismaMock.load.upsert.mockResolvedValue(makeLoad({ jobId: 'job-1' }) as any)

      const res = await app.inject({ method: 'POST', url: '/api/jobs/job-1/load', payload: {} })

      expect(res.statusCode).toBe(200)
    })

    it('returns 400 with an invalid body', async () => {
      const res = await app.inject({ method: 'POST', url: '/api/jobs/job-1/load', payload: { snowLoad: -1 } })

      expect(res.statusCode).toBe(400)
      expect(res.json().error).toBeDefined()
    })
  })

  describe('GET /api/loads', () => {
    it('returns 200 with paginated data', async () => {
      const loads = [makeLoad()]
      prismaMock.load.findMany.mockResolvedValue(loads as any)
      prismaMock.load.count.mockResolvedValue(1)

      const res = await app.inject({ method: 'GET', url: '/api/loads' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(1)
      expect(res.json().total).toBe(1)
    })

    it('returns 400 with invalid pagination', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/loads?page=-1' })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs/:jobId/load', () => {
    it('returns 200 when found', async () => {
      const load = makeLoad({ jobId: 'job-1' })
      prismaMock.load.findUnique.mockResolvedValue(load as any)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/load' })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(load.id)
    })

    it('returns 404 when not found', async () => {
      prismaMock.load.findUnique.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/nonexistent/load' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('PUT /api/jobs/:jobId/load', () => {
    it('returns 200 with a valid update', async () => {
      const load = makeLoad({ jobId: 'job-1' })
      prismaMock.load.update.mockResolvedValue(load as any)

      const res = await app.inject({ method: 'PUT', url: '/api/jobs/job-1/load', payload: { snowLoad: 4 } })

      expect(res.statusCode).toBe(200)
    })

    it('returns 400 with an invalid body', async () => {
      const res = await app.inject({ method: 'PUT', url: '/api/jobs/job-1/load', payload: { snowLoad: -5 } })

      expect(res.statusCode).toBe(400)
    })

    it('returns 404 when load not found', async () => {
      prismaMock.load.update.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({ method: 'PUT', url: '/api/jobs/nonexistent/load', payload: { snowLoad: 4 } })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:jobId/load', () => {
    it('returns 204 on success', async () => {
      prismaMock.load.delete.mockResolvedValue({} as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/load' })

      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when load not found', async () => {
      prismaMock.load.delete.mockRejectedValue(Object.assign(new Error('Not found'), { code: 'P2025' }))

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/nonexistent/load' })

      expect(res.statusCode).toBe(404)
    })

    it('propagates a non-P2025 error as 500', async () => {
      prismaMock.load.delete.mockRejectedValue(new Error('boom'))

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/load' })

      expect(res.statusCode).toBe(500)
    })
  })
})
