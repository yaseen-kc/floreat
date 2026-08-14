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
    update: { ...data, deletedAt: null, deletedBy: null, deletionBatchId: null },
  })
}

/** Returns a paginated list of the user's quotations ordered by most recent first. */
export async function getQuotations(userId: string, page: number, pageSize: number, global = false) {
  const where = global ? { grandTotal: { not: null }, deletedAt: null } : { grandTotal: { not: null }, job: { userId }, deletedAt: null }
  const [data, total] = await Promise.all([
    prisma.quotation.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { updatedAt: 'desc' },
      include: {
        job: {
          select: {
            projectNo: true,
            refNo: true,
            subject: true,
            clientName: true,
            firmName: true,
            frameType: true,
            configuration: true,
            updatedAt: true,
          },
        },
      },
    }),
    prisma.quotation.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds a quotation by its associated job ID. Returns null if not found. */
export function getQuotationByJobId(jobId: string) {
  return prisma.quotation.findFirst({ where: { jobId, deletedAt: null } })
}

/** Updates a quotation by its associated job ID. Throws P2025 if not found. */
export async function updateQuotation(jobId: string, data: Record<string, unknown>) {
  const draft = await prisma.quotation.findFirst({ where: { jobId, status: 'DRAFT' }, select: { jobId: true } })
  if (!draft) throw Object.assign(new Error('Quotation not found'), { code: 'P2025' })
  return prisma.quotation.update({ where: { jobId }, data })
}

/** Deletes a quotation by its associated job ID. Throws P2025 if not found. */
export async function deleteQuotation(jobId: string) {
  const draft = await prisma.quotation.findFirst({ where: { jobId, status: 'DRAFT' }, select: { jobId: true } })
  if (!draft) throw Object.assign(new Error('Quotation not found'), { code: 'P2025' })
  return prisma.quotation.update({ where: { jobId }, data: { deletedAt: new Date() } })
}

export async function transitionQuotation(jobId: string, actorId: string, status: 'SUBMITTED' | 'APPROVED' | 'REJECTED', comment?: string) {
  const current = await prisma.quotation.findFirst({ where: { jobId, deletedAt: null } })
  if (!current) throw Object.assign(new Error('Quotation not found'), { code: 'P2025' })
  const valid = (current.status === 'DRAFT' && status === 'SUBMITTED') ||
    (current.status === 'SUBMITTED' && (status === 'APPROVED' || status === 'REJECTED'))
  if (!valid) throw Object.assign(new Error('Invalid quotation transition'), { code: 'INVALID_TRANSITION' })
  return prisma.quotation.update({ where: { jobId }, data: status === 'SUBMITTED'
    ? { status, submittedById: actorId, submittedAt: new Date() }
    : { status, reviewedById: actorId, reviewedAt: new Date(), reviewComment: comment ?? null } })
}
