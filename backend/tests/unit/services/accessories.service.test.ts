import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeAccessories, makeRoof } from '../../helpers/factories.js'
import {
  upsertAccessories,
  updateAccessories,
  getAccessories,
  getAccessoriesByJobId,
  deleteAccessories,
  recomputeAccessoriesQuantities,
} from '../../../services/accessories.service.js'

/** Roof with both FRONT and LEFT sidewalls (so corner flash is computable). */
function roofWithSidewalls(jobId = 'job-1') {
  return makeRoof({
    jobId,
    sidewalls: [
      { side: 'FRONT', wallType: 'BRICK', thickness: 0.23, height: 3.5 },
      { side: 'LEFT', wallType: 'BRICK', thickness: 0.23, height: 3.5 },
    ],
  })
}

// Derived from the sample roof (L=30, W=15, H=5.645, S=6°, MF=4, EF=2, front=left=3.5,
// no cladding extension → corner-flash uses the cladding-ext-0 branch).
const EXPECTED = {
  gutterQuantity: 60,
  downTakeQuantity: 33.87,
  dripTrimQuantity: 90,
  gableEndFlashingQuantity: 30.725,
  cornerFlashQuantity: 8.58,
  ridgeQuantity: 30,
}

describe('accessories.service', () => {
  describe('upsertAccessories', () => {
    it('overwrites client-sent quantities with values derived from the roof', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(roofWithSidewalls() as any)
      prismaMock.accessories.upsert.mockResolvedValue(makeAccessories({ jobId: 'job-1' }) as any)

      // Client sends bogus quantities — they must be ignored.
      await upsertAccessories('job-1', { gutterType: 'PPGL', gutterQuantity: 999, cornerFlashQuantity: 111 })

      expect(prismaMock.accessories.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { jobId: 'job-1' },
          create: expect.objectContaining({ jobId: 'job-1', gutterType: 'PPGL', ...EXPECTED }),
          update: expect.objectContaining({ gutterType: 'PPGL', ...EXPECTED }),
        }),
      )
    })

    it('persists all quantities as null when the job has no roof', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(null)
      prismaMock.accessories.upsert.mockResolvedValue(makeAccessories({ jobId: 'job-2' }) as any)

      await upsertAccessories('job-2', { gutterQuantity: 5 })

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

    it('leaves cornerFlashQuantity null when a sidewall is missing', async () => {
      const roof = makeRoof({
        jobId: 'job-3',
        sidewalls: [{ side: 'FRONT', wallType: 'BRICK', thickness: 0.23, height: 3.5 }],
      })
      prismaMock.roof.findUnique.mockResolvedValue(roof as any)
      prismaMock.accessories.upsert.mockResolvedValue(makeAccessories({ jobId: 'job-3' }) as any)

      await upsertAccessories('job-3', {})

      expect(prismaMock.accessories.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ cornerFlashQuantity: null, gutterQuantity: 60 }),
        }),
      )
    })

    it('keeps a manual-flagged quantity from the client and derives the rest', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(roofWithSidewalls() as any)
      prismaMock.accessories.upsert.mockResolvedValue(makeAccessories({ jobId: 'job-1' }) as any)

      // Gutter is manually overridden; corner flash is not (999 must be ignored).
      await upsertAccessories('job-1', {
        gutterQuantityManual: true,
        gutterQuantity: 123,
        cornerFlashQuantity: 999,
      })

      expect(prismaMock.accessories.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            gutterQuantityManual: true,
            gutterQuantity: 123, // client value kept
            cornerFlashQuantity: 8.58, // derived, client 999 ignored
            downTakeQuantity: 33.87,
            ridgeQuantity: 30,
          }),
        }),
      )
    })

    it('nulls a manual-flagged quantity when the client omits its value', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(roofWithSidewalls() as any)
      prismaMock.accessories.upsert.mockResolvedValue(makeAccessories({ jobId: 'job-1' }) as any)

      await upsertAccessories('job-1', { gutterQuantityManual: true })

      expect(prismaMock.accessories.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ gutterQuantityManual: true, gutterQuantity: null }),
        }),
      )
    })
  })

  describe('updateAccessories', () => {
    it('recomputes quantities from the roof and ignores the client value', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(roofWithSidewalls() as any)
      prismaMock.accessories.update.mockResolvedValue(makeAccessories({ jobId: 'job-1' }) as any)

      await updateAccessories('job-1', { gutterQuantity: 999 })

      expect(prismaMock.accessories.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: expect.objectContaining(EXPECTED),
        include: { doors: true, windows: true, foldedPlates: true, openings: true },
      })
    })

    it('keeps a manual-flagged quantity on update and derives the rest', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(roofWithSidewalls() as any)
      prismaMock.accessories.update.mockResolvedValue(makeAccessories({ jobId: 'job-1' }) as any)

      await updateAccessories('job-1', { ridgeQuantityManual: true, ridgeQuantity: 77 })

      expect(prismaMock.accessories.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: expect.objectContaining({
          ridgeQuantityManual: true,
          ridgeQuantity: 77, // client value kept
          gutterQuantity: 60, // derived
          cornerFlashQuantity: 8.58,
        }),
        include: { doors: true, windows: true, foldedPlates: true, openings: true },
      })
    })

    it('replaces line-item arrays when provided, deriving each item quantity', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(null)
      prismaMock.accessories.update.mockResolvedValue(makeAccessories({ jobId: 'job-1' }) as any)

      const doors = [{ height: 2.1, width: 1.2, nos: 2, quantity: 999 }]
      await updateAccessories('job-1', { doors })

      expect(prismaMock.accessories.update).toHaveBeenCalledWith(
        expect.objectContaining({
          // client quantity 999 replaced by derived 2.1 × 1.2 × 2 = 5.04
          data: expect.objectContaining({
            doors: { deleteMany: {}, createMany: { data: [{ height: 2.1, width: 1.2, nos: 2, quantity: 5.04 }] } },
          }),
        }),
      )
    })
  })

  describe('line-item quantities', () => {
    it('derives each item quantity on upsert and ignores the client value', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(null)
      prismaMock.accessories.upsert.mockResolvedValue(makeAccessories({ jobId: 'job-1' }) as any)

      await upsertAccessories('job-1', {
        doors: [{ height: 2.1, width: 1.2, nos: 2, quantity: 999 }], // → 5.04
        windows: [{ height: 1.2, width: 1.5, nos: 4, quantity: 999 }], // → 7.2
        foldedPlates: [{ length: 6, width: 1.2, nos: 3, quantity: 999 }], // → 21.6
        openings: [{ kind: 'ROLLING_SHUTTER', length: 3, width: 3, nos: 1, quantity: 999 }], // → 9
      })

      expect(prismaMock.accessories.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            doors: { createMany: { data: [{ height: 2.1, width: 1.2, nos: 2, quantity: 5.04 }] } },
            windows: { createMany: { data: [{ height: 1.2, width: 1.5, nos: 4, quantity: 7.2 }] } },
            foldedPlates: { createMany: { data: [{ length: 6, width: 1.2, nos: 3, quantity: 21.6 }] } },
            openings: { createMany: { data: [{ kind: 'ROLLING_SHUTTER', length: 3, width: 3, nos: 1, quantity: 9 }] } },
          }),
        }),
      )
    })

    it('persists a null item quantity when a dimension is missing', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(null)
      prismaMock.accessories.upsert.mockResolvedValue(makeAccessories({ jobId: 'job-1' }) as any)

      await upsertAccessories('job-1', { doors: [{ width: 1.2, nos: 2 }] })

      expect(prismaMock.accessories.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            doors: { createMany: { data: [{ width: 1.2, nos: 2, quantity: null }] } },
          }),
        }),
      )
    })
  })

  describe('recomputeAccessoriesQuantities', () => {
    it('no-ops when the job has no accessories row', async () => {
      prismaMock.accessories.findUnique.mockResolvedValue(null)

      await recomputeAccessoriesQuantities('job-1')

      expect(prismaMock.accessories.update).not.toHaveBeenCalled()
    })

    it('updates the derived quantities when an accessories row exists', async () => {
      prismaMock.accessories.findUnique.mockResolvedValue({ id: 'acc-1' } as any)
      prismaMock.roof.findUnique.mockResolvedValue(roofWithSidewalls() as any)
      prismaMock.accessories.update.mockResolvedValue(makeAccessories({ jobId: 'job-1' }) as any)

      await recomputeAccessoriesQuantities('job-1')

      expect(prismaMock.accessories.update).toHaveBeenCalledWith({ where: { jobId: 'job-1' }, data: EXPECTED })
    })

    it('leaves a manual-flagged quantity untouched and rewrites only the auto ones', async () => {
      prismaMock.accessories.findUnique.mockResolvedValue({ id: 'acc-1', gutterQuantityManual: true } as any)
      prismaMock.roof.findUnique.mockResolvedValue(roofWithSidewalls() as any)
      prismaMock.accessories.update.mockResolvedValue(makeAccessories({ jobId: 'job-1' }) as any)

      await recomputeAccessoriesQuantities('job-1')

      // gutterQuantity is manual → excluded from the recompute update entirely.
      expect(prismaMock.accessories.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: {
          downTakeQuantity: 33.87,
          dripTrimQuantity: 90,
          gableEndFlashingQuantity: 30.725,
          cornerFlashQuantity: 8.58,
          ridgeQuantity: 30,
        },
      })
    })

    it('skips the update when every quantity is manually overridden', async () => {
      prismaMock.accessories.findUnique.mockResolvedValue({
        id: 'acc-1',
        gutterQuantityManual: true,
        downTakeQuantityManual: true,
        dripTrimQuantityManual: true,
        gableEndFlashingQuantityManual: true,
        cornerFlashQuantityManual: true,
        ridgeQuantityManual: true,
      } as any)
      prismaMock.roof.findUnique.mockResolvedValue(roofWithSidewalls() as any)

      await recomputeAccessoriesQuantities('job-1')

      expect(prismaMock.accessories.update).not.toHaveBeenCalled()
    })
  })

  describe('reads and delete', () => {
    it('getAccessoriesByJobId includes line-item arrays', async () => {
      const accessories = makeAccessories({ jobId: 'job-1' })
      prismaMock.accessories.findUnique.mockResolvedValue(accessories as any)

      const result = await getAccessoriesByJobId('job-1')

      expect(result).toEqual(accessories)
      expect(prismaMock.accessories.findUnique).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        include: { doors: true, windows: true, foldedPlates: true, openings: true },
      })
    })

    it('getAccessories returns a paginated list scoped to the user', async () => {
      const list = [makeAccessories(), makeAccessories()]
      prismaMock.accessories.findMany.mockResolvedValue(list as any)
      prismaMock.accessories.count.mockResolvedValue(2)

      const result = await getAccessories('user_1', 1, 10)

      expect(result).toEqual({ data: list, total: 2, page: 1, pageSize: 10 })
    })

    it('deleteAccessories deletes by job ID', async () => {
      prismaMock.accessories.delete.mockResolvedValue({} as any)

      await deleteAccessories('job-1')

      expect(prismaMock.accessories.delete).toHaveBeenCalledWith({ where: { jobId: 'job-1' } })
    })
  })
})
