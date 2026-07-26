import { prisma } from '../lib/prisma.js'
import type { CreateQuantityMezzanineInput, UpdateQuantityMezzanineInput } from '../schemas/quantity.schema.js'
import { computeJobQuantities } from './quantity-calc.helper.js'

/** Upserts the mezzanine section for a job, calculating authoritative defaults server-side. */
export async function upsertQuantityMezzanine(jobId: string, data: CreateQuantityMezzanineInput) {
  const computed = await computeJobQuantities(jobId)
  const mergedData = { ...computed?.mezzanine, ...data }

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, mezzanine: { create: mergedData as any } } as any,
    update: { mezzanine: { upsert: { create: mergedData as any, update: mergedData as any } } } as any,
    include: { mezzanine: true },
  })
  return result.mezzanine
}

/** Returns the mezzanine section for a job, calculating defaults server-side if not yet persisted. */
export async function getQuantityMezzanineByJobId(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, include: { mezzanine: true } })
  if (q?.mezzanine) return q.mezzanine

  const computed = await computeJobQuantities(jobId)
  if (!computed?.mezzanine) return null

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, mezzanine: { create: computed.mezzanine as any } } as any,
    update: { mezzanine: { upsert: { create: computed.mezzanine as any, update: computed.mezzanine as any } } } as any,
    include: { mezzanine: true },
  })
  return result.mezzanine
}

/** Updates the mezzanine section. Throws P2025 if the parent quantity is not found. */
export async function updateQuantityMezzanine(jobId: string, data: UpdateQuantityMezzanineInput) {
  const computed = await computeJobQuantities(jobId)
  const mergedData = { ...computed?.mezzanine, ...data }

  const result = await prisma.quantity.update({
    where: { jobId },
    data: { mezzanine: { upsert: { create: mergedData as any, update: mergedData as any } } } as any,
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
