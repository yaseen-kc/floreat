import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeSpec, makeSpecInput } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import type { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

beforeEach(() => { prismaMock.job.findFirst.mockResolvedValue(makeJob() as any) })

describe('Spec routes integration', () => {
  describe('authentication', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetAuth.mockReturnValueOnce({ userId: null })

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/spec' })

      expect(res.statusCode).toBe(401)
    })

    it('returns 404 when the job is not owned by the user', async () => {
      prismaMock.job.findFirst.mockResolvedValueOnce(null)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/spec' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('POST /api/jobs/:jobId/spec', () => {
    it('upserts a spec', async () => {
      const input = makeSpecInput()
      const spec = makeSpec({ jobId: 'job-1', ...input })
      prismaMock.spec.upsert.mockResolvedValue(spec as any)

      const res = await app.inject({ method: 'POST', url: '/api/jobs/job-1/spec', payload: input })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(spec.id)
    })

    it('rejects an invalid payload', async () => {
      const res = await app.inject({ method: 'POST', url: '/api/jobs/job-1/spec', payload: { products: [{ yieldStrengthMpa: -1 }] } })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs/:jobId/spec', () => {
    it('returns the spec when found', async () => {
      const spec = makeSpec({ jobId: 'job-1' })
      prismaMock.spec.findUnique.mockResolvedValue(spec as any)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/spec' })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(spec.id)
    })

    it('returns 404 when no spec exists for the job', async () => {
      prismaMock.spec.findUnique.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/spec' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('GET /api/specs', () => {
    it('returns a paginated list', async () => {
      const specs = [makeSpec(), makeSpec()]
      prismaMock.spec.findMany.mockResolvedValue(specs as any)
      prismaMock.spec.count.mockResolvedValue(2)

      const res = await app.inject({ method: 'GET', url: '/api/specs?page=1&pageSize=10' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(2)
      expect(res.json().total).toBe(2)
    })

    it('rejects invalid pagination', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/specs?page=0' })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('PUT /api/jobs/:jobId/spec', () => {
    it('updates a spec', async () => {
      const spec = makeSpec({ jobId: 'job-1' })
      prismaMock.spec.update.mockResolvedValue(spec as any)

      const res = await app.inject({
        method: 'PUT',
        url: '/api/jobs/job-1/spec',
        payload: { products: [{ description: 'Updated description' }] },
      })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when not found', async () => {
      prismaMock.spec.update.mockRejectedValue(Object.assign(new Error('missing'), { code: 'P2025' }))

      const res = await app.inject({
        method: 'PUT',
        url: '/api/jobs/job-1/spec',
        payload: { products: [{ description: 'Updated description' }] },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:jobId/spec', () => {
    it('returns 204 with no body', async () => {
      prismaMock.spec.delete.mockResolvedValue(makeSpec() as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/spec' })

      expect(res.statusCode).toBe(204)
      expect(res.body).toBe('')
    })

    it('returns 404 when not found', async () => {
      prismaMock.spec.delete.mockRejectedValue(Object.assign(new Error('missing'), { code: 'P2025' }))

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/spec' })

      expect(res.statusCode).toBe(404)
    })
  })
})
