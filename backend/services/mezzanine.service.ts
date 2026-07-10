/**
 * Mezzanine service — encapsulates database operations for the Mezzanine model.
 * Handles inline floors and floor-extensions (replace-all strategy on upsert/update).
 */
import { prisma } from '../lib/prisma.js'
import type { CreateMezzanineInput } from '../schemas/mezzanine.schema.js'

/** Creates or updates a mezzanine for a given job. Floors and extensions are replaced entirely on update. */
export function upsertMezzanine(jobId: string, data: CreateMezzanineInput) {
  const { floors, extensions, ...rest } = data
  const floorData = floors ?? []
  const extensionData = extensions ?? []

  return prisma.mezzanine.upsert({
    where: { jobId },
    create: {
      jobId,
      ...rest,
      floors: { createMany: { data: floorData } },
      extensions: { createMany: { data: extensionData } },
    },
    update: {
      ...rest,
      floors: { deleteMany: {}, createMany: { data: floorData } },
      extensions: { deleteMany: {}, createMany: { data: extensionData } },
    },
    include: { floors: true, extensions: true },
  })
}

/** Returns a paginated list of the user's mezzanines ordered by most recent first. */
export async function getMezzanines(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.mezzanine.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include: { floors: true, extensions: true } }),
    prisma.mezzanine.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds a mezzanine by its associated job ID. Returns null if not found. */
export function getMezzanineByJobId(jobId: string) {
  return prisma.mezzanine.findUnique({ where: { jobId }, include: { floors: true, extensions: true } })
}

/** Updates a mezzanine by job ID. Replaces floors and/or extensions entirely if provided. */
export function updateMezzanine(jobId: string, data: Record<string, any>) {
  const { floors, extensions, ...rest } = data
  const updateData: any = { ...rest }

  if (floors !== undefined) {
    updateData.floors = { deleteMany: {}, createMany: { data: floors } }
  }
  if (extensions !== undefined) {
    updateData.extensions = { deleteMany: {}, createMany: { data: extensions } }
  }

  return prisma.mezzanine.update({ where: { jobId }, data: updateData, include: { floors: true, extensions: true } })
}

/** Deletes a mezzanine by its associated job ID. Throws if not found. */
export function deleteMezzanine(jobId: string) {
  return prisma.mezzanine.delete({ where: { jobId } })
}
