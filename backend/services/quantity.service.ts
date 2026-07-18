/**
 * Quantity service — encapsulates database operations for the Quantity model.
 * A Quantity is the calculated bill-of-quantities output for a job: one
 * container plus seven optional one-to-one sections (pebRoof, cladding,
 * canopy, accessories, mezzanine, stair, additionalBolts). Each provided
 * section is replaced wholesale via a nested `upsert`; omitted sections are
 * left untouched so partial/draft saves compose.
 */
import { prisma } from '../lib/prisma.js'
import { Prisma } from '../generated/prisma/client.js'
import type { CreateQuantityInput, UpdateQuantityInput } from '../schemas/quantity.schema.js'

/** The seven one-to-one section relations, keyed by their payload field. */
const SECTIONS = [
  'pebRoof', 'cladding', 'canopy', 'accessories', 'mezzanine', 'stair', 'additionalBolts',
] as const

/** Always load every section so the response is complete. */
const includeSections = {
  pebRoof: true, cladding: true, canopy: true, accessories: true,
  mezzanine: true, stair: true, additionalBolts: true,
} satisfies Prisma.QuantityInclude

/** Builds nested `{ create }` blocks for the sections present on a parent create. */
function buildCreateSections(data: CreateQuantityInput) {
  const nested: Record<string, { create: Record<string, unknown> }> = {}
  for (const key of SECTIONS) {
    const section = data[key]
    if (section !== undefined) nested[key] = { create: section }
  }
  return nested
}

/** Builds nested `{ upsert }` blocks so each provided section is replaced wholesale. */
function buildUpsertSections(data: UpdateQuantityInput) {
  const nested: Record<string, { upsert: { create: Record<string, unknown>; update: Record<string, unknown> } }> = {}
  for (const key of SECTIONS) {
    const section = data[key]
    if (section !== undefined) nested[key] = { upsert: { create: section, update: section } }
  }
  return nested
}

/** Creates or updates the Quantity for a job. Provided sections are replaced wholesale. */
export function upsertQuantity(jobId: string, data: CreateQuantityInput) {
  return prisma.quantity.upsert({
    where: { jobId },
    create: { jobId, ...buildCreateSections(data) } as Prisma.QuantityUncheckedCreateInput,
    update: buildUpsertSections(data) as Prisma.QuantityUpdateInput,
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

/** Finds a quantity by its associated job ID. Returns null if not found. */
export function getQuantityByJobId(jobId: string) {
  return prisma.quantity.findUnique({ where: { jobId }, include: includeSections })
}

/** Updates a quantity by job ID. Replaces each provided section wholesale. Throws P2025 if not found. */
export function updateQuantity(jobId: string, data: UpdateQuantityInput) {
  return prisma.quantity.update({
    where: { jobId },
    data: buildUpsertSections(data) as Prisma.QuantityUpdateInput,
    include: includeSections,
  })
}

/** Deletes a quantity by its associated job ID. Throws P2025 if not found. */
export function deleteQuantity(jobId: string) {
  return prisma.quantity.delete({ where: { jobId } })
}
