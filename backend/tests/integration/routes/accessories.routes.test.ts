import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeAccessories, makeAccessoryDoor, makeAccessoryWindow, makeAccessoryFoldedPlate, makeAccessoryOpening } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

beforeEach(() => { prismaMock.job.findFirst.mockResolvedValue(makeJob() as any) })

describe('Accessories routes integration', () => {
  describe('authentication', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetAuth.mockReturnValueOnce({ userId: null })
      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/accessories' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/jobs/:jobId/accessories', () => {
    it('upserts accessories with line-item arrays', async () => {
      const doors = [makeAccessoryDoor()]
      const windows = [makeAccessoryWindow()]
      const foldedPlates = [makeAccessoryFoldedPlate()]
      const openings = [makeAccessoryOpening()]
      const accessories = makeAccessories({ jobId: 'job-1', doors, windows, foldedPlates, openings })
      prismaMock.accessories.upsert.mockResolvedValue(accessories as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/accessories',
        payload: { gutterType: 'PPGL', gutterSize: 'IN_6', doors, windows, foldedPlates, openings },
      })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(accessories.id)
      expect(res.json().doors).toEqual(doors)
      expect(res.json().openings).toEqual(openings)
    })

    it('passes line items through to the create payload', async () => {
      const doors = [makeAccessoryDoor({ nos: 3, quantity: 3 })]
      const openings = [makeAccessoryOpening({ kind: 'LOUVER' })]
      const accessories = makeAccessories({ jobId: 'job-1', doors, openings })
      prismaMock.accessories.upsert.mockResolvedValue(accessories as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/accessories',
        payload: { doors, openings },
      })

      expect(res.statusCode).toBe(200)
      expect(prismaMock.accessories.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            doors: { createMany: { data: doors } },
            openings: { createMany: { data: openings } },
          }),
        }),
      )
    })

    it('rejects an opening missing its required kind', async () => {
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/accessories',
        payload: { openings: [{ length: 3, width: 3 }] },
      })
      expect(res.statusCode).toBe(400)
    })

    it('rejects a door with a negative count', async () => {
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/accessories',
        payload: { doors: [makeAccessoryDoor({ nos: -1 })] },
      })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs/:jobId/accessories', () => {
    it('returns accessories for the job', async () => {
      const accessories = makeAccessories({ jobId: 'job-1' })
      prismaMock.accessories.findUnique.mockResolvedValue(accessories as any)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/accessories' })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(accessories.id)
    })

    it('returns 404 when no accessories exist for job', async () => {
      prismaMock.accessories.findUnique.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/nope/accessories' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('GET /api/accessories', () => {
    it('returns paginated accessories list', async () => {
      const accessories = [makeAccessories(), makeAccessories()]
      prismaMock.accessories.findMany.mockResolvedValue(accessories as any)
      prismaMock.accessories.count.mockResolvedValue(2)

      const res = await app.inject({ method: 'GET', url: '/api/accessories?page=1&pageSize=10' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(2)
      expect(res.json().total).toBe(2)
    })
  })

  describe('PUT /api/jobs/:jobId/accessories', () => {
    it('updates accessories', async () => {
      const accessories = makeAccessories({ jobId: 'job-1' })
      prismaMock.accessories.update.mockResolvedValue(accessories as any)

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/job-1/accessories',
        payload: { gutterQuantity: 4, openings: [makeAccessoryOpening({ kind: 'SKY_LIGHT' })] },
      })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when not found', async () => {
      prismaMock.accessories.update.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/nope/accessories',
        payload: { gutterQuantity: 4 },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:jobId/accessories', () => {
    it('deletes accessories', async () => {
      prismaMock.accessories.delete.mockResolvedValue({} as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/accessories' })

      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when not found', async () => {
      prismaMock.accessories.delete.mockRejectedValue(Object.assign(new Error('Not found'), { code: 'P2025' }))

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/nope/accessories' })

      expect(res.statusCode).toBe(404)
    })
  })
})
