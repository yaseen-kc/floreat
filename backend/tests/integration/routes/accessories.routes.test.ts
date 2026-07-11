import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeAccessories, makeRoof, makeAccessoryDoor, makeAccessoryWindow, makeAccessoryFoldedPlate, makeAccessoryOpening } from '../../helpers/factories.js'
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

    it('derives each line-item quantity and passes it through to the create payload', async () => {
      const doors = [makeAccessoryDoor({ height: 2.1, width: 1.2, nos: 3, quantity: 999 })]
      const openings = [makeAccessoryOpening({ kind: 'LOUVER', length: 3.5, width: 3, nos: 1, quantity: 999 })]
      const accessories = makeAccessories({ jobId: 'job-1', doors, openings })
      prismaMock.roof.findUnique.mockResolvedValue(null)
      prismaMock.accessories.upsert.mockResolvedValue(accessories as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/accessories',
        payload: { doors, openings },
      })

      expect(res.statusCode).toBe(200)
      expect(prismaMock.accessories.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            // client quantity 999 replaced by derived values (2.1×1.2×3=7.56, 3.5×3×1=10.5)
            doors: { createMany: { data: [{ height: 2.1, width: 1.2, nos: 3, quantity: 7.56 }] } },
            openings: { createMany: { data: [{ kind: 'LOUVER', length: 3.5, width: 3, nos: 1, quantity: 10.5 }] } },
          }),
        }),
      )
    })

    it('returns the derived item quantity as a Decimal string', async () => {
      // The response mirrors Prisma: the Decimal quantity column serialises as a string.
      const doors = [makeAccessoryDoor({ height: 2.1, width: 1.2, nos: 2, quantity: '5.04' })]
      prismaMock.roof.findUnique.mockResolvedValue(null)
      prismaMock.accessories.upsert.mockResolvedValue(makeAccessories({ jobId: 'job-1', doors }) as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/accessories',
        payload: { doors: [{ height: 2.1, width: 1.2, nos: 2, quantity: 999 }] },
      })

      expect(res.statusCode).toBe(200)
      expect(res.json().doors[0].quantity).toBe('5.04')
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

  describe('derived quantities from roof', () => {
    /** A roof with both FRONT and LEFT sidewalls so all six quantities compute. */
    const roofForJob = () =>
      makeRoof({
        jobId: 'job-1',
        sidewalls: [
          { side: 'FRONT', wallType: 'BRICK', thickness: 0.23, height: 3.5 },
          { side: 'LEFT', wallType: 'BRICK', thickness: 0.23, height: 3.5 },
        ],
      })

    it('derives the six quantities from the roof and ignores client-sent values', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(roofForJob() as any)
      // The response mirrors Prisma: Decimal columns serialise as strings.
      const accessories = makeAccessories({
        jobId: 'job-1',
        gutterQuantity: '60', downTakeQuantity: '33.87', dripTrimQuantity: '90',
        gableEndFlashingQuantity: '30.725', cornerFlashQuantity: '8.58', ridgeQuantity: '30',
      })
      prismaMock.accessories.upsert.mockResolvedValue(accessories as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/accessories',
        payload: { gutterQuantity: 999, cornerFlashQuantity: 111 }, // bogus — must be ignored
      })

      expect(res.statusCode).toBe(200)
      expect(prismaMock.accessories.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            gutterQuantity: 60,
            downTakeQuantity: 33.87,
            dripTrimQuantity: 90,
            gableEndFlashingQuantity: 30.725,
            cornerFlashQuantity: 8.58,
            ridgeQuantity: 30,
          }),
        }),
      )
      // Decimal columns come back as strings over the wire.
      expect(res.json().gutterQuantity).toBe('60')
      expect(res.json().cornerFlashQuantity).toBe('8.58')
    })

    it('persists null quantities when the job has no roof', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(null)
      prismaMock.accessories.upsert.mockResolvedValue(makeAccessories({ jobId: 'job-1' }) as any)

      const res = await app.inject({ method: 'POST', url: '/api/jobs/job-1/accessories', payload: {} })

      expect(res.statusCode).toBe(200)
      expect(prismaMock.accessories.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            gutterQuantity: null,
            downTakeQuantity: null,
            dripTrimQuantity: null,
            gableEndFlashingQuantity: null,
            cornerFlashQuantity: null,
            ridgeQuantity: null,
          }),
        }),
      )
    })

    it('keeps a manually-overridden quantity and derives the rest', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(roofForJob() as any)
      prismaMock.accessories.upsert.mockResolvedValue(
        makeAccessories({ jobId: 'job-1', gutterQuantity: '123', gutterQuantityManual: true }) as any,
      )

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/accessories',
        payload: { gutterQuantityManual: true, gutterQuantity: 123, cornerFlashQuantity: 999 },
      })

      expect(res.statusCode).toBe(200)
      expect(prismaMock.accessories.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            gutterQuantityManual: true,
            gutterQuantity: 123, // client override kept
            cornerFlashQuantity: 8.58, // derived, client 999 ignored
            ridgeQuantity: 30,
          }),
        }),
      )
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
