/**
 * Canopy service — encapsulates database operations for the Canopy model.
 * Handles the inline canopies array (replace-all strategy on upsert/update).
 */
import { prisma } from '../lib/prisma.js'
import type { CreateCanopyInput } from '../schemas/canopy.schema.js'

/** Creates or updates a canopy for a given job. Canopies are replaced entirely on update. */
export function upsertCanopy(jobId: string, data: CreateCanopyInput) {
  const { canopies, ...rest } = data
  const canopyData = canopies ?? []

  return prisma.canopy.upsert({
    where: { jobId },
    create: {
      jobId,
      ...rest,
      canopies: { createMany: { data: canopyData } },
    },
    update: {
      ...rest,
      canopies: { deleteMany: {}, createMany: { data: canopyData } },
    },
    include: { canopies: true },
  })
}

/** Returns a paginated list of canopies ordered by most recent first. */
export async function getCanopies(page: number, pageSize: number) {
  const [data, total] = await Promise.all([
    prisma.canopy.findMany({ skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include: { canopies: true } }),
    prisma.canopy.count(),
  ])
  return { data, total, page, pageSize }
}

/** Finds a canopy by its associated job ID. Returns null if not found. */
export function getCanopyByJobId(jobId: string) {
  return prisma.canopy.findUnique({ where: { jobId }, include: { canopies: true } })
}

/** Updates a canopy by job ID. Replaces canopies entirely if provided. */
export function updateCanopy(jobId: string, data: Record<string, any>) {
  const { canopies, ...rest } = data
  const updateData: any = { ...rest }

  if (canopies !== undefined) {
    updateData.canopies = { deleteMany: {}, createMany: { data: canopies } }
  }

  return prisma.canopy.update({ where: { jobId }, data: updateData, include: { canopies: true } })
}

/** Deletes a canopy by its associated job ID. Throws if not found. */
export function deleteCanopy(jobId: string) {
  return prisma.canopy.delete({ where: { jobId } })
}
