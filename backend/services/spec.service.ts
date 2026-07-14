/**
 * Spec service — encapsulates database operations for the Spec model.
 * Handles the inline products array (replace-all strategy on upsert/update).
 */
import { prisma } from '../lib/prisma.js'
import type { CreateSpecInput, UpdateSpecInput } from '../schemas/spec.schema.js'

/** Creates or updates the spec for a given job. Products are replaced entirely on update. */
export function upsertSpec(jobId: string, data: CreateSpecInput) {
  const { products } = data
  const productData = products ?? []

  return prisma.spec.upsert({
    where: { jobId },
    create: {
      jobId,
      products: { createMany: { data: productData } },
    },
    update: {
      products: { deleteMany: {}, createMany: { data: productData } },
    },
    include: { products: true },
  })
}

/** Returns a paginated list of the user's specs ordered by most recent first. */
export async function getSpecs(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.spec.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include: { products: true } }),
    prisma.spec.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds a spec by its associated job ID. Returns null if not found. */
export function getSpecByJobId(jobId: string) {
  return prisma.spec.findUnique({ where: { jobId }, include: { products: true } })
}

/** Updates a spec by job ID. Replaces products entirely if provided. Throws P2025 if not found. */
export function updateSpec(jobId: string, data: UpdateSpecInput) {
  const { products } = data
  const updateData: Record<string, unknown> = {}

  if (products !== undefined) {
    updateData.products = { deleteMany: {}, createMany: { data: products } }
  }

  return prisma.spec.update({ where: { jobId }, data: updateData, include: { products: true } })
}

/** Deletes a spec by its associated job ID. Throws P2025 if not found. */
export function deleteSpec(jobId: string) {
  return prisma.spec.delete({ where: { jobId } })
}
