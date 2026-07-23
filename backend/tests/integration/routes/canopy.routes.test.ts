import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeCanopy, makeCanopyItem } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

beforeEach(() => { prismaMock.job.findFirst.mockResolvedValue(makeJob() as any) })

describe('Canopy routes integration', () => {
  describe('authentication', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetAuth.mockReturnValueOnce({ userId: null })
      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/canopy' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/jobs/:jobId/canopy', () => {
    it('upserts a canopy with canopies', async () => {
      const canopies = [makeCanopyItem()]
      const canopy = makeCanopy({ jobId: 'job-1', canopies })
      prismaMock.canopy.upsert.mockResolvedValue(canopy as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/canopy',
        payload: { canopies },
      })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(canopy.id)
      expect(res.json().canopies).toEqual(canopies)
    })

    it('persists canopy items through to the create payload', async () => {
      const canopies = [makeCanopyItem({ numberOfBeams: 4, sheetThick: 0.6 })]
      const canopy = makeCanopy({ jobId: 'job-1', canopies })
      prismaMock.canopy.upsert.mockResolvedValue(canopy as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/canopy',
        payload: { canopies },
      })

      expect(res.statusCode).toBe(200)
      expect(prismaMock.canopy.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            canopies: { createMany: { data: canopies } },
          }),
        }),
      )
    })

    it('rejects an invalid canopy code', async () => {
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/canopy',
        payload: { canopies: [makeCanopyItem({ code: 'CANOPY_0' as any })] },
      })
      expect(res.statusCode).toBe(400)
    })

    it('rejects a negative beam count', async () => {
      const item: any = makeCanopyItem()
      item.numberOfBeams = -1
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/canopy',
        payload: { canopies: [item] },
      })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs/:jobId/canopy', () => {
    it('returns canopy when found', async () => {
      const canopy = makeCanopy({ jobId: 'job-1' })
      prismaMock.canopy.findUnique.mockResolvedValue(canopy as any)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/canopy' })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(canopy.id)
    })

    it('returns 404 when no canopy exists for job', async () => {
      prismaMock.canopy.findUnique.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/nope/canopy' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('GET /api/canopies', () => {
    it('returns paginated canopies list', async () => {
      const canopies = [makeCanopy(), makeCanopy()]
      prismaMock.canopy.findMany.mockResolvedValue(canopies as any)
      prismaMock.canopy.count.mockResolvedValue(2)

      const res = await app.inject({ method: 'GET', url: '/api/canopies?page=1&pageSize=10' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(2)
      expect(res.json().total).toBe(2)
    })
  })

  describe('PUT /api/jobs/:jobId/canopy', () => {
    it('updates a canopy', async () => {
      const canopy = makeCanopy({ jobId: 'job-1' })
      prismaMock.canopy.update.mockResolvedValue(canopy as any)

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/job-1/canopy',
        payload: { canopies: [makeCanopyItem({ code: 'CANOPY_2' })] },
      })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when not found', async () => {
      prismaMock.canopy.update.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/nope/canopy',
        payload: { canopies: [makeCanopyItem()] },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:jobId/canopy', () => {
    it('deletes a canopy', async () => {
      prismaMock.canopy.delete.mockResolvedValue({} as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/canopy' })

      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when not found', async () => {
      prismaMock.canopy.delete.mockRejectedValue(Object.assign(new Error('Not found'), { code: 'P2025' }))

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/nope/canopy' })

      expect(res.statusCode).toBe(404)
    })
  })
})
