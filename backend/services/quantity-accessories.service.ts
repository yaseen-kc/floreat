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
    update: { accessories: { upsert: { create: mergedData as any, update: mergedData as any } } } as any,
    include: { accessories: true },
  })
  return result.accessories
}

/** Returns the accessories section for a job, calculating defaults server-side if not yet persisted. */
export async function getQuantityAccessoriesByJobId(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, include: { accessories: true } })
  if (q?.accessories) return q.accessories

  const computed = await computeJobQuantities(jobId)
  if (!computed?.accessories) return null

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, accessories: { create: computed.accessories as any } } as any,
    update: { accessories: { upsert: { create: computed.accessories as any, update: computed.accessories as any } } } as any,
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
    data: { accessories: { upsert: { create: mergedData as any, update: mergedData as any } } } as any,
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
export async function getQuantityAccessories(userId: string, page: number, pageSize: number) {
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
