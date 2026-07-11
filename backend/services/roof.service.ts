/**
 * Roof service — encapsulates database operations for the Roof model.
 * Handles inline sidewall management (replace-all strategy on upsert/update).
 */
import { prisma } from '../lib/prisma.js'
import { deriveSideColumnsWidthHeight } from '@floreat/shared/calc'
import { recomputeAccessoriesQuantities } from './accessories.service.js'
import type { CreateRoofInput, UpdateRoofInput } from '../schemas/roof.schema.js'

/** Creates or updates a roof for a given job. Sidewalls are replaced entirely on update. */
export async function upsertRoof(jobId: string, data: CreateRoofInput) {
  const { sidewalls, ...rest } = data
  const sidewallData = sidewalls ?? []

  // `sideColumnsMidFrameCount` / `sideColumnsEndFrameCount` are derived
  // server-side: they must always equal their `claddingExtension*` counterpart.
  // Overwrite whenever the cladding value is present so a buggy/malicious client
  // can't persist a mismatch.
  if (rest.claddingExtensionMidFrameCount !== undefined) {
    rest.sideColumnsMidFrameCount = rest.claddingExtensionMidFrameCount
  }
  if (rest.claddingExtensionEndFrameCount !== undefined) {
    rest.sideColumnsEndFrameCount = rest.claddingExtensionEndFrameCount
  }

  // `sideColumnsWidthHeight` is a derived quantity — never trust the client's
  // value. Recompute it from eaveHeight/roofSlope/claddingExtensionWidthHeight
  // (see @floreat/shared/calc) and overwrite, or drop it when inputs are blank.
  const derivedWidthHeight = deriveSideColumnsWidthHeight(rest)
  if (derivedWidthHeight !== undefined) rest.sideColumnsWidthHeight = derivedWidthHeight
  else delete rest.sideColumnsWidthHeight

  const roof = await prisma.roof.upsert({
    where: { jobId },
    create: { jobId, ...rest, sidewalls: { createMany: { data: sidewallData } } },
    update: { ...rest, sidewalls: { deleteMany: {}, createMany: { data: sidewallData } } },
    include: { sidewalls: true },
  })

  // Accessory quantities are derived from the roof — keep them in sync when the
  // roof changes (no-op if the job has no Accessories row yet).
  await recomputeAccessoriesQuantities(jobId)

  return roof
}

/** Returns a paginated list of the user's roofs ordered by most recent first. */
export async function getRoofs(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.roof.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include: { sidewalls: true } }),
    prisma.roof.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds a roof by its associated job ID. Returns null if not found. */
export function getRoofByJobId(jobId: string) {
  return prisma.roof.findUnique({ where: { jobId }, include: { sidewalls: true } })
}

/** Updates a roof by job ID. Replaces sidewalls entirely if provided. */
export async function updateRoof(jobId: string, data: Record<string, any>) {
  const { sidewalls, ...rest } = data
  const updateData: any = { ...rest }

  // Keep the derived `sideColumnsMidFrameCount` / `sideColumnsEndFrameCount` in
  // lock-step with their `claddingExtension*` counterpart whenever the latter is
  // part of this update.
  if (updateData.claddingExtensionMidFrameCount !== undefined) {
    updateData.sideColumnsMidFrameCount = updateData.claddingExtensionMidFrameCount
  }
  if (updateData.claddingExtensionEndFrameCount !== undefined) {
    updateData.sideColumnsEndFrameCount = updateData.claddingExtensionEndFrameCount
  }

  // `sideColumnsWidthHeight` is derived — never persist a client-supplied value.
  // When this patch touches any derivation input (or sends a value), recompute
  // it from the patch merged with the stored roof (see @floreat/shared/calc).
  if (
    'eaveHeight' in updateData ||
    'roofSlope' in updateData ||
    'claddingExtensionWidthHeight' in updateData ||
    'sideColumnsWidthHeight' in updateData
  ) {
    const current = await prisma.roof.findUnique({
      where: { jobId },
      select: { eaveHeight: true, roofSlope: true, claddingExtensionWidthHeight: true },
    })
    const toNum = (v: unknown): number | undefined => (v == null ? undefined : Number(v))
    const derivedWidthHeight = deriveSideColumnsWidthHeight({
      eaveHeight: updateData.eaveHeight ?? toNum(current?.eaveHeight),
      roofSlope: updateData.roofSlope ?? toNum(current?.roofSlope),
      claddingExtensionWidthHeight:
        updateData.claddingExtensionWidthHeight ?? toNum(current?.claddingExtensionWidthHeight),
    })
    if (derivedWidthHeight !== undefined) updateData.sideColumnsWidthHeight = derivedWidthHeight
    else delete updateData.sideColumnsWidthHeight
  }

  if (sidewalls !== undefined) {
    updateData.sidewalls = { deleteMany: {}, createMany: { data: sidewalls } }
  }

  const roof = await prisma.roof.update({ where: { jobId }, data: updateData, include: { sidewalls: true } })

  // Accessory quantities depend on the roof — recompute after any roof change
  // (no-op if the job has no Accessories row yet).
  await recomputeAccessoriesQuantities(jobId)

  return roof
}

/** Deletes a roof by its associated job ID. Throws if not found. */
export function deleteRoof(jobId: string) {
  return prisma.roof.delete({ where: { jobId } })
}
