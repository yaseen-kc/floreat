/**
 * Stair service — encapsulates database operations for the Stair model.
 * Handles inline stairs and area-deductions (replace-all strategy on upsert/update).
 */
import { prisma } from '../lib/prisma.js'
import type { CreateStairInput } from '../schemas/stair.schema.js'
import { replaceChildren, upsertActiveRow } from './soft-delete.service.js'

/** Creates or updates a stair for a given job. Stairs and deductions are replaced entirely on update. */
export async function upsertStair(jobId: string, data: CreateStairInput) {
  const { stairs, areaDeductions, ...rest } = data
  const stairData = stairs ?? []
  const deductionData = areaDeductions ?? []

  return prisma.$transaction(async (tx) => {
    const stair = await upsertActiveRow(tx, 'stair', 'jobId', jobId, { jobId, ...rest }, { ...rest, deletedAt: null, deletedBy: null, deletionBatchId: null })
    await replaceChildren(tx, 'stairItem', 'stairId', stair.id, stairData)
    await replaceChildren(tx, 'areaDeduction', 'stairId', stair.id, deductionData)
    return (await tx.stair.findUnique({ where: { id: stair.id }, include: { stairs: { where: { deletedAt: null } }, areaDeductions: { where: { deletedAt: null } } } })) ?? stair
  })
}

/** Returns a paginated list of the user's stairs ordered by most recent first. */
export async function getStairs(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.stair.findMany({ where: { ...where, deletedAt: null }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include: { stairs: { where: { deletedAt: null } }, areaDeductions: { where: { deletedAt: null } } } }),
    prisma.stair.count({ where: { ...where, deletedAt: null } }),
  ])
  return { data, total, page, pageSize }
}

/** Finds a stair by its associated job ID. Returns null if not found. */
export function getStairByJobId(jobId: string) {
  return prisma.stair.findFirst({ where: { jobId, deletedAt: null }, include: { stairs: { where: { deletedAt: null } }, areaDeductions: { where: { deletedAt: null } } } })
}

/** Updates a stair by job ID. Replaces stairs and/or deductions entirely if provided. */
export function updateStair(jobId: string, data: Record<string, any>) {
  const { stairs, areaDeductions, ...rest } = data
  const updateData: any = { ...rest }

  if (stairs !== undefined) {
  }
  if (areaDeductions !== undefined) {
  }
  return prisma.$transaction(async (tx) => {
    const stair = await tx.stair.update({ where: { jobId }, data: updateData })
    if (stairs !== undefined) await replaceChildren(tx, 'stairItem', 'stairId', stair.id, stairs)
    if (areaDeductions !== undefined) await replaceChildren(tx, 'areaDeduction', 'stairId', stair.id, areaDeductions)
    return (await tx.stair.findUnique({ where: { id: stair.id }, include: { stairs: { where: { deletedAt: null } }, areaDeductions: { where: { deletedAt: null } } } })) ?? stair
  })
}

/** Deletes a stair by its associated job ID. Throws if not found. */
export function deleteStair(jobId: string) {
  return prisma.stair.update({ where: { jobId }, data: { deletedAt: new Date() } })
}
