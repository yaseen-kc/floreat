import { prisma } from '../lib/prisma.js'
import type { CreateQuantityCanopyInput, UpdateQuantityCanopyInput } from '../schemas/quantity.schema.js'
import { computeJobQuantities } from './quantity-calc.helper.js'

/** Upserts the canopy section for a job, calculating authoritative defaults server-side. */
export async function upsertQuantityCanopy(jobId: string, data: CreateQuantityCanopyInput) {
  const computed = await computeJobQuantities(jobId)
  const mergedData = { ...computed?.canopy, ...data }

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, canopy: { create: mergedData as any } } as any,
    update: { canopy: { upsert: { create: mergedData as any, update: mergedData as any } } } as any,
    include: { canopy: true },
  })
  return result.canopy
}

/** Returns the canopy section for a job, calculating defaults server-side if not yet persisted. */
export async function getQuantityCanopyByJobId(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, include: { canopy: true } })
  if (q?.canopy) return q.canopy

  const computed = await computeJobQuantities(jobId)
  if (!computed?.canopy) return null

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, canopy: { create: computed.canopy as any } } as any,
    update: { canopy: { upsert: { create: computed.canopy as any, update: computed.canopy as any } } } as any,
    include: { canopy: true },
  })
  return result.canopy
}

/** Updates the canopy section. Throws P2025 if the parent quantity is not found. */
export async function updateQuantityCanopy(jobId: string, data: UpdateQuantityCanopyInput) {
  const computed = await computeJobQuantities(jobId)
  const mergedData = { ...computed?.canopy, ...data }

  const result = await prisma.quantity.update({
    where: { jobId },
    data: { canopy: { upsert: { create: mergedData as any, update: mergedData as any } } } as any,
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
