/**
 * Spec service — encapsulates database operations for the Spec model.
 * Spec is a flat 1-to-1 job-owned record (no child arrays), so upsert simply
 * spreads the validated payload.
 */
import { prisma } from '../lib/prisma.js'
import type { CreateSpecInput, UpdateSpecInput } from '../schemas/spec.schema.js'

type SpecCreateData = Parameters<typeof prisma.spec.create>[0]['data']
type SpecUpdateData = Parameters<typeof prisma.spec.update>[0]['data']

/** Creates or updates the spec for a given job. */
export function upsertSpec(jobId: string, data: CreateSpecInput) {
  return prisma.spec.upsert({
    where: { jobId },
    create: { jobId, ...data } as SpecCreateData,
    update: { ...data } as SpecUpdateData,
  })
}

/** Returns a paginated list of the user's specs ordered by most recent first. */
export async function getSpecs(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.spec.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
    prisma.spec.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds a spec by its associated job ID. Returns null if not found. */
export function getSpecByJobId(jobId: string) {
  return prisma.spec.findUnique({ where: { jobId } })
}

/** Updates a spec by job ID. Throws P2025 if not found. */
export function updateSpec(jobId: string, data: UpdateSpecInput) {
  return prisma.spec.update({ where: { jobId }, data: data as SpecUpdateData })
}

/** Deletes a spec by its associated job ID. Throws P2025 if not found. */
export function deleteSpec(jobId: string) {
  return prisma.spec.delete({ where: { jobId } })
}
