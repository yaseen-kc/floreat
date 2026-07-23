import { prisma } from '../lib/prisma.js'
import type { CreateQuantityAdditionalBoltsInput, UpdateQuantityAdditionalBoltsInput } from '../schemas/quantity.schema.js'

/** Upserts the additionalBolts section for a job, creating the parent Quantity if needed. */
export async function upsertQuantityAdditionalBolts(jobId: string, data: CreateQuantityAdditionalBoltsInput) {
  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, additionalBolts: { create: data } } as any,
    update: { additionalBolts: { upsert: { create: data, update: data } } },
    include: { additionalBolts: true },
  })
  return result.additionalBolts
}

/** Returns the additionalBolts section for a job, or null. */
export async function getQuantityAdditionalBoltsByJobId(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, include: { additionalBolts: true } })
  return q?.additionalBolts ?? null
}

/** Updates the additionalBolts section. Throws P2025 if the parent quantity is not found. */
export async function updateQuantityAdditionalBolts(jobId: string, data: UpdateQuantityAdditionalBoltsInput) {
  const result = await prisma.quantity.update({
    where: { jobId },
    data: { additionalBolts: { upsert: { create: data, update: data } } },
    include: { additionalBolts: true },
  })
  return result.additionalBolts
}

/** Deletes the additionalBolts section. Throws P2025 if the parent quantity or section is not found. */
export async function deleteQuantityAdditionalBolts(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, select: { id: true } })
  if (!q) throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return prisma.quantityAdditionalBolts.delete({ where: { quantityId: q.id } })
}

/** Paginated list of additionalBolts sections for jobs owned by userId. */
export async function getQuantityAdditionalBoltsList(userId: string, page: number, pageSize: number) {
  const where = { quantity: { job: { userId } } }
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
