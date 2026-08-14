/**
 * Canopy service — encapsulates database operations for the Canopy model.
 * Handles the inline canopies array (replace-all strategy on upsert/update).
 */
import { prisma } from '../lib/prisma.js'
import type { CreateCanopyInput } from '../schemas/canopy.schema.js'
import { replaceChildren } from './soft-delete.service.js'

/** Creates or updates a canopy for a given job. Canopies are replaced entirely on update. */
export async function upsertCanopy(jobId: string, data: CreateCanopyInput) {
  const { canopies, ...rest } = data
  const canopyData = canopies ?? []

  return prisma.$transaction(async (tx) => {
    const canopy = await tx.canopy.upsert({ where: { jobId }, create: { jobId, ...rest }, update: { ...rest, deletedAt: null, deletedBy: null, deletionBatchId: null } })
    await replaceChildren(tx, 'canopyItem', 'canopyId', canopy.id, canopyData)
    return (await tx.canopy.findUnique({ where: { id: canopy.id }, include: { canopies: { where: { deletedAt: null } } } })) ?? canopy
  })
}

/** Returns a paginated list of the user's canopies ordered by most recent first. */
export async function getCanopies(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.canopy.findMany({ where: { ...where, deletedAt: null }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include: { canopies: { where: { deletedAt: null } } } }),
    prisma.canopy.count({ where: { ...where, deletedAt: null } }),
  ])
  return { data, total, page, pageSize }
}

/** Finds a canopy by its associated job ID. Returns null if not found. */
export function getCanopyByJobId(jobId: string) {
  return prisma.canopy.findFirst({ where: { jobId, deletedAt: null }, include: { canopies: { where: { deletedAt: null } } } })
}

/** Updates a canopy by job ID. Replaces canopies entirely if provided. */
export async function updateCanopy(jobId: string, data: Record<string, any>) {
  const { canopies, ...rest } = data
  const updateData: any = { ...rest }

  return prisma.$transaction(async (tx) => {
    const canopy = await tx.canopy.update({ where: { jobId }, data: updateData })
    if (canopies !== undefined) await replaceChildren(tx, 'canopyItem', 'canopyId', canopy.id, canopies)
    return (await tx.canopy.findUnique({ where: { id: canopy.id }, include: { canopies: { where: { deletedAt: null } } } })) ?? canopy
  })
}

/** Deletes a canopy by its associated job ID. Throws if not found. */
export function deleteCanopy(jobId: string) {
  return prisma.canopy.update({ where: { jobId }, data: { deletedAt: new Date() } })
}
