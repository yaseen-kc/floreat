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
    update: { deletedAt: null, mezzanine: { upsert: { create: mergedData as any, update: { ...mergedData as any, deletedAt: null } } } } as any,
    include: { mezzanine: true },
  })
  return result.mezzanine
}

/** Returns the mezzanine section for a job, calculating defaults server-side if not yet persisted. */
export async function getQuantityMezzanineByJobId(jobId: string) {
  const q = await prisma.quantity.findFirst({ where: { jobId, deletedAt: null }, include: { mezzanine: { where: { deletedAt: null } } } })
  if (q?.mezzanine) return q.mezzanine

  const computed = await computeJobQuantities(jobId)
  if (!computed?.mezzanine) return null

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, mezzanine: { create: computed.mezzanine as any } } as any,
    update: { deletedAt: null, mezzanine: { upsert: { create: computed.mezzanine as any, update: { ...computed.mezzanine as any, deletedAt: null } } } } as any,
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
    data: { deletedAt: null, mezzanine: { upsert: { create: mergedData as any, update: { ...mergedData as any, deletedAt: null } } } } as any,
    include: { mezzanine: true },
  })
  return result.mezzanine
}

/** Deletes the mezzanine section. Throws P2025 if the parent quantity or section is not found. */
export async function deleteQuantityMezzanine(jobId: string) {
  const q = await prisma.quantity.findFirst({ where: { jobId, deletedAt: null }, select: { id: true } })
  if (!q) throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return prisma.quantityMezzanine.update({ where: { quantityId: q.id }, data: { deletedAt: new Date() } })
}

/** Paginated list of mezzanine sections for jobs owned by userId. */
export async function getQuantityMezzanines(userId: string, page: number, pageSize: number) {
  const where = { quantity: { job: { userId }, deletedAt: null }, deletedAt: null }
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
