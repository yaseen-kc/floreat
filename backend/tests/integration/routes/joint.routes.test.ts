import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeJoint, makeJointBoltRoofItem } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

beforeEach(() => { prismaMock.job.findFirst.mockResolvedValue(makeJob() as any) })

describe('Joint routes integration', () => {
  describe('authentication', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetAuth.mockReturnValueOnce({ userId: null })
      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/joint' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/jobs/:jobId/joint', () => {
    it('upserts a joint with child arrays', async () => {
      const jointBoltRoof = [makeJointBoltRoofItem()]
      const joint = makeJoint({ jobId: 'job-1', jointBoltRoof })
      prismaMock.joint.upsert.mockResolvedValue(joint as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/joint',
        payload: { jointBoltRoof },
      })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(joint.id)
      expect(res.json().jointBoltRoof).toEqual(jointBoltRoof)
    })

    it('persists joint bolt items through to the create payload', async () => {
      const jointBoltRoof = [makeJointBoltRoofItem({ roofJointId: 'F', numberOfBolts: 4 })]
      const joint = makeJoint({ jobId: 'job-1', jointBoltRoof })
      prismaMock.joint.upsert.mockResolvedValue(joint as any)

      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/joint',
        payload: { jointBoltRoof },
      })

      expect(res.statusCode).toBe(200)
      expect(prismaMock.joint.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            jointBoltRoof: { createMany: { data: jointBoltRoof } },
          }),
        }),
      )
    })

    it('rejects an invalid roofJointId', async () => {
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/joint',
        payload: { jointBoltRoof: [{ roofJointId: 'ZZ' }] },
      })
      expect(res.statusCode).toBe(400)
    })

    it('rejects an invalid boltType', async () => {
      const res = await app.inject({
        method: 'POST', url: '/api/jobs/job-1/joint',
        payload: { canopyBoltType: 'WRONG' },
      })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/jobs/:jobId/joint', () => {
    it('returns joint when found', async () => {
      const joint = makeJoint({ jobId: 'job-1' })
      prismaMock.joint.findUnique.mockResolvedValue(joint as any)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/joint' })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(joint.id)
    })

    it('returns 404 when no joint exists for job', async () => {
      prismaMock.joint.findUnique.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/jobs/nope/joint' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('GET /api/joints', () => {
    it('returns paginated joints list', async () => {
      const joints = [makeJoint(), makeJoint()]
      prismaMock.joint.findMany.mockResolvedValue(joints as any)
      prismaMock.joint.count.mockResolvedValue(2)

      const res = await app.inject({ method: 'GET', url: '/api/joints?page=1&pageSize=10' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(2)
      expect(res.json().total).toBe(2)
    })
  })

  describe('PUT /api/jobs/:jobId/joint', () => {
    it('updates a joint', async () => {
      const joint = makeJoint({ jobId: 'job-1' })
      prismaMock.joint.update.mockResolvedValue(joint as any)

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/job-1/joint',
        payload: { jointBoltRoof: [makeJointBoltRoofItem({ roofJointId: 'B' })] },
      })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when not found', async () => {
      prismaMock.joint.update.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({
        method: 'PUT', url: '/api/jobs/nope/joint',
        payload: { jointBoltRoof: [makeJointBoltRoofItem()] },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/jobs/:jobId/joint', () => {
    it('deletes a joint', async () => {
      prismaMock.joint.delete.mockResolvedValue({} as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/joint' })

      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when not found', async () => {
      prismaMock.joint.delete.mockRejectedValue(Object.assign(new Error('Not found'), { code: 'P2025' }))

      const res = await app.inject({ method: 'DELETE', url: '/api/jobs/nope/joint' })

      expect(res.statusCode).toBe(404)
    })
  })
})
