import { prisma } from '../lib/prisma.js'
import type { CreateSpecInput, UpdateSpecInput } from '../schemas/spec.schema.js'

type SpecCreateData = Parameters<typeof prisma.spec.create>[0]['data']
type SpecUpdateData = Parameters<typeof prisma.spec.update>[0]['data']

/** Creates a global product specification. */
export function createSpec(data: CreateSpecInput) {
  return prisma.spec.create({ data: data as SpecCreateData })
}

/** Returns a paginated global specification list ordered by newest first. */
export async function getSpecs(page: number, pageSize: number) {
  const [data, total] = await Promise.all([
    prisma.spec.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.spec.count(),
  ])
  return { data, total, page, pageSize }
}

/** Finds a global product specification by ID, returning null when absent. */
export function getSpecById(id: string) {
  return prisma.spec.findUnique({ where: { id } })
}

/** Partially updates a global product specification; throws P2025 when absent. */
export function updateSpec(id: string, data: UpdateSpecInput) {
  return prisma.spec.update({ where: { id }, data: data as SpecUpdateData })
}

/** Deletes a global product specification; throws P2025 when absent. */
export function deleteSpec(id: string) {
  return prisma.spec.delete({ where: { id } })
}
