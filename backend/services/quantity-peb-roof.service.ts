import { prisma } from '../lib/prisma.js'
import type { CreateQuantityPebRoofInput, UpdateQuantityPebRoofInput } from '../schemas/quantity.schema.js'
import { computeJobQuantities } from './quantity-calc.helper.js'

/** Upserts the pebRoof section for a job, calculating authoritative defaults server-side. */
export async function upsertQuantityPebRoof(jobId: string, data: CreateQuantityPebRoofInput) {
  const computed = await computeJobQuantities(jobId)
  const mergedData = { ...computed?.pebRoof, ...data }

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, pebRoof: { create: mergedData as any } } as any,
    update: { deletedAt: null, pebRoof: { upsert: { create: mergedData as any, update: { ...mergedData as any, deletedAt: null } } } } as any,
    include: { pebRoof: true },
  })
  return result.pebRoof
}

/** Returns the pebRoof section for a job, calculating defaults server-side if not yet persisted. */
export async function getQuantityPebRoofByJobId(jobId: string) {
  const q = await prisma.quantity.findFirst({ where: { jobId, deletedAt: null }, include: { pebRoof: { where: { deletedAt: null } } } })
  if (q?.pebRoof) return q.pebRoof

  const computed = await computeJobQuantities(jobId)
  if (!computed?.pebRoof) return null

  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, pebRoof: { create: computed.pebRoof as any } } as any,
    update: { deletedAt: null, pebRoof: { upsert: { create: computed.pebRoof as any, update: { ...computed.pebRoof as any, deletedAt: null } } } } as any,
    include: { pebRoof: true },
  })
  return result.pebRoof
}

/** Updates the pebRoof section. Throws P2025 if the parent quantity is not found. */
export async function updateQuantityPebRoof(jobId: string, data: UpdateQuantityPebRoofInput) {
  const computed = await computeJobQuantities(jobId)
  const mergedData = { ...computed?.pebRoof, ...data }

  const result = await prisma.quantity.update({
    where: { jobId },
    data: { deletedAt: null, pebRoof: { upsert: { create: mergedData as any, update: { ...mergedData as any, deletedAt: null } } } } as any,
    include: { pebRoof: true },
  })
  return result.pebRoof
}

/** Deletes the pebRoof section. Throws P2025 if the parent quantity or section is not found. */
export async function deleteQuantityPebRoof(jobId: string) {
  const q = await prisma.quantity.findFirst({ where: { jobId, deletedAt: null }, select: { id: true } })
  if (!q) throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return prisma.quantityPebRoof.update({ where: { quantityId: q.id }, data: { deletedAt: new Date() } })
}

/** Paginated list of pebRoof sections for jobs owned by userId. */
export async function getQuantityPebRoofs(userId: string, page: number, pageSize: number) {
  const where = { quantity: { job: { userId }, deletedAt: null }, deletedAt: null }
  const [data, total] = await Promise.all([
    prisma.quantityPebRoof.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { quantity: { createdAt: 'desc' } },
    }),
    prisma.quantityPebRoof.count({ where }),
  ])
  return { data, total, page, pageSize }
}
