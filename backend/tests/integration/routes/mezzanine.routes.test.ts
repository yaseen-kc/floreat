import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeMezzanine, makeMezzanineFloor, makeMezzanineExtension } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

beforeEach(() => { prismaMock.job.findFirst.mockResolvedValue(makeJob() as any) })

describe('Mezzanine routes integration', () => {
  describe('authentication', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetAuth.mockReturnValueOnce({ userId: null })
      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/mezzanine' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/jobs/:jobId/mezzanine', () => {
    it('upserts a mezzanine with floors and extensions', async () => {
      const floors = [makeMezzanineFloor()]
      const extensions = [makeMezzanineExtension()]
      const mezzanine = makeMezzanine({ jobId: 'job-1', floors, extensions })
      prismaMock.mezzanine.upsert.mockResolvedValue(mezzanine as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/mezzanine',
        payload: { floors, extensions },
      })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(mezzanine.id)
      expect(res.json().floors).toEqual(floors)
      expect(res.json().extensions).toEqual(extensions)
    })

    it('persists floor counts through to the create payload', async () => {
      const floors = [makeMezzanineFloor({ beamsSecondary: 12, internalColumnsMidPrimary: 2 })]
      const mezzanine = makeMezzanine({ jobId: 'job-1', floors })
      prismaMock.mezzanine.upsert.mockResolvedValue(mezzanine as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/mezzanine',
        payload: { floors },
      })

      expect(res.statusCode).toBe(200)
      expect(prismaMock.mezzanine.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            floors: { createMany: { data: floors } },
          }),
        }),
      )
    })

    it('rejects an invalid floor code', async () => {
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/mezzanine',
        payload: { floors: [makeMezzanineFloor({ code: 'MEZ-0' as any })] },
      })
      expect(res.statusCode).toBe(400)
    })

    it('rejects a floor with a negative count', async () => {
      const floor: any = makeMezzanineFloor()
      floor.beamsSecondary = -1
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/mezzanine',
        payload: { floors: [floor] },
      })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs/:jobId/mezzanine', () => {
    it('returns mezzanine with floors and extensions', async () => {
      const mezzanine = makeMezzanine({ jobId: 'job-1' })
      prismaMock.mezzanine.findUnique.mockResolvedValue(mezzanine as any)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/mezzanine' })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(mezzanine.id)
    })

    it('returns 404 when no mezzanine exists for job', async () => {
      prismaMock.mezzanine.findUnique.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/nope/mezzanine' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('GET /api/mezzanines', () => {
    it('returns paginated mezzanines list', async () => {
      const mezzanines = [makeMezzanine(), makeMezzanine()]
      prismaMock.mezzanine.findMany.mockResolvedValue(mezzanines as any)
      prismaMock.mezzanine.count.mockResolvedValue(2)

      const res = await app.inject({ method: 'GET', url: '/api/mezzanines?page=1&pageSize=10' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(2)
      expect(res.json().total).toBe(2)
    })
  })

  describe('PUT /api/jobs/:jobId/mezzanine', () => {
    it('updates a mezzanine', async () => {
      const mezzanine = makeMezzanine({ jobId: 'job-1' })
      prismaMock.mezzanine.update.mockResolvedValue(mezzanine as any)

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/job-1/mezzanine',
        payload: { floors: [makeMezzanineFloor({ code: 'MEZ-2', floor: 'FLOOR_2' })] },
      })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when not found', async () => {
      prismaMock.mezzanine.update.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/nope/mezzanine',
        payload: { floors: [makeMezzanineFloor()] },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:jobId/mezzanine', () => {
    it('deletes a mezzanine', async () => {
      prismaMock.mezzanine.delete.mockResolvedValue({} as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/mezzanine' })

      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when not found', async () => {
      prismaMock.mezzanine.delete.mockRejectedValue(Object.assign(new Error('Not found'), { code: 'P2025' }))

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/nope/mezzanine' })

      expect(res.statusCode).toBe(404)
    })
  })
})
