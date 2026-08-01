/**
 * Quotation service — encapsulates database operations for the Quotation model.
 * Quotation is a flat 1-to-1 resource per job (no child arrays).
 */
import { prisma } from '../lib/prisma.js'
import type { CreateQuotationInput } from '../schemas/quotation.schema.js'

/** Creates or updates a quotation for a given job. */
export function upsertQuotation(jobId: string, data: CreateQuotationInput) {
  return prisma.quotation.upsert({
    where: { jobId },
    create: { jobId, ...data },
    update: { ...data },
  })
}

/** Returns a paginated list of the user's quotations ordered by most recent first. */
export async function getQuotations(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.quotation.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
    prisma.quotation.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds a quotation by its associated job ID. Returns null if not found. */
export function getQuotationByJobId(jobId: string) {
  return prisma.quotation.findUnique({ where: { jobId } })
}

/** Updates a quotation by its associated job ID. Throws P2025 if not found. */
export function updateQuotation(jobId: string, data: Record<string, unknown>) {
  return prisma.quotation.update({ where: { jobId }, data })
}

/** Deletes a quotation by its associated job ID. Throws P2025 if not found. */
export function deleteQuotation(jobId: string) {
  return prisma.quotation.delete({ where: { jobId } })
}
