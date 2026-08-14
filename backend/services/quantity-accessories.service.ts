import { prisma } from '../lib/prisma.js'
import type { CreateQuantityAccessoriesInput, UpdateQuantityAccessoriesInput } from '../schemas/quantity.schema.js'
import { computeJobQuantities } from './quantity-calc.helper.js'

/** Upserts the accessories section for a job, calculating authoritative defaults server-side. */
export async function upsertQuantityAccessories(jobId: string, data: CreateQuantityAccessoriesInput) {
  const computed = await computeJobQuantities(jobId)
  const mergedData = { ...computed?.accessories, ...data }

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, accessories: { create: mergedData as any } } as any,
    update: { deletedAt: null, accessories: { upsert: { create: mergedData as any, update: { ...mergedData as any, deletedAt: null } } } } as any,
    include: { accessories: true },
  })
  return result.accessories
}

/** Returns the accessories section for a job, calculating defaults server-side if not yet persisted. */
export async function getQuantityAccessoriesByJobId(jobId: string) {
  const q = await prisma.quantity.findFirst({ where: { jobId, deletedAt: null }, include: { accessories: { where: { deletedAt: null } } } })
  if (q?.accessories) return q.accessories

  const computed = await computeJobQuantities(jobId)
  if (!computed?.accessories) return null

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, accessories: { create: computed.accessories as any } } as any,
    update: { deletedAt: null, accessories: { upsert: { create: computed.accessories as any, update: { ...computed.accessories as any, deletedAt: null } } } } as any,
    include: { accessories: true },
  })
  return result.accessories
}

/** Updates the accessories section. Throws P2025 if the parent quantity is not found. */
export async function updateQuantityAccessories(jobId: string, data: UpdateQuantityAccessoriesInput) {
  const computed = await computeJobQuantities(jobId)
  const mergedData = { ...computed?.accessories, ...data }

  const result = await prisma.quantity.update({
    where: { jobId },
    data: { deletedAt: null, accessories: { upsert: { create: mergedData as any, update: { ...mergedData as any, deletedAt: null } } } } as any,
    include: { accessories: true },
  })
  return result.accessories
}

/** Deletes the accessories section. Throws P2025 if the parent quantity or section is not found. */
export async function deleteQuantityAccessories(jobId: string) {
  const q = await prisma.quantity.findFirst({ where: { jobId, deletedAt: null }, select: { id: true } })
  if (!q) throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return prisma.quantityAccessories.update({ where: { quantityId: q.id }, data: { deletedAt: new Date() } })
}

/** Paginated list of accessories sections for jobs owned by userId. */
export async function getQuantityAccessories(userId: string, page: number, pageSize: number) {
  const where = { quantity: { job: { userId }, deletedAt: null }, deletedAt: null }
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
