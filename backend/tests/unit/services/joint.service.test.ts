import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJoint, makeJointBoltRoofItem, makeJointBoltMezzanineItem, makeFoundationBoltRoofItem } from '../../helpers/factories.js'
import { upsertJoint, getJoints, getJointByJobId, updateJoint, deleteJoint } from '../../../services/joint.service.js'

const include = { jointBoltRoof: true, jointBoltMezzanine: true, foundationBoltRoof: true }

describe('joint.service', () => {
  describe('upsertJoint', () => {
    it('upserts a joint with all child arrays for the given job', async () => {
      const jointBoltRoof = [makeJointBoltRoofItem()]
      const jointBoltMezzanine = [makeJointBoltMezzanineItem()]
      const foundationBoltRoof = [makeFoundationBoltRoofItem()]
      const joint = makeJoint({ jobId: 'job-1', jointBoltRoof, jointBoltMezzanine, foundationBoltRoof })
      prismaMock.joint.upsert.mockResolvedValue(joint as any)

      const result = await upsertJoint('job-1', { jointBoltRoof, jointBoltMezzanine, foundationBoltRoof })

      expect(result).toEqual(joint)
      expect(prismaMock.joint.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        create: {
          jobId: 'job-1',
          jointBoltRoof: { createMany: { data: jointBoltRoof } },
          jointBoltMezzanine: { createMany: { data: jointBoltMezzanine } },
          foundationBoltRoof: { createMany: { data: foundationBoltRoof } },
        },
        update: {
          jointBoltRoof: { deleteMany: {}, createMany: { data: jointBoltRoof } },
          jointBoltMezzanine: { deleteMany: {}, createMany: { data: jointBoltMezzanine } },
          foundationBoltRoof: { deleteMany: {}, createMany: { data: foundationBoltRoof } },
        },
        include,
      })
    })

    it('handles upsert with no child arrays', async () => {
      const joint = makeJoint({ jobId: 'job-2' })
      prismaMock.joint.upsert.mockResolvedValue(joint as any)

      const result = await upsertJoint('job-2', {})

      expect(result).toEqual(joint)
      expect(prismaMock.joint.upsert).toHaveBeenCalledWith({
        where: { jobId: 'job-2' },
        create: {
          jobId: 'job-2',
          jointBoltRoof: { createMany: { data: [] } },
          jointBoltMezzanine: { createMany: { data: [] } },
          foundationBoltRoof: { createMany: { data: [] } },
        },
        update: {
          jointBoltRoof: { deleteMany: {}, createMany: { data: [] } },
          jointBoltMezzanine: { deleteMany: {}, createMany: { data: [] } },
          foundationBoltRoof: { deleteMany: {}, createMany: { data: [] } },
        },
        include,
      })
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
    it('updates joint and replaces child arrays when provided', async () => {
      const joint = makeJoint()
      const jointBoltRoof = [makeJointBoltRoofItem({ roofJointId: 'F', numberOfBolts: 4 })]
      prismaMock.joint.update.mockResolvedValue(joint as any)

      const result = await updateJoint('job-1', { jointBoltRoof })

      expect(result).toEqual(joint)
      expect(prismaMock.joint.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: { jointBoltRoof: { deleteMany: {}, createMany: { data: jointBoltRoof } } },
        include,
      })
    })

    it('replaces jointBoltMezzanine when provided', async () => {
      const joint = makeJoint()
      const jointBoltMezzanine = [makeJointBoltMezzanineItem({ mezzanineJointId: 'SEC' })]
      prismaMock.joint.update.mockResolvedValue(joint as any)

      const result = await updateJoint('job-1', { jointBoltMezzanine })

      expect(result).toEqual(joint)
      expect(prismaMock.joint.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: { jointBoltMezzanine: { deleteMany: {}, createMany: { data: jointBoltMezzanine } } },
        include,
      })
    })

    it('replaces foundationBoltRoof when provided', async () => {
      const joint = makeJoint()
      const foundationBoltRoof = [makeFoundationBoltRoofItem({ foundationJointId: 'FB6' })]
      prismaMock.joint.update.mockResolvedValue(joint as any)

      const result = await updateJoint('job-1', { foundationBoltRoof })

      expect(result).toEqual(joint)
      expect(prismaMock.joint.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: { foundationBoltRoof: { deleteMany: {}, createMany: { data: foundationBoltRoof } } },
        include,
      })
    })

    it('updates joint without touching child arrays when not provided', async () => {
      const joint = makeJoint()
      prismaMock.joint.update.mockResolvedValue(joint as any)

      const result = await updateJoint('job-1', {})

      expect(result).toEqual(joint)
      expect(prismaMock.joint.update).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        data: {},
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
