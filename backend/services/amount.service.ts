/**
 * Amount service — encapsulates database operations for the Amount model.
 * An Amount is the cost summary for a job: one container plus a flat
 * `items[]` array. On every write the items list is replaced wholesale
 * (deleteMany + createMany) so each save is authoritative.
 */
import { prisma } from '../lib/prisma.js'
import type { CreateAmountInput, UpdateAmountInput } from '../schemas/amount.schema.js'

const includeItems = { items: true }

function buildItems(items: CreateAmountInput['items']) {
  if (!items?.length) return {}
  return { items: { createMany: { data: items } } }
}

/** Creates or replaces the Amount for a job. Items are replaced wholesale. */
export function upsertAmount(jobId: string, data: CreateAmountInput) {
  const items = data.items ?? []
  return prisma.amount.upsert({
    where: { jobId },
    create: { jobId, ...buildItems(items) },
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
export function updateAmount(jobId: string, data: UpdateAmountInput) {
  const items = data.items ?? []
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
