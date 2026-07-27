/**
 * Amount service — encapsulates database operations for the Amount model.
 * An Amount holds the cost summary fields for a job as a flat model.
 */
import { prisma } from '../lib/prisma.js'
import type { CreateAmountInput, UpdateAmountInput } from '../schemas/amount.schema.js'
import { computeJobAmount } from './amount-calc.helper.js'

/** Creates or updates the Amount for a job, deriving server-authoritative calculations. */
export async function upsertAmount(jobId: string, data: CreateAmountInput) {
  const computed = await computeJobAmount(jobId)
  const merged = { ...data, ...(computed ?? {}) }
  return prisma.amount.upsert({
    where: { jobId },
    create: { jobId, ...merged },
    update: { ...merged },
  })
}


/** Returns a paginated list of the user's amounts ordered by most recent first. */
export async function getAmounts(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.amount.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
    prisma.amount.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds an amount by its associated job ID. Calculates & provisions defaults server-side if absent. */
export async function getAmountByJobId(jobId: string) {
  const amt = await prisma.amount.findUnique({ where: { jobId } })
  if (amt) return amt

  const computed = await computeJobAmount(jobId)
  if (!computed) return null

  return prisma.amount.upsert({
    where: { jobId },
    create: { jobId, ...computed },
    update: { ...computed },
  })
}

/** Updates an amount by job ID. Throws P2025 if not found. */
export async function updateAmount(jobId: string, data: UpdateAmountInput) {
  return prisma.amount.update({
    where: { jobId },
    data,
  })
}

/** Deletes an amount by its associated job ID. Throws P2025 if not found. */
export function deleteAmount(jobId: string) {
  return prisma.amount.delete({ where: { jobId } })
}

