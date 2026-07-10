/**
 * Zod validation schemas for Canopy API request payloads.
 * Handles the Canopy container plus the inline canopies array.
 */
import { z } from 'zod'

/** Valid floor levels a canopy starts from. */
const canopyHeightFromEnum = z.enum(['GROUND', 'FF', 'SF', 'FLOOR_3', 'FLOOR_4', 'FLOOR_5'])

/** Valid canopy sheet covering types. */
const canopySheetTypeEnum = z.enum(['NCGL', 'PPGL', 'PUFF', 'OTHER'])

/** Business code identifier for a canopy, e.g. "CANOPY-1". */
const canopyCode = z.string().regex(/^CANOPY-[1-9][0-9]*$/, 'code must match CANOPY-<n> (e.g. CANOPY-1)')

/** Schema for an individual canopy — all fields optional. */
export const canopyItemSchema = z.object({
  code: canopyCode.optional(),
  heightFrom: canopyHeightFromEnum.optional(),

  // ── Dimensions ──
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  materialConsumptionKgPerSqft: z.number().positive().optional(),

  // ── Members ──
  numberOfBeams: z.number().int().nonnegative().optional(),
  numberOfPurlins: z.number().int().nonnegative().optional(),
  purlinDepth: z.number().positive().optional(),
  unitWeightOfPurlin: z.number().positive().optional(),

  // ── Covering ──
  canopySheet: canopySheetTypeEnum.optional(),
  sheetThick: z.number().positive().optional(),
  canopySideCoveringHeight: z.number().positive().optional(),

  // ── Accessories ──
  gutter: z.boolean().optional(),
  downTake: z.boolean().optional(),
  flashing: z.boolean().optional(),
})

/** Schema for creating/upserting a canopy — inline canopies array. */
export const createCanopySchema = z.object({
  canopies: z.array(canopyItemSchema).optional(),
})

/** Schema for updating a canopy — all fields optional (partial update). */
export const updateCanopySchema = createCanopySchema.partial()

/** Validated payload for creating/upserting a canopy. */
export type CreateCanopyInput = z.infer<typeof createCanopySchema>

/** Validated payload for updating a canopy (all fields optional). */
export type UpdateCanopyInput = z.infer<typeof updateCanopySchema>

/** Schema for pagination query params with sensible defaults. */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
})
