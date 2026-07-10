import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeJobInput, makeUser } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

describe('Job routes integration', () => {
  describe('authentication', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetAuth.mockReturnValueOnce({ userId: null })
      const res = await app.inject({ method: 'GET', url: '/api/jobs' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/jobs', () => {
    it('creates a job successfully', async () => {
      const input = makeJobInput()
      const job = makeJob(input)
      prismaMock.user.findUnique.mockResolvedValue(makeUser() as any)
      prismaMock.job.create.mockResolvedValue(job as any)

      const res = await app.inject({ method: 'POST', url: '/api/jobs', payload: input })

      expect(res.statusCode).toBe(201)
      expect(res.json().projectNo).toBe(input.projectNo)
    })

    it('rejects invalid payload', async () => {
      prismaMock.user.findUnique.mockResolvedValue(makeUser() as any)
      const res = await app.inject({ method: 'POST', url: '/api/jobs', payload: { subject: '' } })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs', () => {
    it('returns paginated jobs list', async () => {
      const jobs = [makeJob(), makeJob()]
      prismaMock.job.findMany.mockResolvedValue(jobs as any)
      prismaMock.job.count.mockResolvedValue(2)

      const res = await app.inject({ method: 'GET', url: '/api/jobs?page=1&pageSize=10' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(2)
      expect(res.json().total).toBe(2)
    })
  })

  describe('GET /api/jobs/:id', () => {
    it('returns a job', async () => {
      const job = makeJob()
      prismaMock.job.findFirst.mockResolvedValue(job as any)

      const res = await app.inject({ method: 'GET', url: `/api/jobs/${job.id}` })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 for nonexistent job', async () => {
      prismaMock.job.findFirst.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/nope' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('PUT /api/jobs/:id', () => {
    it('updates a job', async () => {
      const job = makeJob()
      prismaMock.job.updateMany.mockResolvedValue({ count: 1 } as any)
      prismaMock.job.findUniqueOrThrow.mockResolvedValue(job as any)

      const res = await app.inject({
        method: 'PUT', url: `/api/jobs/${job.id}`,
        payload: { subject: 'new subject' },
      })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when not found', async () => {
      prismaMock.job.updateMany.mockResolvedValue({ count: 0 } as any)

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/nope',
        payload: { subject: 'new' },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:id', () => {
    it('deletes a job', async () => {
      prismaMock.job.deleteMany.mockResolvedValue({ count: 1 } as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-123' })

      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when not found', async () => {
      prismaMock.job.deleteMany.mockResolvedValue({ count: 0 } as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/nope' })

      expect(res.statusCode).toBe(404)
    })
  })
})
