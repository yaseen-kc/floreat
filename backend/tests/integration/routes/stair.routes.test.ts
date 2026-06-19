import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeStair, makeStairItem, makeAreaDeduction } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

describe('Stair routes integration', () => {
  describe('authentication', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetAuth.mockReturnValueOnce({ userId: null })
      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/stair' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/jobs/:jobId/stair', () => {
    it('upserts a stair with stairs and area deductions', async () => {
      const stairs = [makeStairItem()]
      const areaDeductions = [makeAreaDeduction()]
      const stair = makeStair({ jobId: 'job-1', stairs, areaDeductions })
      prismaMock.stair.upsert.mockResolvedValue(stair as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/stair',
        payload: { stairs, areaDeductions },
      })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(stair.id)
      expect(res.json().stairs).toEqual(stairs)
      expect(res.json().areaDeductions).toEqual(areaDeductions)
    })

    it('persists stair items through to the create payload', async () => {
      const stairs = [makeStairItem({ numberOfMidLanding: 2, unitWeightOfStringer: 18.5 })]
      const stair = makeStair({ jobId: 'job-1', stairs })
      prismaMock.stair.upsert.mockResolvedValue(stair as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/stair',
        payload: { stairs },
      })

      expect(res.statusCode).toBe(200)
      expect(prismaMock.stair.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            stairs: { createMany: { data: stairs } },
          }),
        }),
      )
    })

    it('rejects an invalid stair code', async () => {
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/stair',
        payload: { stairs: [makeStairItem({ code: 'STAIR-0' })] },
      })
      expect(res.statusCode).toBe(400)
    })

    it('rejects an invalid location code', async () => {
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/stair',
        payload: { stairs: [makeStairItem({ location: 'MEZ-0' })] },
      })
      expect(res.statusCode).toBe(400)
    })

    it('rejects a stair with a negative mid-landing count', async () => {
      const stair: any = makeStairItem()
      stair.numberOfMidLanding = -1
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/stair',
        payload: { stairs: [stair] },
      })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs/:jobId/stair', () => {
    it('returns stair with stairs and deductions', async () => {
      const stair = makeStair({ jobId: 'job-1' })
      prismaMock.stair.findUnique.mockResolvedValue(stair as any)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/stair' })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(stair.id)
    })

    it('returns 404 when no stair exists for job', async () => {
      prismaMock.stair.findUnique.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/nope/stair' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('GET /api/stairs', () => {
    it('returns paginated stairs list', async () => {
      const stairs = [makeStair(), makeStair()]
      prismaMock.stair.findMany.mockResolvedValue(stairs as any)
      prismaMock.stair.count.mockResolvedValue(2)

      const res = await app.inject({ method: 'GET', url: '/api/stairs?page=1&pageSize=10' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(2)
      expect(res.json().total).toBe(2)
    })
  })

  describe('PUT /api/jobs/:jobId/stair', () => {
    it('updates a stair', async () => {
      const stair = makeStair({ jobId: 'job-1' })
      prismaMock.stair.update.mockResolvedValue(stair as any)

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/job-1/stair',
        payload: { stairs: [makeStairItem({ code: 'STAIR-2', startingFrom: 'FIRST_FLOOR' })] },
      })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when not found', async () => {
      prismaMock.stair.update.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/nope/stair',
        payload: { stairs: [makeStairItem()] },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:jobId/stair', () => {
    it('deletes a stair', async () => {
      prismaMock.stair.delete.mockResolvedValue({} as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/stair' })

      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when not found', async () => {
      prismaMock.stair.delete.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/nope/stair' })

      expect(res.statusCode).toBe(404)
    })
  })
})
