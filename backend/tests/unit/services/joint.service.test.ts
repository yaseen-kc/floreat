import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJoint, makeJointBoltRoofItem, makeJointBoltMezzanineItem, makeFoundationBoltRoofItem } from '../../helpers/factories.js'
import { upsertJoint, getJoints, getJointByJobId, updateJoint, deleteJoint } from '../../../services/joint.service.js'
import { deriveJointBolts } from '@floreat/shared/calc'

const include = { jointBoltRoof: true, jointBoltMezzanine: true, foundationBoltRoof: true }

/** Grab the child-array `createMany.data` from a mocked upsert/update call arg. */
const roofData = (arg: any, key: 'create' | 'update') => arg[key].jointBoltRoof.createMany.data
const mezzData = (arg: any, key: 'create' | 'update') => arg[key].jointBoltMezzanine.createMany.data
const findRoof = (rows: any[], id: string) => rows.find((r) => r.roofJointId === id)
const findMezz = (rows: any[], id: string) => rows.find((r) => r.mezzanineJointId === id)

describe('joint.service', () => {
  describe('upsertJoint', () => {
    it('applies the bolt derivation rules before persisting', async () => {
      const jointBoltRoof = [
        { roofJointId: 'A' as const, boltDiameter: 20, numberOfBolts: 10 },
        { roofJointId: 'D' as const, numberOfBolts: 7 },
        { roofJointId: 'B' as const, boltDiameter: 99 }, // stale diameter
      ]
      const jointBoltMezzanine = [
        { mezzanineJointId: 'M' as const, numberOfBolts: 3 },
        { mezzanineJointId: 'Q' as const, numberOfBolts: 5 },
      ]
      const foundationBoltRoof = [makeFoundationBoltRoofItem()]
      const joint = makeJoint({ jobId: 'job-1' })
      prismaMock.joint.upsert.mockResolvedValue(joint as any)

      const result = await upsertJoint('job-1', { jointBoltRoof, jointBoltMezzanine, foundationBoltRoof })

      expect(result).toEqual(joint)
      const arg = prismaMock.joint.upsert.mock.calls[0][0] as any
      const roof = roofData(arg, 'create')
      const mezz = mezzData(arg, 'create')

      // Rule 1: every roof + mezz diameter follows Joint A (20).
      expect(roof.every((r: any) => r.boltDiameter === 20)).toBe(true)
      expect(mezz.every((r: any) => r.boltDiameter === 20)).toBe(true)
      // Rule 2: E mirrors D (7). Rule 3: F=4, J=8.
      expect(findRoof(roof, 'E')?.numberOfBolts).toBe(7)
      expect(findRoof(roof, 'F')?.numberOfBolts).toBe(4)
      expect(findRoof(roof, 'J')?.numberOfBolts).toBe(8)
      // Rule 4/5: N mirrors M (3), R mirrors Q (5).
      expect(findMezz(mezz, 'N')?.numberOfBolts).toBe(3)
      expect(findMezz(mezz, 'R')?.numberOfBolts).toBe(5)
      // Full derived arrays match the shared calc; foundation is passed through.
      const expected = deriveJointBolts(jointBoltRoof, jointBoltMezzanine)
      expect(arg.create).toMatchObject({
        jobId: 'job-1',
        jointBoltRoof: { createMany: { data: expected.jointBoltRoof } },
        jointBoltMezzanine: { createMany: { data: expected.jointBoltMezzanine } },
        foundationBoltRoof: { createMany: { data: foundationBoltRoof } },
      })
      expect(arg.include).toEqual(include)
    })

    it('always seeds fixed F=4 / J=8 rows even with no child arrays', async () => {
      const joint = makeJoint({ jobId: 'job-2' })
      prismaMock.joint.upsert.mockResolvedValue(joint as any)

      await upsertJoint('job-2', {})

      const arg = prismaMock.joint.upsert.mock.calls[0][0] as any
      const roof = roofData(arg, 'create')
      expect(findRoof(roof, 'F')?.numberOfBolts).toBe(4)
      expect(findRoof(roof, 'J')?.numberOfBolts).toBe(8)
      expect(mezzData(arg, 'create')).toEqual([])
      expect(arg.create.foundationBoltRoof).toEqual({ createMany: { data: [] } })
    })
  })

  describe('getJoints', () => {
    it("returns the user's paginated joints", async () => {
      const joints = [makeJoint(), makeJoint()]
      prismaMock.joint.findMany.mockResolvedValue(joints as any)
      prismaMock.joint.count.mockResolvedValue(2)

      const result = await getJoints('user_1', 2, 10)

      expect(result).toEqual({ data: joints, total: 2, page: 2, pageSize: 10 })
      expect(prismaMock.joint.findMany).toHaveBeenCalledWith({
        where: { job: { userId: 'user_1' } }, skip: 10, take: 10, orderBy: { createdAt: 'desc' }, include,
      })
      expect(prismaMock.joint.count).toHaveBeenCalledWith({ where: { job: { userId: 'user_1' } } })
    })
  })

  describe('getJointByJobId', () => {
    it('returns joint when found', async () => {
      const joint = makeJoint()
      prismaMock.joint.findUnique.mockResolvedValue(joint as any)

      const result = await getJointByJobId('job-1')

      expect(result).toEqual(joint)
      expect(prismaMock.joint.findUnique).toHaveBeenCalledWith({ where: { jobId: 'job-1' }, include })
    })

    it('returns null when not found', async () => {
      prismaMock.joint.findUnique.mockResolvedValue(null)

      const result = await getJointByJobId('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('updateJoint', () => {
    it('re-derives BOTH bolt arrays from the patch merged over current rows when roof is provided', async () => {
      const joint = makeJoint()
      // Currently stored mezzanine rows (Decimal-ish diameters as strings).
      prismaMock.joint.findUnique.mockResolvedValue({
        jointBoltRoof: [],
        jointBoltMezzanine: [{ mezzanineJointId: 'M', boltDiameter: '12', numberOfBolts: 9 }],
      } as any)
      prismaMock.joint.update.mockResolvedValue(joint as any)

      const jointBoltRoof = [{ roofJointId: 'A' as const, boltDiameter: 16 }]
      const result = await updateJoint('job-1', { jointBoltRoof })

      expect(result).toEqual(joint)
      const arg = prismaMock.joint.update.mock.calls[0][0] as any
      const roof = arg.data.jointBoltRoof.createMany.data
      const mezz = arg.data.jointBoltMezzanine.createMany.data
      // Roof A drove all diameters to 16 (including the re-derived mezz M).
      expect(findRoof(roof, 'F')?.numberOfBolts).toBe(4)
      expect(findMezz(mezz, 'M')?.boltDiameter).toBe(16)
      // Mezz M kept its stored count (9) and N mirrored it.
      expect(findMezz(mezz, 'M')?.numberOfBolts).toBe(9)
      expect(findMezz(mezz, 'N')?.numberOfBolts).toBe(9)
      expect(arg.include).toEqual(include)
    })

    it('re-derives both arrays when only mezzanine is provided', async () => {
      const joint = makeJoint()
      prismaMock.joint.findUnique.mockResolvedValue({
        jointBoltRoof: [{ roofJointId: 'A', boltDiameter: '24', numberOfBolts: 8 }],
        jointBoltMezzanine: [],
      } as any)
      prismaMock.joint.update.mockResolvedValue(joint as any)

      const jointBoltMezzanine = [{ mezzanineJointId: 'M' as const, numberOfBolts: 6 }]
      await updateJoint('job-1', { jointBoltMezzanine })

      const arg = prismaMock.joint.update.mock.calls[0][0] as any
      const mezz = arg.data.jointBoltMezzanine.createMany.data
      // Mezz diameter followed the stored Joint A (24); N mirrored M's count.
      expect(findMezz(mezz, 'M')?.boltDiameter).toBe(24)
      expect(findMezz(mezz, 'N')?.numberOfBolts).toBe(6)
      // Roof was rewritten from current (A) with fixed F/J ensured.
      expect(arg.data.jointBoltRoof.createMany.data.length).toBeGreaterThan(0)
    })

    it('replaces foundationBoltRoof without deriving bolt arrays', async () => {
      const joint = makeJoint()
      const foundationBoltRoof = [makeFoundationBoltRoofItem({ foundationJointId: 'FB6' })]
      prismaMock.joint.update.mockResolvedValue(joint as any)

      const result = await updateJoint('job-1', { foundationBoltRoof })

      expect(result).toEqual(joint)
      expect(prismaMock.joint.findUnique).not.toHaveBeenCalled()
      expect(prismaMock.joint.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: { foundationBoltRoof: { deleteMany: {}, createMany: { data: foundationBoltRoof } } },
        include,
      })
    })

    it('updates joint without touching child arrays when none provided', async () => {
      const joint = makeJoint()
      prismaMock.joint.update.mockResolvedValue(joint as any)

      const result = await updateJoint('job-1', { secondaryBeamsNumberOfBolts: 6 })

      expect(result).toEqual(joint)
      expect(prismaMock.joint.findUnique).not.toHaveBeenCalled()
      expect(prismaMock.joint.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: { secondaryBeamsNumberOfBolts: 6 },
        include,
      })
    })
  })

  describe('deleteJoint', () => {
    it('deletes the joint by job ID', async () => {
      prismaMock.joint.delete.mockResolvedValue({} as any)

      await deleteJoint('job-1')

      expect(prismaMock.joint.delete).toHaveBeenCalledWith({ where: { jobId: 'job-1' } })
    })
  })
})
