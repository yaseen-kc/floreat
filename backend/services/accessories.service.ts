/**
 * Accessories service — encapsulates database operations for the Accessories model.
 * Handles four inline line-item arrays (doors, windows, folded plates, openings)
 * using a replace-all strategy on upsert/update.
 */
import { prisma } from '../lib/prisma.js'
import { deriveAccessoryQuantities, deriveLineItemQuantity } from '@floreat/shared/calc'
import type { CreateAccessoriesInput } from '../schemas/accessories.schema.js'

/** The six server-derived quantity columns, mapped to `null` when the calc can't produce a value. */
type DerivedQuantities = {
  gutterQuantity: number | null
  downTakeQuantity: number | null
  dripTrimQuantity: number | null
  gableEndFlashingQuantity: number | null
  cornerFlashQuantity: number | null
  ridgeQuantity: number | null
}

/** All six quantities as `null` — used when a job has no roof to derive from. */
const NULL_QUANTITIES: DerivedQuantities = {
  gutterQuantity: null,
  downTakeQuantity: null,
  dripTrimQuantity: null,
  gableEndFlashingQuantity: null,
  cornerFlashQuantity: null,
  ridgeQuantity: null,
}

/** The six derived quantity column names. Each has a `${field}Manual` override flag. */
const QUANTITY_FIELDS = [
  'gutterQuantity',
  'downTakeQuantity',
  'dripTrimQuantity',
  'gableEndFlashingQuantity',
  'cornerFlashQuantity',
  'ridgeQuantity',
] as const

/**
 * Resolves the six quantity columns for a client WRITE (upsert/update). A field
 * flagged manual in the payload (`${field}Manual === true`) keeps the client's
 * own value (coerced to `null` when omitted); every other field is the
 * server-derived value. The `*Manual` flags themselves are persisted verbatim
 * from the payload's `rest`.
 *
 * ponytail: treats the write payload as authoritative for both the flag and the
 * value together (the frontend submits the full accessories form on save), so a
 * flag toggled manual without an accompanying value nulls the column. Upgrade
 * path: merge against the stored row here too if partial flag-only writes appear.
 */
function resolveWriteQuantities(derived: DerivedQuantities, input: Record<string, any>): DerivedQuantities {
  const out = {} as DerivedQuantities
  for (const field of QUANTITY_FIELDS) {
    out[field] = input[`${field}Manual`] === true ? (input[field] ?? null) : derived[field]
  }
  return out
}

/**
 * Derives the six accessory `*Quantity` values from the job's Roof (and its
 * FRONT/LEFT sidewalls) via `@floreat/shared/calc`. Returns every quantity as
 * `null` when the job has no roof, so a persisted-null overwrites any stale
 * client value. Individual quantities the calc can't compute (e.g. corner flash
 * without both sidewalls) are also mapped to `null`.
 */
export async function deriveQuantitiesFromRoof(jobId: string): Promise<DerivedQuantities> {
  const roof = await prisma.roof.findUnique({ where: { jobId }, include: { sidewalls: true } })
  if (!roof) return { ...NULL_QUANTITIES }

  // Prisma Decimal columns are `Decimal` objects server-side (they only become
  // strings over the wire) — coerce to plain numbers for the pure calc.
  const toNum = (v: unknown): number | undefined => (v == null ? undefined : Number(v))

  const front = roof.sidewalls.find((w) => w.side === 'FRONT')
  const left = roof.sidewalls.find((w) => w.side === 'LEFT')

  const q = deriveAccessoryQuantities({
    buildingOverallLength: toNum(roof.buildingOverallLength),
    buildingOverallWidth: toNum(roof.buildingOverallWidth),
    eaveHeight: toNum(roof.eaveHeight),
    roofSlope: toNum(roof.roofSlope),
    mainRoofFrames: toNum(roof.mainRoofFrames),
    endRoofFrames: toNum(roof.endRoofFrames),
    roofExtensionWidthHeight: toNum(roof.roofExtensionWidthHeight),
    claddingExtensionWidthHeight: toNum(roof.claddingExtensionWidthHeight),
    sideColumnsWidthHeight: toNum(roof.sideColumnsWidthHeight),
    frontSideWallHeight: toNum(front?.height),
    leftSideWallHeight: toNum(left?.height),
  })

  return {
    gutterQuantity: q.gutterQuantity ?? null,
    downTakeQuantity: q.downTakeQuantity ?? null,
    dripTrimQuantity: q.dripTrimQuantity ?? null,
    gableEndFlashingQuantity: q.gableEndFlashingQuantity ?? null,
    cornerFlashQuantity: q.cornerFlashQuantity ?? null,
    ridgeQuantity: q.ridgeQuantity ?? null,
  }
}

/**
 * Per-item line-item `quantity` is server-authoritative (advisory client value
 * ignored): each is derived as two dimensions × `nos` via `deriveLineItemQuantity`
 * (@floreat/shared/calc), mapped to `null` when any input is blank.
 * Doors & windows use height × width; openings & folded plates use length × width.
 */

