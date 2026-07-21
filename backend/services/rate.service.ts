/**
 * Rate service — encapsulates database operations for the Rate master model.
 * Rate is a top-level master/lookup table (unique by `item`, no `jobId`), so it
 * follows plain REST rather than the nested job-scoped pattern.
 *
 * The four derived rates (fabrication/erection/loading/total) are computed from
 * raw pricing components via `@floreat/shared/calc` and stored on every write.
 * Reads return the stored values directly — no on-the-fly computation.
 */
import { prisma } from '../lib/prisma.js'
import { deriveRateBreakdown } from '@floreat/shared/calc'
import type { CreateRateInput, UpdateRateInput } from '../schemas/rate.schema.js'

/** A Rate row as returned by Prisma (Decimal columns are `Decimal` objects server-side). */
type RateRow = Awaited<ReturnType<typeof prisma.rate.findUniqueOrThrow>>

/** Coerce a Prisma Decimal (or null) to a plain number for the pure calc. */
const toNum = (v: unknown): number | undefined => (v == null ? undefined : Number(v))

/** Compute the four derived rates from a full set of pricing fields. */
function computeBreakdown(row: {
  material?: number | null | unknown
  fabrication?: number | null | unknown
  transportation?: number | null | unknown
  installation?: number | null | unknown
  loadingUnloading?: number | null | unknown
  overheads?: number | null | unknown
  others?: number | null | unknown
  marginPercentage?: number | null | unknown
}) {
  return deriveRateBreakdown({
    material: toNum(row.material),
    fabrication: toNum(row.fabrication),
    transportation: toNum(row.transportation),
    installation: toNum(row.installation),
    loadingUnloading: toNum(row.loadingUnloading),
    overheads: toNum(row.overheads),
    others: toNum(row.others),
    marginPercentage: toNum(row.marginPercentage),
  })
}

/** Creates a new rate master item, storing its derived rates. Throws P2002 if `item` already exists. */
export async function createRate(data: CreateRateInput) {
  const breakdown = computeBreakdown(data)
  return prisma.rate.create({ data: { ...data, ...breakdown } })
}

/** Returns a paginated list of rate items ordered by most recent first. */
export async function getRates(page: number, pageSize: number) {
  const [rows, total] = await Promise.all([
    prisma.rate.findMany({ skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
    prisma.rate.count(),
  ])
  return { data: rows, total, page, pageSize }
}

/** Finds a single rate item by id. Returns null if not found. */
export async function getRateById(id: string) {
  return prisma.rate.findUnique({ where: { id } })
}

/**
 * Partially updates a rate item by id, recomputing derived rates from the
 * merged (existing + incoming) pricing values. Throws P2025 if not found.
 */
export async function updateRate(id: string, data: UpdateRateInput) {
  const existing = await prisma.rate.findUnique({ where: { id } })
  if (!existing) {
    // Throw the same Prisma not-found code the controller expects.
    const e = new Error('Record not found') as Error & { code: string }
    e.code = 'P2025'
    throw e
  }
  const breakdown = computeBreakdown({
    material: data.material !== undefined ? data.material : existing.material,
    fabrication: data.fabrication !== undefined ? data.fabrication : existing.fabrication,
    transportation: data.transportation !== undefined ? data.transportation : existing.transportation,
    installation: data.installation !== undefined ? data.installation : existing.installation,
    loadingUnloading: data.loadingUnloading !== undefined ? data.loadingUnloading : existing.loadingUnloading,
    overheads: data.overheads !== undefined ? data.overheads : existing.overheads,
    others: data.others !== undefined ? data.others : existing.others,
    marginPercentage: data.marginPercentage !== undefined ? data.marginPercentage : existing.marginPercentage,
  })
  return prisma.rate.update({ where: { id }, data: { ...data, ...breakdown } })
}

/** Deletes a rate item by id. Throws P2025 if not found. */
export function deleteRate(id: string) {
  return prisma.rate.delete({ where: { id } })
}
