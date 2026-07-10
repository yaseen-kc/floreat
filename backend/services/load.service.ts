/**
 * Load service — encapsulates database operations for the Load model.
 * Load is a flat 1-to-1 resource per job (no child arrays).
 */
import { prisma } from '../lib/prisma.js'
import type { CreateLoadInput } from '../schemas/load.schema.js'

/** Creates or updates a load for a given job. */
export function upsertLoad(jobId: string, data: CreateLoadInput) {
  return prisma.load.upsert({
    where: { jobId },
    create: { jobId, ...data },
    update: { ...data },
  })
}

/** Returns a paginated list of the user's loads ordered by most recent first. */
export async function getLoads(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.load.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
    prisma.load.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds a load by its associated job ID. Returns null if not found. */
export function getLoadByJobId(jobId: string) {
  return prisma.load.findUnique({ where: { jobId } })
}

/** Updates a load by its associated job ID. Throws P2025 if not found. */
export function updateLoad(jobId: string, data: Record<string, unknown>) {
  return prisma.load.update({ where: { jobId }, data })
}

/** Deletes a load by its associated job ID. Throws P2025 if not found. */
export function deleteLoad(jobId: string) {
  return prisma.load.delete({ where: { jobId } })
}
