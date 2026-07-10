/**
 * Accessories service — encapsulates database operations for the Accessories model.
 * Handles four inline line-item arrays (doors, windows, folded plates, openings)
 * using a replace-all strategy on upsert/update.
 */
import { prisma } from '../lib/prisma.js'
import type { CreateAccessoriesInput } from '../schemas/accessories.schema.js'

/** Creates or updates accessories for a given job. Line-item arrays are replaced entirely on update. */
export function upsertAccessories(jobId: string, data: CreateAccessoriesInput) {
  const { doors, windows, foldedPlates, openings, ...rest } = data
  const doorData = doors ?? []
  const windowData = windows ?? []
  const foldedPlateData = foldedPlates ?? []
  const openingData = openings ?? []

  return prisma.accessories.upsert({
    where: { jobId },
    create: {
      jobId,
      ...rest,
      doors: { createMany: { data: doorData } },
      windows: { createMany: { data: windowData } },
      foldedPlates: { createMany: { data: foldedPlateData } },
      openings: { createMany: { data: openingData } },
    },
    update: {
      ...rest,
      doors: { deleteMany: {}, createMany: { data: doorData } },
      windows: { deleteMany: {}, createMany: { data: windowData } },
      foldedPlates: { deleteMany: {}, createMany: { data: foldedPlateData } },
      openings: { deleteMany: {}, createMany: { data: openingData } },
    },
    include: { doors: true, windows: true, foldedPlates: true, openings: true },
  })
}

/** Returns a paginated list of the user's accessories ordered by most recent first. */
export async function getAccessories(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.accessories.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: { doors: true, windows: true, foldedPlates: true, openings: true },
    }),
    prisma.accessories.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds accessories by their associated job ID. Returns null if not found. */
export function getAccessoriesByJobId(jobId: string) {
  return prisma.accessories.findUnique({
    where: { jobId },
    include: { doors: true, windows: true, foldedPlates: true, openings: true },
  })
}

/** Updates accessories by job ID. Replaces each line-item array entirely if provided. */
export function updateAccessories(jobId: string, data: Record<string, any>) {
  const { doors, windows, foldedPlates, openings, ...rest } = data
  const updateData: any = { ...rest }

  if (doors !== undefined) {
    updateData.doors = { deleteMany: {}, createMany: { data: doors } }
  }
  if (windows !== undefined) {
    updateData.windows = { deleteMany: {}, createMany: { data: windows } }
  }
  if (foldedPlates !== undefined) {
    updateData.foldedPlates = { deleteMany: {}, createMany: { data: foldedPlates } }
  }
  if (openings !== undefined) {
    updateData.openings = { deleteMany: {}, createMany: { data: openings } }
  }

  return prisma.accessories.update({
    where: { jobId },
    data: updateData,
    include: { doors: true, windows: true, foldedPlates: true, openings: true },
  })
}

/** Deletes accessories by their associated job ID. Throws P2025 if not found. */
export function deleteAccessories(jobId: string) {
  return prisma.accessories.delete({ where: { jobId } })
}
