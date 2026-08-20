/**
 * Mezzanine service — encapsulates database operations for the Mezzanine model.
 * Handles inline floors and floor-extensions (replace-all strategy on upsert/update).
 */
import { prisma } from '../lib/prisma.js'
import type { CreateMezzanineInput } from '../schemas/mezzanine.schema.js'
import { replaceChildren } from './soft-delete.service.js'

export class InvalidMezzanineExtensionFloorError extends Error {
  constructor(invalidFloors: string[]) {
    super(`Extension floor must match a configured mezzanine floor: ${invalidFloors.join(', ')}`)
    this.name = 'InvalidMezzanineExtensionFloorError'
  }
}

function validateExtensionFloors(
  floors: Array<{ floor?: string | null }> | undefined,
  extensions: Array<{ floor?: string | null }> | undefined,
) {
  if (!extensions?.length) return

  const availableFloors = new Set((floors ?? []).map((row) => row.floor).filter(Boolean))
  const invalidFloors = [...new Set(
    extensions
      .map((row) => row.floor)
      .filter((floor): floor is string => Boolean(floor) && !availableFloors.has(floor)),
  )]

  if (invalidFloors.length > 0) throw new InvalidMezzanineExtensionFloorError(invalidFloors)
}

function mapMezzOutput(mezz: any) {
  if (!mezz) return mezz
  if (mezz.floors) {
    mezz.floors = mezz.floors.map((f: any) => ({ ...f, code: f.code }))
  }
  if (mezz.extensions) {
    mezz.extensions = mezz.extensions.map((e: any) => ({ ...e, code: e.code }))
  }
  return mezz
}

/** Creates or updates a mezzanine for a given job. Floors and extensions are replaced entirely on update. */
export async function upsertMezzanine(jobId: string, data: CreateMezzanineInput) {
  const { floors, extensions, ...rest } = data
  const floorData = floors?.map(f => ({ ...f, code: f.code as any })) ?? []
  const extensionData = extensions?.map(e => ({ ...e, code: e.code as any })) ?? []
  validateExtensionFloors(floors, extensions)

  const result = await prisma.$transaction(async (tx) => {
    // The active-row unique index is partial (`deletedAt IS NULL`), so Prisma's
    // `upsert` cannot use it as a PostgreSQL ON CONFLICT target. Resolve the
    // active row explicitly and use the primary key for updates instead.
    const existing = await tx.mezzanine.findFirst({ where: { jobId, deletedAt: null }, select: { id: true } })
    const mezz = existing
      ? await tx.mezzanine.update({ where: { id: existing.id }, data: { ...rest, deletedAt: null, deletedBy: null, deletionBatchId: null } })
      : await tx.mezzanine.create({ data: { jobId, ...rest } })
    await replaceChildren(tx, 'mezzanineFloor', 'mezzanineId', mezz.id, floorData)
    await replaceChildren(tx, 'mezzanineFloorExtension', 'mezzanineId', mezz.id, extensionData)
    return (await tx.mezzanine.findUnique({ where: { id: mezz.id }, include: { floors: { where: { deletedAt: null } }, extensions: { where: { deletedAt: null } } } })) ?? mezz
  })
  return mapMezzOutput(result)
}

/** Returns a paginated list of the user's mezzanines ordered by most recent first. */
export async function getMezzanines(userId: string, page: number, pageSize: number) {
  const where = { job: { userId } }
  const [data, total] = await Promise.all([
    prisma.mezzanine.findMany({ where: { ...where, deletedAt: null }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include: { floors: { where: { deletedAt: null } }, extensions: { where: { deletedAt: null } } } }),
    prisma.mezzanine.count({ where: { ...where, deletedAt: null } }),
  ])
  return { data: data.map(mapMezzOutput), total, page, pageSize }
}

/** Finds a mezzanine by its associated job ID. Returns null if not found. */
export async function getMezzanineByJobId(jobId: string) {
  const mezz = await prisma.mezzanine.findFirst({ where: { jobId, deletedAt: null }, include: { floors: { where: { deletedAt: null } }, extensions: { where: { deletedAt: null } } } })
  return mapMezzOutput(mezz)
}

/** Updates a mezzanine by job ID. Replaces floors and/or extensions entirely if provided. */
export async function updateMezzanine(jobId: string, data: Record<string, any>) {
  const { floors, extensions, ...rest } = data
  const updateData: any = { ...rest }

  let floorsForValidation = floors
  if (extensions !== undefined && floors === undefined) {
    const existing = await prisma.mezzanine.findFirst({ where: { jobId, deletedAt: null }, select: { floors: { where: { deletedAt: null }, select: { floor: true } } } })
    floorsForValidation = existing?.floors
  }
  validateExtensionFloors(floorsForValidation, extensions)

  if (floors !== undefined) {
  }
  if (extensions !== undefined) {
  }
  const result = await prisma.$transaction(async (tx) => {
    const mezz = await tx.mezzanine.update({ where: { jobId }, data: updateData })
    if (floors !== undefined) await replaceChildren(tx, 'mezzanineFloor', 'mezzanineId', mezz.id, floors.map((f: any) => ({ ...f, code: f.code as any })))
    if (extensions !== undefined) await replaceChildren(tx, 'mezzanineFloorExtension', 'mezzanineId', mezz.id, extensions.map((e: any) => ({ ...e, code: e.code as any })))
    return (await tx.mezzanine.findUnique({ where: { id: mezz.id }, include: { floors: { where: { deletedAt: null } }, extensions: { where: { deletedAt: null } } } })) ?? mezz
  })
  return mapMezzOutput(result)
}

/** Deletes a mezzanine by its associated job ID. Throws if not found. */
export function deleteMezzanine(jobId: string) {
  return prisma.mezzanine.update({ where: { jobId }, data: { deletedAt: new Date() } })
}
