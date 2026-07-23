/**
 * Canonical Canopy request contract shared by the Floreat frontend and backend.
 * A Canopy is an optional inline `canopies[]` array of all-optional items.
 *
 * Numeric fields are typed as `number` (the create/upsert payload); the
 * `Canopy` HTTP response serialises Prisma `Decimal` columns back as `string`.
 */
import { z } from 'zod'

/** Floor level a canopy starts from. */
export const canopyHeightFromEnum = z.enum(['GROUND', 'FF', 'SF', 'FLOOR_3', 'FLOOR_4', 'FLOOR_5'])

/** Canopy sheet covering type. */
export const canopySheetTypeEnum = z.enum(['NCGL', 'PPGL', 'PUFF', 'OTHER'])

/** Business code identifier for a canopy, e.g. "CANOPY-1" to "CANOPY-10". */
export const canopyCodeEnum = z.enum([
  'CANOPY-1', 'CANOPY-2', 'CANOPY-3', 'CANOPY-4', 'CANOPY-5',
  'CANOPY-6', 'CANOPY-7', 'CANOPY-8', 'CANOPY-9', 'CANOPY-10'
])
export const canopyCode = canopyCodeEnum

/** Schema for an individual canopy entry — all fields optional. */
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

/** Schema for creating/upserting a canopy — optional inline canopies array. */
export const createCanopySchema = z.object({
  canopies: z.array(canopyItemSchema).optional(),
})

/** Schema for updating a canopy — all fields optional (partial update). */
export const updateCanopySchema = createCanopySchema.partial()

/** Validated payload for creating/upserting a canopy. */
export type CreateCanopyInput = z.infer<typeof createCanopySchema>

/** Validated payload for updating a canopy (all fields optional). */
export type UpdateCanopyInput = z.infer<typeof updateCanopySchema>
