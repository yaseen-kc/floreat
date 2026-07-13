/**
 * Joint service — encapsulates database operations for the Joint model.
 * Handles the three inline child arrays (jointBoltRoof, jointBoltMezzanine,
 * foundationBoltRoof) with a replace-all strategy on upsert/update.
 *
 * The roof & mezzanine bolt arrays are interdependent (see @floreat/shared/calc
 * `deriveJointBolts`): every diameter follows Roof Joint A, roof E mirrors D,
 * F/J are fixed at 4/8, and mezzanine N/R mirror M/Q. These derivations are
 * applied server-side on every write so a client-sent value is never trusted.
 */
import { prisma } from '../lib/prisma.js'
import { deriveJointBolts, type RoofBoltRow, type MezzanineBoltRow } from '@floreat/shared/calc'
import type { CreateJointInput } from '../schemas/joint.schema.js'

const include = { jointBoltRoof: true, jointBoltMezzanine: true, foundationBoltRoof: true }

/** Null-safe numeric coercion (Prisma Decimal / null → number | undefined). */
const toNum = (v: unknown): number | undefined => (v == null ? undefined : Number(v))

/** Creates or updates a joint for a given job. Child arrays are replaced entirely on update. */
export function upsertJoint(jobId: string, data: CreateJointInput) {
  const { jointBoltRoof, jointBoltMezzanine, foundationBoltRoof, ...rest } = data

  // Enforce the interdependent bolt rules from the provided arrays — the client
  // value is never trusted (mirrors roof.service recomputing derived quantities).
  const derived = deriveJointBolts(jointBoltRoof ?? [], jointBoltMezzanine ?? [])
  const jointBoltRoofData = derived.jointBoltRoof as NonNullable<CreateJointInput['jointBoltRoof']>
  const jointBoltMezzanineData = derived.jointBoltMezzanine as NonNullable<CreateJointInput['jointBoltMezzanine']>
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

/**
 * Updates a joint by job ID. Replaces each child array entirely if provided.
 *
 * Because the roof & mezzanine diameters/counts are interdependent, when EITHER
 * of those arrays is part of the patch we re-derive BOTH from the patch merged
 * over the currently-stored rows, and write both — so a partial update can't
 * leave the two arrays inconsistent (e.g. changing Joint A's diameter updates
 * every dependent row). Foundation bolts are independent.
 */
export async function updateJoint(jobId: string, data: Record<string, any>) {
  const { jointBoltRoof, jointBoltMezzanine, foundationBoltRoof, ...rest } = data
  const updateData: any = { ...rest }

  if (jointBoltRoof !== undefined || jointBoltMezzanine !== undefined) {
    const current = await prisma.joint.findUnique({
      where: { jobId },
      select: {
        jointBoltRoof: { select: { roofJointId: true, boltDiameter: true, numberOfBolts: true } },
        jointBoltMezzanine: { select: { mezzanineJointId: true, boltDiameter: true, numberOfBolts: true } },
      },
    })
    const currentRoof: RoofBoltRow[] = (current?.jointBoltRoof ?? []).map((r) => ({
      roofJointId: r.roofJointId,
      boltDiameter: toNum(r.boltDiameter),
      numberOfBolts: toNum(r.numberOfBolts),
    }))
    const currentMezz: MezzanineBoltRow[] = (current?.jointBoltMezzanine ?? []).map((r) => ({
      mezzanineJointId: r.mezzanineJointId,
      boltDiameter: toNum(r.boltDiameter),
      numberOfBolts: toNum(r.numberOfBolts),
    }))
    const derived = deriveJointBolts(jointBoltRoof ?? currentRoof, jointBoltMezzanine ?? currentMezz)
    updateData.jointBoltRoof = { deleteMany: {}, createMany: { data: derived.jointBoltRoof } }
    updateData.jointBoltMezzanine = { deleteMany: {}, createMany: { data: derived.jointBoltMezzanine } }
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
