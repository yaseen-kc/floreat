/**
 * Spec service — encapsulates database operations for the Spec model.
 * Handles the inline products array (replace-all strategy on upsert/update).
 */
import { prisma } from '../lib/prisma.js'
import type { CreateSpecInput, UpdateSpecInput } from '../schemas/spec.schema.js'
import { replaceChildren, upsertActiveRow } from './soft-delete.service.js'

/** Creates or updates the spec for a given job. Products are replaced entirely on update. */
export async function upsertSpec(jobId: string, data: CreateSpecInput) {
  const { products } = data
  const productData = products ?? []

  return prisma.$transaction(async (tx) => {
    const spec = await upsertActiveRow(tx, 'spec', 'jobId', jobId, { jobId }, { deletedAt: null, deletedBy: null, deletionBatchId: null })
    await replaceChildren(tx, 'specProduct', 'specId', spec.id, productData)
    return (await tx.spec.findUnique({ where: { id: spec.id }, include: { products: { where: { deletedAt: null } } } })) ?? spec
  })
}

/** Returns a paginated list of the user's specs ordered by most recent first. */
export async function getSpecs(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.spec.findMany({ where: { ...where, deletedAt: null }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include: { products: { where: { deletedAt: null } } } }),
    prisma.spec.count({ where: { ...where, deletedAt: null } }),
  ])
  return { data, total, page, pageSize }
}

/** Finds a spec by its associated job ID. Returns null if not found. */
export function getSpecByJobId(jobId: string) {
  return prisma.spec.findFirst({ where: { jobId, deletedAt: null }, include: { products: { where: { deletedAt: null } } } })
}

/** Updates a spec by job ID. Replaces products entirely if provided. Throws P2025 if not found. */
export async function updateSpec(jobId: string, data: UpdateSpecInput) {
  const { products } = data
  const updateData: Record<string, unknown> = {}

  if (products !== undefined) {
  }
  return prisma.$transaction(async (tx) => {
    const spec = await tx.spec.update({ where: { jobId }, data: updateData })
    if (products !== undefined) await replaceChildren(tx, 'specProduct', 'specId', spec.id, products)
    return (await tx.spec.findUnique({ where: { id: spec.id }, include: { products: { where: { deletedAt: null } } } })) ?? spec
  })
}

/** Deletes a spec by its associated job ID. Throws P2025 if not found. */
export function deleteSpec(jobId: string) {
  return prisma.spec.update({ where: { jobId }, data: { deletedAt: new Date() } })
}
