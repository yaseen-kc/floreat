import { prisma } from '../lib/prisma.js'
import type { CreateQuantityCladdingInput, UpdateQuantityCladdingInput } from '../schemas/quantity.schema.js'

/** Upserts the cladding section for a job, creating the parent Quantity if needed. */
export async function upsertQuantityCladding(jobId: string, data: CreateQuantityCladdingInput) {
  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, cladding: { create: data } } as any,
    update: { cladding: { upsert: { create: data, update: data } } },
    include: { cladding: true },
  })
  return result.cladding
}

/** Returns the cladding section for a job, or null. */
export async function getQuantityCladdingByJobId(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, include: { cladding: true } })
  return q?.cladding ?? null
}

/** Updates the cladding section. Throws P2025 if the parent quantity is not found. */
export async function updateQuantityCladding(jobId: string, data: UpdateQuantityCladdingInput) {
  const result = await prisma.quantity.update({
    where: { jobId },
    data: { cladding: { upsert: { create: data, update: data } } },
    include: { cladding: true },
  })
  return result.cladding
}

/** Deletes the cladding section. Throws P2025 if the parent quantity or section is not found. */
export async function deleteQuantityCladding(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, select: { id: true } })
  if (!q) throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return prisma.quantityCladding.delete({ where: { quantityId: q.id } })
}

/** Paginated list of cladding sections for jobs owned by userId. */
export async function getQuantityCladdings(userId: string, page: number, pageSize: number) {
  const where = { quantity: { job: { userId } } }
  const [data, total] = await Promise.all([
    prisma.quantityCladding.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { quantity: { createdAt: 'desc' } },
    }),
    prisma.quantityCladding.count({ where }),
  ])
  return { data, total, page, pageSize }
}
