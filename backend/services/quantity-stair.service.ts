import { prisma } from '../lib/prisma.js'
import type { CreateQuantityStairInput, UpdateQuantityStairInput } from '../schemas/quantity.schema.js'

/** Upserts the stair section for a job, creating the parent Quantity if needed. */
export async function upsertQuantityStair(jobId: string, data: CreateQuantityStairInput) {
  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, stair: { create: data } } as any,
    update: { stair: { upsert: { create: data, update: data } } },
    include: { stair: true },
  })
  return result.stair
}

/** Returns the stair section for a job, or null. */
export async function getQuantityStairByJobId(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, include: { stair: true } })
  return q?.stair ?? null
}

/** Updates the stair section. Throws P2025 if the parent quantity is not found. */
export async function updateQuantityStair(jobId: string, data: UpdateQuantityStairInput) {
  const result = await prisma.quantity.update({
    where: { jobId },
    data: { stair: { upsert: { create: data, update: data } } },
    include: { stair: true },
  })
  return result.stair
}

/** Deletes the stair section. Throws P2025 if the parent quantity or section is not found. */
export async function deleteQuantityStair(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, select: { id: true } })
  if (!q) throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return prisma.quantityStair.delete({ where: { quantityId: q.id } })
}

/** Paginated list of stair sections for jobs owned by userId. */
export async function getQuantityStairs(userId: string, page: number, pageSize: number) {
  const where = { quantity: { job: { userId } } }
  const [data, total] = await Promise.all([
    prisma.quantityStair.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { quantity: { createdAt: 'desc' } },
    }),
    prisma.quantityStair.count({ where }),
  ])
  return { data, total, page, pageSize }
}
