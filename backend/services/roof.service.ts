/**
 * Roof service — encapsulates database operations for the Roof model.
 * Handles inline sidewall management (replace-all strategy on upsert/update)
 * and recomputes the derived `sideColumnsWidthHeight` server-side so a client
 * value is never trusted.
 */
import { prisma } from '../lib/prisma.js'
import { deriveSideColumnsWidthHeight } from '@floreat/shared'
import type { CreateRoofInput } from '../schemas/roof.schema.js'

/** Coerces a possibly-Decimal/null DB value into a plain number (or undefined). */
function toNumber(value: unknown): number | undefined {
  return value === null || value === undefined ? undefined : Number(value)
}

/**
 * Creates or updates a roof for a given job. Sidewalls are replaced entirely on
 * update. The derived `sideColumnsWidthHeight` is always recomputed from the
 * payload's eave height, roof slope and cladding extension — any client-supplied
 * value is overwritten.
 */
export function upsertRoof(jobId: string, data: CreateRoofInput) {
  const { sidewalls, ...rest } = data
  const sidewallData = sidewalls ?? []
  // Authoritative recompute: never trust a client-supplied derived value.
  const fields = { ...rest, sideColumnsWidthHeight: deriveSideColumnsWidthHeight(rest) }

  return prisma.roof.upsert({
    where: { jobId },
    create: { jobId, ...fields, sidewalls: { createMany: { data: sidewallData } } },
    update: { ...fields, sidewalls: { deleteMany: {}, createMany: { data: sidewallData } } },
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

/**
 * Updates a roof by job ID (partial). Replaces sidewalls entirely if provided.
 *
 * `sideColumnsWidthHeight` is server-authoritative: whenever any of its inputs
 * (eaveHeight, roofSlope, claddingExtensionWidthHeight) is part of the update,
 * it is recomputed by merging the incoming values with the current DB row;
 * otherwise any client-supplied value is dropped so it can never be set directly.
 */
export async function updateRoof(jobId: string, data: Record<string, any>) {
  const { sidewalls, ...rest } = data
  const updateData: Record<string, any> = { ...rest }

  if (sidewalls !== undefined) {
    updateData.sidewalls = { deleteMany: {}, createMany: { data: sidewalls } }
  }

  const inputKeys = ['eaveHeight', 'roofSlope', 'claddingExtensionWidthHeight'] as const
  if (inputKeys.some((k) => k in rest)) {
    const current = await prisma.roof.findUnique({ where: { jobId } })
    updateData.sideColumnsWidthHeight = deriveSideColumnsWidthHeight({
      eaveHeight: toNumber(rest.eaveHeight ?? current?.eaveHeight),
      roofSlope: toNumber(rest.roofSlope ?? current?.roofSlope),
      claddingExtensionWidthHeight: toNumber(
        rest.claddingExtensionWidthHeight ?? current?.claddingExtensionWidthHeight,
      ),
    })
  } else {
    // Inputs unchanged — never let a client set the derived value directly.
    delete updateData.sideColumnsWidthHeight
  }

  return prisma.roof.update({ where: { jobId }, data: updateData, include: { sidewalls: true } })
}

/** Deletes a roof by its associated job ID. Throws if not found. */
export function deleteRoof(jobId: string) {
  return prisma.roof.delete({ where: { jobId } })
}
