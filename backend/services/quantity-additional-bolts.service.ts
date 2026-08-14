import { prisma } from '../lib/prisma.js'
import type { CreateQuantityAdditionalBoltsInput, UpdateQuantityAdditionalBoltsInput } from '../schemas/quantity.schema.js'
import { computeJobQuantities } from './quantity-calc.helper.js'

/** Upserts the additionalBolts section for a job, calculating authoritative defaults server-side. */
export async function upsertQuantityAdditionalBolts(jobId: string, data: CreateQuantityAdditionalBoltsInput) {
  const computed = await computeJobQuantities(jobId)
  const mergedData = { ...computed?.additionalBolts, ...data }

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, additionalBolts: { create: mergedData as any } } as any,
    update: { deletedAt: null, additionalBolts: { upsert: { create: mergedData as any, update: { ...mergedData as any, deletedAt: null } } } } as any,
    include: { additionalBolts: true },
  })
  return result.additionalBolts
}

/** Returns the additionalBolts section for a job, calculating defaults server-side if not yet persisted. */
export async function getQuantityAdditionalBoltsByJobId(jobId: string) {
  const q = await prisma.quantity.findFirst({ where: { jobId, deletedAt: null }, include: { additionalBolts: { where: { deletedAt: null } } } })
  if (q?.additionalBolts) return q.additionalBolts

  const computed = await computeJobQuantities(jobId)
  if (!computed?.additionalBolts) return null

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, additionalBolts: { create: computed.additionalBolts as any } } as any,
    update: { deletedAt: null, additionalBolts: { upsert: { create: computed.additionalBolts as any, update: { ...computed.additionalBolts as any, deletedAt: null } } } } as any,
    include: { additionalBolts: true },
  })
  return result.additionalBolts
}

/** Updates the additionalBolts section. Throws P2025 if the parent quantity is not found. */
export async function updateQuantityAdditionalBolts(jobId: string, data: UpdateQuantityAdditionalBoltsInput) {
  const computed = await computeJobQuantities(jobId)
  const mergedData = { ...computed?.additionalBolts, ...data }

  const result = await prisma.quantity.update({
    where: { jobId },
    data: { deletedAt: null, additionalBolts: { upsert: { create: mergedData as any, update: { ...mergedData as any, deletedAt: null } } } } as any,
    include: { additionalBolts: true },
  })
  return result.additionalBolts
}

/** Deletes the additionalBolts section. Throws P2025 if the parent quantity or section is not found. */
export async function deleteQuantityAdditionalBolts(jobId: string) {
  const q = await prisma.quantity.findFirst({ where: { jobId, deletedAt: null }, select: { id: true } })
  if (!q) throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return prisma.quantityAdditionalBolts.update({ where: { quantityId: q.id }, data: { deletedAt: new Date() } })
}

/** Paginated list of additionalBolts sections for jobs owned by userId. */
export async function getQuantityAdditionalBolts(userId: string, page: number, pageSize: number) {
  const where = { quantity: { job: { userId }, deletedAt: null }, deletedAt: null }
  const [data, total] = await Promise.all([
    prisma.quantityAdditionalBolts.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { quantity: { createdAt: 'desc' } },
    }),
    prisma.quantityAdditionalBolts.count({ where }),
  ])
  return { data, total, page, pageSize }
}
