import { prisma } from '../lib/prisma.js'
import type { CreateQuantityAccessoriesInput, UpdateQuantityAccessoriesInput } from '../schemas/quantity.schema.js'

/** Upserts the accessories section for a job, creating the parent Quantity if needed. */
export async function upsertQuantityAccessories(jobId: string, data: CreateQuantityAccessoriesInput) {
  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, accessories: { create: data } } as any,
    update: { accessories: { upsert: { create: data, update: data } } },
    include: { accessories: true },
  })
  return result.accessories
}

/** Returns the accessories section for a job, or null. */
export async function getQuantityAccessoriesByJobId(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, include: { accessories: true } })
  return q?.accessories ?? null
}

/** Updates the accessories section. Throws P2025 if the parent quantity is not found. */
export async function updateQuantityAccessories(jobId: string, data: UpdateQuantityAccessoriesInput) {
  const result = await prisma.quantity.update({
    where: { jobId },
    data: { accessories: { upsert: { create: data, update: data } } },
    include: { accessories: true },
  })
  return result.accessories
}

/** Deletes the accessories section. Throws P2025 if the parent quantity or section is not found. */
export async function deleteQuantityAccessories(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, select: { id: true } })
  if (!q) throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return prisma.quantityAccessories.delete({ where: { quantityId: q.id } })
}

/** Paginated list of accessories sections for jobs owned by userId. */
export async function getQuantityAccessoriesList(userId: string, page: number, pageSize: number) {
  const where = { quantity: { job: { userId } } }
  const [data, total] = await Promise.all([
    prisma.quantityAccessories.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { quantity: { createdAt: 'desc' } },
    }),
    prisma.quantityAccessories.count({ where }),
  ])
  return { data, total, page, pageSize }
}
