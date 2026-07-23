import { prisma } from '../lib/prisma.js'
import type { CreateQuantityCanopyInput, UpdateQuantityCanopyInput } from '../schemas/quantity.schema.js'

/** Upserts the canopy section for a job, creating the parent Quantity if needed. */
export async function upsertQuantityCanopy(jobId: string, data: CreateQuantityCanopyInput) {
  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, canopy: { create: data } } as any,
    update: { canopy: { upsert: { create: data, update: data } } },
    include: { canopy: true },
  })
  return result.canopy
}

/** Returns the canopy section for a job, or null. */
export async function getQuantityCanopyByJobId(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, include: { canopy: true } })
  return q?.canopy ?? null
}

/** Updates the canopy section. Throws P2025 if the parent quantity is not found. */
export async function updateQuantityCanopy(jobId: string, data: UpdateQuantityCanopyInput) {
  const result = await prisma.quantity.update({
    where: { jobId },
    data: { canopy: { upsert: { create: data, update: data } } },
    include: { canopy: true },
  })
  return result.canopy
}

/** Deletes the canopy section. Throws P2025 if the parent quantity or section is not found. */
export async function deleteQuantityCanopy(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, select: { id: true } })
  if (!q) throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return prisma.quantityCanopy.delete({ where: { quantityId: q.id } })
}

/** Paginated list of canopy sections for jobs owned by userId. */
export async function getQuantityCanopies(userId: string, page: number, pageSize: number) {
  const where = { quantity: { job: { userId } } }
  const [data, total] = await Promise.all([
    prisma.quantityCanopy.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { quantity: { createdAt: 'desc' } },
    }),
    prisma.quantityCanopy.count({ where }),
  ])
  return { data, total, page, pageSize }
}
