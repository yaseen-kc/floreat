/**
 * Roof service — encapsulates database operations for the Roof model.
 * Handles inline sidewall management (replace-all strategy on upsert/update).
 */
import { prisma } from '../lib/prisma.js'
import type { CreateRoofInput, UpdateRoofInput } from '../schemas/roof.schema.js'

/** Creates or updates a roof for a given job. Sidewalls are replaced entirely on update. */
export function upsertRoof(jobId: string, data: CreateRoofInput) {
  const { sidewalls, ...rest } = data
  const sidewallData = sidewalls ?? []

  // `sideColumnsMidFrameCount` is derived server-side: it must always equal
  // `claddingExtensionMidFrameCount`. Overwrite whenever the cladding value is
  // present so a buggy/malicious client can't persist a mismatch.
  if (rest.claddingExtensionMidFrameCount !== undefined) {
    rest.sideColumnsMidFrameCount = rest.claddingExtensionMidFrameCount
  }

  return prisma.roof.upsert({
    where: { jobId },
    create: { jobId, ...rest, sidewalls: { createMany: { data: sidewallData } } },
    update: { ...rest, sidewalls: { deleteMany: {}, createMany: { data: sidewallData } } },
    include: { sidewalls: true },
  })
}

/** Returns a paginated list of roofs ordered by most recent first. */
export async function getRoofs(page: number, pageSize: number) {
  const [data, total] = await Promise.all([
    prisma.roof.findMany({ skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include: { sidewalls: true } }),
    prisma.roof.count(),
  ])
  return { data, total, page, pageSize }
}

/** Finds a roof by its associated job ID. Returns null if not found. */
export function getRoofByJobId(jobId: string) {
  return prisma.roof.findUnique({ where: { jobId }, include: { sidewalls: true } })
}

/** Updates a roof by job ID. Replaces sidewalls entirely if provided. */
export function updateRoof(jobId: string, data: Record<string, any>) {
  const { sidewalls, ...rest } = data
  const updateData: any = { ...rest }

  // Keep the derived `sideColumnsMidFrameCount` in lock-step with
  // `claddingExtensionMidFrameCount` whenever the latter is part of this update.
  if (updateData.claddingExtensionMidFrameCount !== undefined) {
    updateData.sideColumnsMidFrameCount = updateData.claddingExtensionMidFrameCount
  }

  if (sidewalls !== undefined) {
    updateData.sidewalls = { deleteMany: {}, createMany: { data: sidewalls } }
  }

  return prisma.roof.update({ where: { jobId }, data: updateData, include: { sidewalls: true } })
}

/** Deletes a roof by its associated job ID. Throws if not found. */
export function deleteRoof(jobId: string) {
  return prisma.roof.delete({ where: { jobId } })
}
