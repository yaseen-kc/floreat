/**
 * Amount service — encapsulates database operations for the Amount model.
 * An Amount is the cost summary for a job: one container plus a flat
 * `items[]` array. On every write the items list is replaced wholesale
 * (deleteMany + createMany) so each save is authoritative.
 *
 * rateFabrication/rateErection/rateLoading on each item are auto-derived from
 * the Rate master by matching AmountItem.description → Rate.item via the
 * DEFAULT_AMOUNT_ITEMS rateItem mapping. They are never accepted as input.
 */
import { prisma } from '../lib/prisma.js'
import type { CreateAmountInput, UpdateAmountInput } from '../schemas/amount.schema.js'
import { DEFAULT_AMOUNT_ITEMS } from '@floreat/shared/schemas'
import { deriveAmountItemRates } from '@floreat/shared/calc'

const includeItems = { items: true }

/** Build a description → rateItem lookup from the canonical mapping. */
const descToRateItem = new Map(
  DEFAULT_AMOUNT_ITEMS.filter((d) => d.rateItem).map((d) => [d.description, d.rateItem!]),
)

/** Fetch all Rate rows and return a Map keyed by Rate.item. */
async function buildRateMap() {
  const rates = await prisma.rate.findMany({ select: { item: true, fabricationRate: true, erectionRate: true, loadingRate: true } })
  return new Map(rates.map((r) => [r.item, r]))
}

/** Enrich raw input items with derived rate fields looked up from the Rate master. */
async function enrichItems(items: NonNullable<CreateAmountInput['items']>) {
  if (!items.length) return items
  const rateMap = await buildRateMap()
  return items.map((item) => {
    const rateItem = item.description ? descToRateItem.get(item.description) : undefined
    const rate = rateItem ? rateMap.get(rateItem) : undefined
    return { ...item, ...deriveAmountItemRates(rate ?? null) }
  })
}

/** Creates or replaces the Amount for a job. Items are replaced wholesale. */
export async function upsertAmount(jobId: string, data: CreateAmountInput) {
  const items = await enrichItems(data.items ?? [])
  return prisma.amount.upsert({
    where: { jobId },
    create: { jobId, ...(items.length ? { items: { createMany: { data: items } } } : {}) },
    update: { items: { deleteMany: {}, createMany: { data: items } } },
    include: includeItems,
  })
}

/** Returns a paginated list of the user's amounts ordered by most recent first. */
export async function getAmounts(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.amount.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include: includeItems }),
    prisma.amount.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds an amount by its associated job ID. Returns null if not found. */
export function getAmountByJobId(jobId: string) {
  return prisma.amount.findUnique({ where: { jobId }, include: includeItems })
}

/** Updates an amount by job ID. Replaces items wholesale. Throws P2025 if not found. */
export async function updateAmount(jobId: string, data: UpdateAmountInput) {
  const items = await enrichItems(data.items ?? [])
  return prisma.amount.update({
    where: { jobId },
    data: { items: { deleteMany: {}, createMany: { data: items } } },
    include: includeItems,
  })
}

/** Deletes an amount by its associated job ID. Throws P2025 if not found. */
export function deleteAmount(jobId: string) {
  return prisma.amount.delete({ where: { jobId } })
}
