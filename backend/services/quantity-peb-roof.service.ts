import { prisma } from '../lib/prisma.js'
import type { CreateQuantityPebRoofInput, UpdateQuantityPebRoofInput } from '../schemas/quantity.schema.js'

/** Upserts the pebRoof section for a job, creating the parent Quantity if needed. */
export async function upsertQuantityPebRoof(jobId: string, data: CreateQuantityPebRoofInput) {
  const result = await prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, pebRoof: { create: data } } as any,
    update: { pebRoof: { upsert: { create: data, update: data } } },
    include: { pebRoof: true },
  })
  return result.pebRoof
}

/** Returns the pebRoof section for a job, or null. */
export async function getQuantityPebRoofByJobId(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, include: { pebRoof: true } })
  return q?.pebRoof ?? null
}

/** Updates the pebRoof section. Throws P2025 if the parent quantity is not found. */
export async function updateQuantityPebRoof(jobId: string, data: UpdateQuantityPebRoofInput) {
  const result = await prisma.quantity.update({
    where: { jobId },
    data: { pebRoof: { upsert: { create: data, update: data } } },
    include: { pebRoof: true },
  })
  return result.pebRoof
}

/** Deletes the pebRoof section. Throws P2025 if the parent quantity or section is not found. */
export async function deleteQuantityPebRoof(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, select: { id: true } })
  if (!q) throw Object.assign(new Error('Not found'), { code: 'P2025' })
  return prisma.quantityPebRoof.delete({ where: { quantityId: q.id } })
}

/** Paginated list of pebRoof sections for jobs owned by userId. */
export async function getQuantityPebRoofs(userId: string, page: number, pageSize: number) {
  const where = { quantity: { job: { userId } } }
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