/** Creates or updates accessories for a given job. Line-item arrays are replaced entirely on update. */
export async function upsertAccessories(jobId: string, data: CreateAccessoriesInput) {
  const { ...rest } = data
  // Quantity fields are server-derived by default: overwrite whatever the client
  // sent with values from the job's roof — except any field flagged manual, whose
  // client value is trusted and kept as-is.
  const derived = await deriveQuantitiesFromRoof(jobId)
  const scalars = {
    ...rest,
    ...resolveWriteQuantities(derived, rest),
    rollingShutterQuantity: deriveLineItemQuantity(rest.rollingShutterLength, rest.rollingShutterWidth, rest.rollingShutterNos) ?? null,
    louverQuantity: deriveLineItemQuantity(rest.louverLength, rest.louverWidth, rest.louverNos) ?? null,
    skyLightQuantity: deriveLineItemQuantity(rest.skyLightLength, rest.skyLightWidth, rest.skyLightNos) ?? null,
    wallLightQuantity: deriveLineItemQuantity(rest.wallLightLength, rest.wallLightWidth, rest.wallLightNos) ?? null,
    doorQuantity: deriveLineItemQuantity(rest.doorHeight, rest.doorWidth, rest.doorNos) ?? null,
    windowQuantity: deriveLineItemQuantity(rest.windowHeight, rest.windowWidth, rest.windowNos) ?? null,
    foldedPlateQuantity: deriveLineItemQuantity(rest.foldedPlateLength, rest.foldedPlateWidth, rest.foldedPlateNos) ?? null,
  }

  return prisma.accessories.upsert({
    where: { jobId },
    create: {
      jobId,
      ...scalars,
    },
    update: {
      ...scalars,
    },
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
    }),
    prisma.accessories.count({ where }),
  ])
  return { data, total, page, pageSize }
}

/** Finds accessories by their associated job ID. Returns null if not found. */
export function getAccessoriesByJobId(jobId: string) {
  return prisma.accessories.findUnique({
    where: { jobId },
  })
}

/** Updates accessories by job ID. Replaces each line-item array entirely if provided. */
export async function updateAccessories(jobId: string, data: Record<string, any>) {
  const { ...rest } = data
  const updateData: any = { ...rest }

  // Quantity fields are server-derived by default — recompute from the roof and
  // overwrite any client value on update, except fields flagged manual (whose
  // client value is kept as-is).
  const derived = await deriveQuantitiesFromRoof(jobId)
  Object.assign(updateData, resolveWriteQuantities(derived, rest))

  updateData.rollingShutterQuantity = deriveLineItemQuantity(updateData.rollingShutterLength ?? rest.rollingShutterLength, updateData.rollingShutterWidth ?? rest.rollingShutterWidth, updateData.rollingShutterNos ?? rest.rollingShutterNos) ?? null
  updateData.louverQuantity = deriveLineItemQuantity(updateData.louverLength ?? rest.louverLength, updateData.louverWidth ?? rest.louverWidth, updateData.louverNos ?? rest.louverNos) ?? null
  updateData.skyLightQuantity = deriveLineItemQuantity(updateData.skyLightLength ?? rest.skyLightLength, updateData.skyLightWidth ?? rest.skyLightWidth, updateData.skyLightNos ?? rest.skyLightNos) ?? null
  updateData.wallLightQuantity = deriveLineItemQuantity(updateData.wallLightLength ?? rest.wallLightLength, updateData.wallLightWidth ?? rest.wallLightWidth, updateData.wallLightNos ?? rest.wallLightNos) ?? null
  updateData.doorQuantity = deriveLineItemQuantity(updateData.doorHeight ?? rest.doorHeight, updateData.doorWidth ?? rest.doorWidth, updateData.doorNos ?? rest.doorNos) ?? null
  updateData.windowQuantity = deriveLineItemQuantity(updateData.windowHeight ?? rest.windowHeight, updateData.windowWidth ?? rest.windowWidth, updateData.windowNos ?? rest.windowNos) ?? null
  updateData.foldedPlateQuantity = deriveLineItemQuantity(updateData.foldedPlateLength ?? rest.foldedPlateLength, updateData.foldedPlateWidth ?? rest.foldedPlateWidth, updateData.foldedPlateNos ?? rest.foldedPlateNos) ?? null


  return prisma.accessories.update({
    where: { jobId },
    data: updateData,
  })
}

/**
 * Recomputes and persists the six derived `*Quantity` fields for a job's
 * accessories from its (just-changed) roof. No-ops when the job has no
 * Accessories row yet. Called by roof.service after a roof upsert/update so the
 * accessory quantities never go stale relative to the roof they depend on.
 *
 * Fields whose `${field}Manual` flag is set are user-overridden and left
 * untouched — only the server-derived (auto) fields are rewritten.
 */
export async function recomputeAccessoriesQuantities(jobId: string) {
  const existing = await prisma.accessories.findUnique({
    where: { jobId },
    select: {
      id: true,
      gutterQuantityManual: true,
      downTakeQuantityManual: true,
      dripTrimQuantityManual: true,
      gableEndFlashingQuantityManual: true,
      cornerFlashQuantityManual: true,
      ridgeQuantityManual: true,
    },
  })
  if (!existing) return
  const derived = await deriveQuantitiesFromRoof(jobId)

  // Only rewrite the auto (non-manual) columns; manual overrides stay put.
  const data: Partial<DerivedQuantities> = {}
  for (const field of QUANTITY_FIELDS) {
    if ((existing as Record<string, unknown>)[`${field}Manual`] !== true) {
      data[field] = derived[field]
    }
  }
  if (Object.keys(data).length === 0) return
  await prisma.accessories.update({ where: { jobId }, data })
}

/** Deletes accessories by their associated job ID. Throws P2025 if not found. */
export function deleteAccessories(jobId: string) {
  return prisma.accessories.delete({ where: { jobId } })
}
