/**
 * Canonical Mezzanine request contract shared by the Floreat frontend and
 * backend. A Mezzanine is the container plus inline `floors[]` and
 * `extensions[]` arrays; every field is optional (partial drafts allowed).
 */
import { z } from 'zod'

/** Valid mezzanine deck/slab construction types. */
export const mezzanineTypeEnum = z.enum(['DECK_SHEET', 'FOLDED_PLATE', 'PANEL', 'BOARD', 'RCC_SLAB'])

/** Valid mezzanine floor levels (1st through 10th). */
export const mezzanineFloorLevelEnum = z.enum([
  'FLOOR_1', 'FLOOR_2', 'FLOOR_3', 'FLOOR_4', 'FLOOR_5',
  'FLOOR_6', 'FLOOR_7', 'FLOOR_8', 'FLOOR_9', 'FLOOR_10',
])

/** Valid reference levels a mezzanine height is measured from. */
export const mezzanineHeightFromEnum = z.enum(['GROUND', 'FIRST_FLOOR', 'FLOOR_2', 'FLOOR_3', 'FLOOR_4', 'FLOOR_5'])

/** Business code identifier for a floor, e.g. "MEZ-1" to "MEZ-12". */
export const mezzanineFloorCodeEnum = z.enum([
  'MEZ-1', 'MEZ-2', 'MEZ-3', 'MEZ-4', 'MEZ-5', 'MEZ-6',
  'MEZ-7', 'MEZ-8', 'MEZ-9', 'MEZ-10', 'MEZ-11', 'MEZ-12'
])
export const mezzanineCode = mezzanineFloorCodeEnum

/** Schema for an individual mezzanine floor — all fields optional. */
export const mezzanineFloorSchema = z.object({
  code: mezzanineCode.optional(),
  floor: mezzanineFloorLevelEnum.optional(),
  type: mezzanineTypeEnum.optional(),
  heightFrom: mezzanineHeightFromEnum.optional(),

  // ── Dimensions ──
  thicknessMm: z.number().positive().optional(),
  lengthM: z.number().positive().optional(),
  widthM: z.number().positive().optional(),
  heightM: z.number().positive().optional(),
  materialConsumptionKgPerSqft: z.number().positive().optional(),

  // ── Beams ──
  beamsMidPrimary: z.number().int().nonnegative().optional(),
  beamsEndPrimary: z.number().int().nonnegative().optional(),
  beamsSecondary: z.number().int().nonnegative().optional(),

  // ── Joints in beams ──
  jointsMidPrimary: z.number().int().nonnegative().optional(),
  jointsEndPrimary: z.number().int().nonnegative().optional(),

  // ── Internal columns ──
  internalColumnsMidPrimary: z.number().int().nonnegative().optional(),
  internalColumnsEndPrimary: z.number().int().nonnegative().optional(),
})

/** Schema for a mezzanine floor extension — all fields optional. */
export const mezzanineFloorExtensionSchema = z.object({
  type: mezzanineTypeEnum.optional(),
  heightFrom: mezzanineHeightFromEnum.optional(),
  typicalTo: mezzanineFloorLevelEnum.optional(),

  // ── Dimensions ──
  thicknessMm: z.number().positive().optional(),
  lengthM: z.number().positive().optional(),
  widthM: z.number().positive().optional(),
  heightM: z.number().positive().optional(),

  // ── Beams (optional) ──
  beamsMidPrimary: z.number().int().nonnegative().optional(),
  beamsEndPrimary: z.number().int().nonnegative().optional(),
  beamsSecondary: z.number().int().nonnegative().optional(),

  // ── Joints in beams (optional) ──
  jointsMidPrimary: z.number().int().nonnegative().optional(),
  jointsEndPrimary: z.number().int().nonnegative().optional(),

  // ── Extended columns (optional) ──
  extendedColumnsMidPrimary: z.number().int().nonnegative().optional(),
  extendedColumnsEndPrimary: z.number().int().nonnegative().optional(),
})

/** Schema for creating/upserting a mezzanine — inline floors and extensions. */
export const createMezzanineSchema = z.object({
  floors: z.array(mezzanineFloorSchema).optional(),
  extensions: z.array(mezzanineFloorExtensionSchema).optional(),
})

/** Schema for updating a mezzanine — all fields optional (partial update). */
export const updateMezzanineSchema = createMezzanineSchema.partial()

/** Validated payload for creating/upserting a mezzanine. */
export type CreateMezzanineInput = z.infer<typeof createMezzanineSchema>

/** Validated payload for updating a mezzanine (all fields optional). */
export type UpdateMezzanineInput = z.infer<typeof updateMezzanineSchema>
