/**
 * Quantity service — encapsulates database operations for the Quantity model.
 * Server-authoritative quantity calculations are generated via `computeJobQuantities`
 * from database job inputs and merged with user-provided overrides.
 */
import { prisma } from '../lib/prisma.js'
import { Prisma } from '../generated/prisma/client.js'
import type { CreateQuantityInput, UpdateQuantityInput } from '../schemas/quantity.schema.js'
import { computeJobQuantities } from './quantity-calc.helper.js'

const SECTIONS = [
  'pebRoof', 'cladding', 'canopy', 'accessories', 'mezzanine', 'stair', 'additionalBolts',
] as const

const includeSections = {
  pebRoof: true, cladding: true, canopy: true, accessories: true,
  mezzanine: true, stair: true, additionalBolts: true,
} satisfies Prisma.QuantityInclude

function mergeSectionData(computed: Record<string, any> | null, data: CreateQuantityInput | UpdateQuantityInput) {
  const merged: Record<string, any> = {}
  for (const key of SECTIONS) {
    const computedSec = computed?.[key]
    const dataSec = data[key]
    if (computedSec || dataSec) {
      merged[key] = { ...(computedSec ?? {}), ...(dataSec ?? {}) }
    }
  }
  return merged
}

function buildCreateSections(merged: Record<string, any>) {
  const nested: Record<string, { create: Record<string, unknown> }> = {}
  for (const key of SECTIONS) {
    const section = merged[key]
    if (section !== undefined) nested[key] = { create: section }
  }
  return nested
}

function buildUpsertSections(merged: Record<string, any>) {
  const nested: Record<string, { upsert: { create: Record<string, unknown>; update: Record<string, unknown> } }> = {}
  for (const key of SECTIONS) {
    const section = merged[key]
    if (section !== undefined) nested[key] = { upsert: { create: section, update: section } }
  }
  return nested
}

/** Creates or updates the Quantity for a job, calculating server-side defaults. */
export async function upsertQuantity(jobId: string, data: CreateQuantityInput) {
  const computed = await computeJobQuantities(jobId)
  const merged = mergeSectionData(computed, data)

  return prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, ...buildCreateSections(merged) } as Prisma.QuantityUncheckedCreateInput,
    update: buildUpsertSections(merged) as Prisma.QuantityUpdateInput,
    include: includeSections,
  })
}

/** Returns a paginated list of the user's quantities ordered by most recent first. */
export async function getQuantities(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.quantity.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include: includeSections }),
    prisma.quantity.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds a quantity by its associated job ID. Calculates & provisions defaults server-side if absent. */
export async function getQuantityByJobId(jobId: string) {
  const q = await prisma.quantity.findUnique({ where: { jobId }, include: includeSections })
  if (q) return q

  const computed = await computeJobQuantities(jobId)
  if (!computed) return null

  const merged = mergeSectionData(computed, {})
  return prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, ...buildCreateSections(merged) } as Prisma.QuantityUncheckedCreateInput,
    update: buildUpsertSections(merged) as Prisma.QuantityUpdateInput,
    include: includeSections,
  })
}

/** Updates a quantity by job ID. Replaces each provided section wholesale. Throws P2025 if not found. */
export async function updateQuantity(jobId: string, data: UpdateQuantityInput) {
  const computed = await computeJobQuantities(jobId)
  const merged = mergeSectionData(computed, data)

  return prisma.quantity.update({
    where: { jobId },
    data: buildUpsertSections(merged) as Prisma.QuantityUpdateInput,
    include: includeSections,
  })
}

/** Deletes a quantity by its associated job ID. Throws P2025 if not found. */
export function deleteQuantity(jobId: string) {
  return prisma.quantity.delete({ where: { jobId } })
}
