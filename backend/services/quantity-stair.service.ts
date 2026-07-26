import { prisma } from '../lib/prisma.js'
import type { CreateQuantityStairInput, UpdateQuantityStairInput } from '../schemas/quantity.schema.js'
import { computeJobQuantities } from './quantity-calc.helper.js'

/** Upserts the stair section for a job, calculating authoritative defaults server-side. */
export async function upsertQuantityStair(jobId: string, data: CreateQuantityStairInput) {
  const computed = await computeJobQuantities(jobId)
  const mergedData = { ...computed?.stair, ...data }

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, stair: { create: mergedData as any } } as any,
    update: { stair: { upsert: { create: mergedData as any, update: mergedData as any } } } as any,
    include: { stair: true },
  })
  return result.stair
}

/** Returns the stair section for a job, calculating defaults server-side if not yet persisted. */
export async function getQuantityStairByJobId(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, include: { stair: true } })
  if (q?.stair) return q.stair

  const computed = await computeJobQuantities(jobId)
  if (!computed?.stair) return null

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, stair: { create: computed.stair as any } } as any,
    update: { stair: { upsert: { create: computed.stair as any, update: computed.stair as any } } } as any,
    include: { stair: true },
  })
  return result.stair
}

/** Updates the stair section. Throws P2025 if the parent quantity is not found. */
export async function updateQuantityStair(jobId: string, data: UpdateQuantityStairInput) {
  const computed = await computeJobQuantities(jobId)
  const mergedData = { ...computed?.stair, ...data }

  const result = await prisma.quantity.update({
    where: { jobId },
    data: { stair: { upsert: { create: mergedData as any, update: mergedData as any } } } as any,
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
