/**
 * Amount service — encapsulates database operations for the Amount model.
 * An Amount holds the cost summary fields for a job as a flat model.
 */
import { prisma } from '../lib/prisma.js'
import type { CreateAmountInput, UpdateAmountInput } from '../schemas/amount.schema.js'
import { computeJobAmount } from './amount-calc.helper.js'

/** Creates or updates the Amount for a job, deriving server-authoritative calculations. */
export async function upsertAmount(jobId: string, _data: CreateAmountInput) {
  const computed = await computeJobAmount(jobId)
  if (!computed) return null
  // Amount fields are derived from the canonical job/rate snapshot. Accepting
  // client values here would let a caller replace quantities, rates, or totals.
  const merged = computed
  return prisma.amount.upsert({
    where: { jobId },
    create: { jobId, ...merged, calculationVersion: 'amount-v1', sourceUpdatedAt: new Date(), rateVersion: 1, isStale: false },
    update: { ...merged, calculationVersion: 'amount-v1', sourceUpdatedAt: new Date(), rateVersion: 1, isStale: false, deletedAt: null, deletedBy: null, deletionBatchId: null },
  })
}


/** Returns a paginated list of the user's amounts ordered by most recent first. */
export async function getAmounts(userId: string, page: number, pageSize: number) {
  const where = { job: { userId }, deletedAt: null }
  const [data, total] = await Promise.all([
    prisma.amount.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
    prisma.amount.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds an amount by its associated job ID without creating or recalculating rows. */
export async function getAmountByJobId(jobId: string) {
  return prisma.amount.findFirst({ where: { jobId, deletedAt: null } })
}

/** Updates an amount by job ID. Throws P2025 if not found. */
export async function updateAmount(jobId: string, data: UpdateAmountInput) {
  const computed = await computeJobAmount(jobId)
  if (!computed) return null
  return prisma.amount.update({
    where: { jobId },
    data: { ...computed, calculationVersion: 'amount-v1', sourceUpdatedAt: new Date(), rateVersion: 1, isStale: false },
  })
}

/** Deletes an amount by its associated job ID. Throws P2025 if not found. */
export function deleteAmount(jobId: string) {
  return prisma.amount.update({ where: { jobId }, data: { deletedAt: new Date() } })
}

