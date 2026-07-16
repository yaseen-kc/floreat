/**
 * Rate service — encapsulates database operations for the Rate master model.
 * Rate is a top-level master/lookup table (unique by `item`, no `jobId`), so it
 * follows plain REST rather than the nested job-scoped pattern.
 *
 * The four rates (fabrication/erection/loading/total) are never stored — they
 * are derived from each row's raw pricing components via `@floreat/shared/calc`
 * and attached to every response, keeping the server authoritative (§0).
 */
import { prisma } from '../lib/prisma.js'
import { deriveRateBreakdown } from '@floreat/shared/calc'
import type { CreateRateInput, UpdateRateInput } from '../schemas/rate.schema.js'

/** A Rate row as returned by Prisma (Decimal columns are `Decimal` objects server-side). */
type RateRow = Awaited<ReturnType<typeof prisma.rate.findUniqueOrThrow>>

/** Coerce a Prisma Decimal (or null) to a plain number for the pure calc. */
const toNum = (v: unknown): number | undefined => (v == null ? undefined : Number(v))

/**
 * Attaches the four server-derived rates to a Rate row. The raw pricing
 * components stay on the row untouched; consumers read `fabricationRate`,
 * `erectionRate`, `loadingRate` and `totalRate` off the returned object.
 */
function withBreakdown<T extends RateRow>(rate: T) {
  const breakdown = deriveRateBreakdown({
    material: toNum(rate.material),
    fabrication: toNum(rate.fabrication),
    transportation: toNum(rate.transportation),
    installation: toNum(rate.installation),
    loadingUnloading: toNum(rate.loadingUnloading),
    overheads: toNum(rate.overheads),
    others: toNum(rate.others),
    marginPercentage: toNum(rate.marginPercentage),
  })
  return { ...rate, ...breakdown }
}

/** Creates a new rate master item. Throws P2002 if `item` already exists. */
export async function createRate(data: CreateRateInput) {
  const rate = await prisma.rate.create({ data })
  return withBreakdown(rate)
}

/** Returns a paginated list of rate items ordered by most recent first, each with its derived rates. */
export async function getRates(page: number, pageSize: number) {
  const [rows, total] = await Promise.all([
    prisma.rate.findMany({ skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
    prisma.rate.count(),
  ])
  return { data: rows.map(withBreakdown), total, page, pageSize }
}

/** Finds a single rate item by id, with its derived rates. Returns null if not found. */
export async function getRateById(id: string) {
  const rate = await prisma.rate.findUnique({ where: { id } })
  return rate ? withBreakdown(rate) : null
}

/** Partially updates a rate item by id. Throws P2025 if not found. */
export async function updateRate(id: string, data: UpdateRateInput) {
  const rate = await prisma.rate.update({ where: { id }, data })
  return withBreakdown(rate)
}

/** Deletes a rate item by id. Throws P2025 if not found. */
export function deleteRate(id: string) {
  return prisma.rate.delete({ where: { id } })
}
