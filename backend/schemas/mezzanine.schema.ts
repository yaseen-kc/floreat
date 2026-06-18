/**
 * Zod validation schemas for Mezzanine API request payloads.
 * Handles the Mezzanine container plus inline floors and floor-extensions arrays.
 */
import { z } from 'zod'

/** Valid mezzanine deck/slab construction types. */
const mezzanineTypeEnum = z.enum(['DECK_SHEET', 'FOLDED_PLATE', 'PANEL', 'BOARD', 'RCC_SLAB'])

/** Valid mezzanine floor levels (1st through 10th). */
const mezzanineFloorLevelEnum = z.enum([
  'FLOOR_1', 'FLOOR_2', 'FLOOR_3', 'FLOOR_4', 'FLOOR_5',
  'FLOOR_6', 'FLOOR_7', 'FLOOR_8', 'FLOOR_9', 'FLOOR_10',
])

/** Valid reference levels a mezzanine height is measured from. */
const mezzanineHeightFromEnum = z.enum(['GROUND', 'FIRST_FLOOR', 'FLOOR_2', 'FLOOR_3', 'FLOOR_4', 'FLOOR_5'])

/** Business code identifier for a floor, e.g. "MEZ-1". */
const mezzanineCode = z.string().regex(/^MEZ-[1-9][0-9]*$/, 'code must match MEZ-<n> (e.g. MEZ-1)')

/** Schema for an individual mezzanine floor — counts are required. */
export const mezzanineFloorSchema = z.object({
  code: mezzanineCode,
  floor: mezzanineFloorLevelEnum,
  type: mezzanineTypeEnum,
  heightFrom: mezzanineHeightFromEnum,

  // ── Dimensions ──
  thicknessMm: z.number().positive(),
  lengthM: z.number().positive(),
  widthM: z.number().positive(),
  heightM: z.number().positive(),
  materialConsumptionKgPerSqft: z.number().positive(),

  // ── Beams (required) ──
  beamsMidPrimary: z.number().int().nonnegative(),
  beamsEndPrimary: z.number().int().nonnegative(),
  beamsSecondary: z.number().int().nonnegative(),

  // ── Joints in beams (required) ──
  jointsMidPrimary: z.number().int().nonnegative(),
  jointsEndPrimary: z.number().int().nonnegative(),

  // ── Internal columns (required) ──
  internalColumnsMidPrimary: z.number().int().nonnegative(),
  internalColumnsEndPrimary: z.number().int().nonnegative(),
})

/** Schema for a mezzanine floor extension — counts are optional. */
export const mezzanineFloorExtensionSchema = z.object({
  type: mezzanineTypeEnum,
  heightFrom: mezzanineHeightFromEnum,
  typicalTo: mezzanineFloorLevelEnum,

  // ── Dimensions ──
  thicknessMm: z.number().positive(),
  lengthM: z.number().positive(),
  widthM: z.number().positive(),
  heightM: z.number().positive(),

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

/** Schema for pagination query params with sensible defaults. */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
})
