import { prisma } from '../lib/prisma.js'
import type { CreateQuantityMezzanineInput, UpdateQuantityMezzanineInput } from '../schemas/quantity.schema.js'

/** Upserts the mezzanine section for a job, creating the parent Quantity if needed. */
export async function upsertQuantityMezzanine(jobId: string, data: CreateQuantityMezzanineInput) {
  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, mezzanine: { create: data } } as any,
    update: { mezzanine: { upsert: { create: data, update: data } } },
    include: { mezzanine: true },
  })
  return result.mezzanine
}

/** Returns the mezzanine section for a job, or null. */
export async function getQuantityMezzanineByJobId(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, include: { mezzanine: true } })
  return q?.mezzanine ?? null
}

/** Updates the mezzanine section. Throws P2025 if the parent quantity is not found. */
export async function updateQuantityMezzanine(jobId: string, data: UpdateQuantityMezzanineInput) {
  const result = await prisma.quantity.update({
    where: { jobId },
    data: { mezzanine: { upsert: { create: data, update: data } } },
    include: { mezzanine: true },
  })
  return result.mezzanine
}

/** Deletes the mezzanine section. Throws P2025 if the parent quantity or section is not found. */
export async function deleteQuantityMezzanine(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, select: { id: true } })
  if (!q) throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return prisma.quantityMezzanine.delete({ where: { quantityId: q.id } })
}

/** Paginated list of mezzanine sections for jobs owned by userId. */
export async function getQuantityMezzanines(userId: string, page: number, pageSize: number) {
  const where = { quantity: { job: { userId } } }
  const [data, total] = await Promise.all([
    prisma.quantityMezzanine.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { quantity: { createdAt: 'desc' } },
    }),
    prisma.quantityMezzanine.count({ where }),
  ])
  return { data, total, page, pageSize }
}
