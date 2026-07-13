/**
 * Joint service — encapsulates database operations for the Joint model.
 * Handles the three inline child arrays (jointBoltRoof, jointBoltMezzanine,
 * foundationBoltRoof) with a replace-all strategy on upsert/update.
 */
import { prisma } from '../lib/prisma.js'
import type { CreateJointInput } from '../schemas/joint.schema.js'

const include = { jointBoltRoof: true, jointBoltMezzanine: true, foundationBoltRoof: true }

/** Creates or updates a joint for a given job. Child arrays are replaced entirely on update. */
export function upsertJoint(jobId: string, data: CreateJointInput) {
  const { jointBoltRoof, jointBoltMezzanine, foundationBoltRoof, ...rest } = data
  const jointBoltRoofData = jointBoltRoof ?? []
  const jointBoltMezzanineData = jointBoltMezzanine ?? []
  const foundationBoltRoofData = foundationBoltRoof ?? []

  return prisma.joint.upsert({
    where: { jobId },
    create: {
      jobId,
      ...rest,
      jointBoltRoof: { createMany: { data: jointBoltRoofData } },
      jointBoltMezzanine: { createMany: { data: jointBoltMezzanineData } },
      foundationBoltRoof: { createMany: { data: foundationBoltRoofData } },
    },
    update: {
      ...rest,
      jointBoltRoof: { deleteMany: {}, createMany: { data: jointBoltRoofData } },
      jointBoltMezzanine: { deleteMany: {}, createMany: { data: jointBoltMezzanineData } },
      foundationBoltRoof: { deleteMany: {}, createMany: { data: foundationBoltRoofData } },
    },
    include,
  })
}

/** Returns a paginated list of the user's joints ordered by most recent first. */
export async function getJoints(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.joint.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include }),
    prisma.joint.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds a joint by its associated job ID. Returns null if not found. */
export function getJointByJobId(jobId: string) {
  return prisma.joint.findUnique({ where: { jobId }, include })
}

/** Updates a joint by job ID. Replaces each child array entirely if provided. */
export function updateJoint(jobId: string, data: Record<string, any>) {
  const { jointBoltRoof, jointBoltMezzanine, foundationBoltRoof, ...rest } = data
  const updateData: any = { ...rest }

  if (jointBoltRoof !== undefined) {
    updateData.jointBoltRoof = { deleteMany: {}, createMany: { data: jointBoltRoof } }
  }
  if (jointBoltMezzanine !== undefined) {
    updateData.jointBoltMezzanine = { deleteMany: {}, createMany: { data: jointBoltMezzanine } }
  }
  if (foundationBoltRoof !== undefined) {
    updateData.foundationBoltRoof = { deleteMany: {}, createMany: { data: foundationBoltRoof } }
  }

  return prisma.joint.update({ where: { jobId }, data: updateData, include })
}

/** Deletes a joint by its associated job ID. Throws P2025 if not found. */
export function deleteJoint(jobId: string) {
  return prisma.joint.delete({ where: { jobId } })
}
