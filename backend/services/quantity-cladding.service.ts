import { prisma } from '../lib/prisma.js'
import type { CreateQuantityCladdingInput, UpdateQuantityCladdingInput } from '../schemas/quantity.schema.js'
import { computeJobQuantities } from './quantity-calc.helper.js'

/** Upserts the cladding section for a job, calculating authoritative defaults server-side. */
export async function upsertQuantityCladding(jobId: string, data: CreateQuantityCladdingInput) {
  const computed = await computeJobQuantities(jobId)
  const mergedData = { ...computed?.cladding, ...data }

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, cladding: { create: mergedData as any } } as any,
    update: { deletedAt: null, cladding: { upsert: { create: mergedData as any, update: { ...mergedData as any, deletedAt: null } } } } as any,
    include: { cladding: true },
  })
  return result.cladding
}

/** Returns the cladding section for a job, calculating defaults server-side if not yet persisted. */
export async function getQuantityCladdingByJobId(jobId: string) {
  const q = await prisma.quantity.findFirst({ where: { jobId, deletedAt: null }, include: { cladding: { where: { deletedAt: null } } } })
  if (q?.cladding) return q.cladding

  const computed = await computeJobQuantities(jobId)
  if (!computed?.cladding) return null

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, cladding: { create: computed.cladding as any } } as any,
    update: { deletedAt: null, cladding: { upsert: { create: computed.cladding as any, update: { ...computed.cladding as any, deletedAt: null } } } } as any,
    include: { cladding: true },
  })
  return result.cladding
}

/** Updates the cladding section. Throws P2025 if the parent quantity is not found. */
export async function updateQuantityCladding(jobId: string, data: UpdateQuantityCladdingInput) {
  const computed = await computeJobQuantities(jobId)
  const mergedData = { ...computed?.cladding, ...data }

  const result = await prisma.quantity.update({
    where: { jobId },
    data: { deletedAt: null, cladding: { upsert: { create: mergedData as any, update: { ...mergedData as any, deletedAt: null } } } } as any,
    include: { cladding: true },
  })
  return result.cladding
}

/** Deletes the cladding section. Throws P2025 if the parent quantity or section is not found. */
export async function deleteQuantityCladding(jobId: string) {
  const q = await prisma.quantity.findFirst({ where: { jobId, deletedAt: null }, select: { id: true } })
  if (!q) throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return prisma.quantityCladding.update({ where: { quantityId: q.id }, data: { deletedAt: new Date() } })
}

/** Paginated list of cladding sections for jobs owned by userId. */
export async function getQuantityCladdings(userId: string, page: number, pageSize: number) {
  const where = { quantity: { job: { userId }, deletedAt: null }, deletedAt: null }
  const [data, total] = await Promise.all([
    prisma.quantityCladding.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { quantity: { createdAt: 'desc' } },
    }),
    prisma.quantityCladding.count({ where }),
  ])
  return { data, total, page, pageSize }
}
