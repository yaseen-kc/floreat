import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeJobInput } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

describe('job controller', () => {
  describe('POST /api/jobs', () => {
    it('returns 201 with valid body', async () => {
      const input = makeJobInput()
      const job = makeJob(input)
      prismaMock.job.create.mockResolvedValue(job as any)

      const res = await app.inject({ method: 'POST', url: '/api/jobs', payload: input })

      expect(res.statusCode).toBe(201)
      expect(res.json().id).toBe(job.id)
    })

    it('returns 400 with invalid body', async () => {
      const res = await app.inject({ method: 'POST', url: '/api/jobs', payload: {} })

      expect(res.statusCode).toBe(400)
      expect(res.json().error).toBeDefined()
    })
  })

  describe('GET /api/jobs', () => {
    it('returns 200 with paginated data', async () => {
      const jobs = [makeJob()]
      prismaMock.job.findMany.mockResolvedValue(jobs as any)
      prismaMock.job.count.mockResolvedValue(1)

      const res = await app.inject({ method: 'GET', url: '/api/jobs' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(1)
      expect(res.json().total).toBe(1)
    })

    it('returns 400 with invalid pagination', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/jobs?page=-1' })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs/:id', () => {
    it('returns 200 when found', async () => {
      const job = makeJob()
      prismaMock.job.findUnique.mockResolvedValue(job as any)

      const res = await app.inject({ method: 'GET', url: `/api/jobs/${job.id}` })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(job.id)
    })

    it('returns 404 when not found', async () => {
      prismaMock.job.findUnique.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/nonexistent' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('PUT /api/jobs/:id', () => {
    it('returns 200 with valid update', async () => {
      const job = makeJob()
      prismaMock.job.update.mockResolvedValue(job as any)

      const res = await app.inject({
        method: 'PUT', url: `/api/jobs/${job.id}`,
        payload: { subject: 'updated' },
      })

      expect(res.statusCode).toBe(200)
    })

    it('returns 400 with invalid body', async () => {
      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/some-id',
        payload: { numberOfBuilding: -5 },
      })

      expect(res.statusCode).toBe(400)
    })

    it('returns 404 when job not found', async () => {
      prismaMock.job.update.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/nonexistent',
        payload: { subject: 'updated' },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:id', () => {
    it('returns 204 on success', async () => {
      prismaMock.job.delete.mockResolvedValue({} as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-123' })

      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when job not found', async () => {
      prismaMock.job.delete.mockRejectedValue(Object.assign(new Error('Not found'), { code: 'P2025' }))

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/nonexistent' })

      expect(res.statusCode).toBe(404)
    })
  })
})
