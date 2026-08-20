/**
 * Quantity service — encapsulates database operations for the Quantity model.
 * Server-authoritative quantity calculations are generated via `computeJobQuantities`
 * from database job inputs and merged with user-provided overrides.
 */
import { prisma } from '../lib/prisma.js'
import { Prisma } from '../generated/prisma/client.js'
import type { CreateQuantityInput, UpdateQuantityInput } from '../schemas/quantity.schema.js'
import { computeJobQuantities } from './quantity-calc.helper.js'
import { upsertAmount } from './amount.service.js'
import { upsertActiveRow } from './soft-delete.service.js'

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
      // Server calculations provide baseline defaults, and client-supplied values (manual input fields & overrides) take precedence
      const cleanDataSec = dataSec ? Object.fromEntries(Object.entries(dataSec).filter(([, v]) => v !== undefined)) : {}
      merged[key] = { ...(computedSec ?? {}), ...cleanDataSec }
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

const SECTION_MODELS: Record<string, string> = {
  pebRoof: 'quantityPebRoof',
  cladding: 'quantityCladding',
  canopy: 'quantityCanopy',
  accessories: 'quantityAccessories',
  mezzanine: 'quantityMezzanine',
  stair: 'quantityStair',
  additionalBolts: 'quantityAdditionalBolts',
}

/** Creates or updates the Quantity for a job, calculating server-side defaults. */
export async function upsertQuantity(jobId: string, data: CreateQuantityInput) {
  const computed = await computeJobQuantities(jobId)
  const merged = mergeSectionData(computed, data)

  const result = await prisma.$transaction(async (tx) => {
    const fields = { calculationVersion: 'quantity-v1', sourceUpdatedAt: new Date(), rateVersion: 1, isStale: false }
    const quantity = await upsertActiveRow(
      tx,
      'quantity',
      'jobId',
      jobId,
      { jobId, ...fields } as Prisma.QuantityUncheckedCreateInput,
      { ...fields, deletedAt: null, deletedBy: null, deletionBatchId: null } as Prisma.QuantityUpdateInput,
    )
    for (const key of SECTIONS) {
      const section = merged[key]
      if (section !== undefined) {
        await upsertActiveRow(tx, SECTION_MODELS[key], 'quantityId', quantity.id, { quantityId: quantity.id, ...section }, section)
      }
    }
    return tx.quantity.findUnique({ where: { id: quantity.id }, include: includeSections })
  })
  await upsertAmount(jobId, {} as any)
  return result
}

/** Returns a paginated list of the user's quantities ordered by most recent first. */
export async function getQuantities(userId: string, page: number, pageSize: number) {
  const where = { job: { userId }, deletedAt: null }
  const [data, total] = await Promise.all([
    prisma.quantity.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include: { pebRoof: { where: { deletedAt: null } }, cladding: { where: { deletedAt: null } }, canopy: { where: { deletedAt: null } }, accessories: { where: { deletedAt: null } }, mezzanine: { where: { deletedAt: null } }, stair: { where: { deletedAt: null } }, additionalBolts: { where: { deletedAt: null } } } }),
    prisma.quantity.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds a quantity by its associated job ID without creating rows on GET. */
export async function getQuantityByJobId(jobId: string) {
  const q = await prisma.quantity.findFirst({ where: { jobId, deletedAt: null }, include: { pebRoof: { where: { deletedAt: null } }, cladding: { where: { deletedAt: null } }, canopy: { where: { deletedAt: null } }, accessories: { where: { deletedAt: null } }, mezzanine: { where: { deletedAt: null } }, stair: { where: { deletedAt: null } }, additionalBolts: { where: { deletedAt: null } } } })
  return q
}

/** Updates a quantity by job ID. Replaces each provided section wholesale. Throws P2025 if not found. */
export async function updateQuantity(jobId: string, data: UpdateQuantityInput) {
  const computed = await computeJobQuantities(jobId)
  const merged = mergeSectionData(computed, data)

  const result = await prisma.$transaction(async (tx) => {
    const quantity = await tx.quantity.findFirst({ where: { jobId, deletedAt: null }, select: { id: true } })
    if (!quantity) throw Object.assign(new Error('Quantity not found'), { code: 'P2025' })
    const updated = await tx.quantity.update({
      where: { id: quantity.id },
      data: { calculationVersion: 'quantity-v1', sourceUpdatedAt: new Date(), rateVersion: 1, isStale: false },
    })
    for (const key of SECTIONS) {
      const section = merged[key]
      if (section !== undefined) {
        await upsertActiveRow(tx, SECTION_MODELS[key], 'quantityId', updated.id, { quantityId: updated.id, ...section }, section)
      }
    }
    return tx.quantity.findUnique({ where: { id: updated.id }, include: includeSections })
  })
  await upsertAmount(jobId, {} as any)
  return result
}

/** Deletes a quantity by its associated job ID. Throws P2025 if not found. */
export function deleteQuantity(jobId: string) {
  return prisma.quantity.update({ where: { jobId }, data: { deletedAt: new Date() } })
}
