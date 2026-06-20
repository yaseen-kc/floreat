/**
 * Stair service — encapsulates database operations for the Stair model.
 * Handles inline stairs and area-deductions (replace-all strategy on upsert/update).
 */
import { prisma } from '../lib/prisma.js'
import type { CreateStairInput } from '../schemas/stair.schema.js'

/** Creates or updates a stair for a given job. Stairs and deductions are replaced entirely on update. */
export function upsertStair(jobId: string, data: CreateStairInput) {
  const { stairs, areaDeductions, ...rest } = data
  const stairData = stairs ?? []
  const deductionData = areaDeductions ?? []

  return prisma.stair.upsert({
    where: { jobId },
    create: {
      jobId,
      ...rest,
      stairs: { createMany: { data: stairData } },
      areaDeductions: { createMany: { data: deductionData } },
    },
    update: {
      ...rest,
      stairs: { deleteMany: {}, createMany: { data: stairData } },
      areaDeductions: { deleteMany: {}, createMany: { data: deductionData } },
    },
    include: { stairs: true, areaDeductions: true },
  })
}

/** Returns a paginated list of stairs ordered by most recent first. */
export async function getStairs(page: number, pageSize: number) {
  const [data, total] = await Promise.all([
    prisma.stair.findMany({ skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include: { stairs: true, areaDeductions: true } }),
    prisma.stair.count(),
  ])
  return { data, total, page, pageSize }
}

/** Finds a stair by its associated job ID. Returns null if not found. */
export function getStairByJobId(jobId: string) {
  return prisma.stair.findUnique({ where: { jobId }, include: { stairs: true, areaDeductions: true } })
}

/** Updates a stair by job ID. Replaces stairs and/or deductions entirely if provided. */
export function updateStair(jobId: string, data: Record<string, any>) {
  const { stairs, areaDeductions, ...rest } = data
  const updateData: any = { ...rest }

  if (stairs !== undefined) {
    updateData.stairs = { deleteMany: {}, createMany: { data: stairs } }
  }
  if (areaDeductions !== undefined) {
    updateData.areaDeductions = { deleteMany: {}, createMany: { data: areaDeductions } }
  }

  return prisma.stair.update({ where: { jobId }, data: updateData, include: { stairs: true, areaDeductions: true } })
}

/** Deletes a stair by its associated job ID. Throws if not found. */
export function deleteStair(jobId: string) {
  return prisma.stair.delete({ where: { jobId } })
}
