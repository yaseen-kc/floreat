import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeMezzanine, makeMezzanineFloor, makeMezzanineExtension } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

beforeEach(() => { prismaMock.job.findFirst.mockResolvedValue(makeJob() as any) })

describe('mezzanine controller', () => {
  describe('POST /api/jobs/:jobId/mezzanine', () => {
    it('returns 200 with valid body (upsert)', async () => {
      const body = { floors: [makeMezzanineFloor()], extensions: [makeMezzanineExtension()] }
      const mezzanine = makeMezzanine({ jobId: 'job-1' })
      prismaMock.mezzanine.upsert.mockResolvedValue(mezzanine as any)

      const res = await app.inject({ method: 'POST', url: '/api/jobs/job-1/mezzanine', payload: body })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(mezzanine.id)
    })

    it('returns 200 with empty body (no floors/extensions)', async () => {
      const mezzanine = makeMezzanine({ jobId: 'job-1' })
      prismaMock.mezzanine.upsert.mockResolvedValue(mezzanine as any)

      const res = await app.inject({ method: 'POST', url: '/api/jobs/job-1/mezzanine', payload: {} })

      expect(res.statusCode).toBe(200)
    })

    it('returns 400 with invalid floor body', async () => {
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/mezzanine',
        payload: { floors: [makeMezzanineFloor({ code: 'BAD-1' as any })] },
      })

      expect(res.statusCode).toBe(400)
      expect(res.json().error).toBeDefined()
    })
  })

  describe('GET /api/mezzanines', () => {
    it('returns 200 with paginated data', async () => {
      const mezzanines = [makeMezzanine()]
      prismaMock.mezzanine.findMany.mockResolvedValue(mezzanines as any)
      prismaMock.mezzanine.count.mockResolvedValue(1)

      const res = await app.inject({ method: 'GET', url: '/api/mezzanines' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(1)
      expect(res.json().total).toBe(1)
    })

    it('returns 400 with invalid pagination', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/mezzanines?page=-1' })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs/:jobId/mezzanine', () => {
    it('returns 200 when found', async () => {
      const mezzanine = makeMezzanine({ jobId: 'job-1' })
      prismaMock.mezzanine.findUnique.mockResolvedValue(mezzanine as any)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/mezzanine' })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(mezzanine.id)
    })

    it('returns 404 when not found', async () => {
      prismaMock.mezzanine.findUnique.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/nonexistent/mezzanine' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('PUT /api/jobs/:jobId/mezzanine', () => {
    it('returns 200 with valid update', async () => {
      const mezzanine = makeMezzanine({ jobId: 'job-1' })
      prismaMock.mezzanine.update.mockResolvedValue(mezzanine as any)

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/job-1/mezzanine',
        payload: { floors: [makeMezzanineFloor()] },
      })

      expect(res.statusCode).toBe(200)
    })

    it('returns 400 with invalid body', async () => {
      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/job-1/mezzanine',
        payload: { floors: [makeMezzanineFloor({ beamsMidPrimary: -5 })] },
      })

      expect(res.statusCode).toBe(400)
    })

    it('returns 404 when mezzanine not found', async () => {
      prismaMock.mezzanine.update.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/nonexistent/mezzanine',
        payload: { floors: [makeMezzanineFloor()] },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:jobId/mezzanine', () => {
    it('returns 204 on success', async () => {
      prismaMock.mezzanine.delete.mockResolvedValue({} as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/mezzanine' })

      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when mezzanine not found', async () => {
      prismaMock.mezzanine.delete.mockRejectedValue(Object.assign(new Error('Not found'), { code: 'P2025' }))

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/nonexistent/mezzanine' })

      expect(res.statusCode).toBe(404)
    })
  })
})
