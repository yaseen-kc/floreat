import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeLoad, makeLoadInput } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

beforeEach(() => { prismaMock.job.findFirst.mockResolvedValue(makeJob() as any) })

describe('Load routes integration', () => {
  describe('authentication', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetAuth.mockReturnValueOnce({ userId: null })
      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/load' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/jobs/:jobId/load', () => {
    it('upserts a load for the job', async () => {
      const { jobId, ...data } = makeLoadInput('job-1')
      const load = makeLoad({ jobId: 'job-1', ...data })
      prismaMock.load.upsert.mockResolvedValue(load as any)

      const res = await app.inject({ method: 'POST', url: '/api/jobs/job-1/load', payload: data })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(load.id)
      expect(res.json().snowLoad).toBe(data.snowLoad)
      expect(res.json().approvalDrawingsUnit).toBe('DAYS')
    })

    it('persists load fields through to the create payload', async () => {
      const load = makeLoad({ jobId: 'job-1' })
      prismaMock.load.upsert.mockResolvedValue(load as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/load',
        payload: { deadLoadOnRoofRafters: 0.15, windLoadHorizontal: 140 },
      })

      expect(res.statusCode).toBe(200)
      expect(prismaMock.load.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ jobId: 'job-1', deadLoadOnRoofRafters: 0.15, windLoadHorizontal: 140 }),
        }),
      )
    })

    it('rejects a negative load value', async () => {
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/load',
        payload: { snowLoad: -1 },
      })
      expect(res.statusCode).toBe(400)
    })

    it('rejects a non-integer completion-period time', async () => {
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/load',
        payload: { supplyOfMaterialsDays: 1.5 },
      })
      expect(res.statusCode).toBe(400)
    })

    it('rejects an invalid approval-drawings unit', async () => {
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/load',
        payload: { approvalDrawingsUnit: 'YEARS' },
      })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs/:jobId/load', () => {
    it('returns load when found', async () => {
      const load = makeLoad({ jobId: 'job-1' })
      prismaMock.load.findUnique.mockResolvedValue(load as any)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/load' })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(load.id)
    })

    it('returns 404 when no load exists for job', async () => {
      prismaMock.load.findUnique.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/nope/load' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('GET /api/loads', () => {
    it('returns paginated loads list', async () => {
      const loads = [makeLoad(), makeLoad()]
      prismaMock.load.findMany.mockResolvedValue(loads as any)
      prismaMock.load.count.mockResolvedValue(2)

      const res = await app.inject({ method: 'GET', url: '/api/loads?page=1&pageSize=10' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(2)
      expect(res.json().total).toBe(2)
    })
  })

  describe('PUT /api/jobs/:jobId/load', () => {
    it('updates a load', async () => {
      const load = makeLoad({ jobId: 'job-1' })
      prismaMock.load.update.mockResolvedValue(load as any)

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/job-1/load',
        payload: { snowLoad: 4 },
      })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when not found', async () => {
      prismaMock.load.update.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/nope/load',
        payload: { snowLoad: 4 },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:jobId/load', () => {
    it('deletes a load', async () => {
      prismaMock.load.delete.mockResolvedValue({} as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/load' })

      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when not found', async () => {
      prismaMock.load.delete.mockRejectedValue(Object.assign(new Error('Not found'), { code: 'P2025' }))

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/nope/load' })

      expect(res.statusCode).toBe(404)
    })
  })
})
