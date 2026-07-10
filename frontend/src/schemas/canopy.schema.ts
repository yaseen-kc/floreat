/**
 * Single source of truth for the Canopy request contract on the frontend.
 *
 * Mirrors the backend `createCanopySchema` (backend/schemas/canopy.schema.ts):
 * a Canopy is just an optional inline `canopies[]` array of all-optional items.
 * Numeric fields are typed as `number` here (the create/upsert payload), even
 * though the `Canopy` response serialises Prisma `Decimal` columns back as
 * `string` (see api/quotation/canopy/getCanopy.ts §6.5).
 *
 * No form helpers (`isRequired`/`getFieldErrors`) are exported: unlike Roof,
 * there is no Canopy step form yet and Canopy has no required top-level fields.
 */
import { z } from 'zod'

/* ──────────────────────────────────────────────────────────────────────────
 * Enums — mirror the backend Prisma enums (string literals over the wire).
 * ────────────────────────────────────────────────────────────────────────── */

/** Floor level a canopy starts from. */
export const canopyHeightFromEnum = z.enum(['GROUND', 'FF', 'SF', 'FLOOR_3', 'FLOOR_4', 'FLOOR_5'])

/** Canopy sheet covering type. */
export const canopySheetTypeEnum = z.enum(['NCGL', 'PPGL', 'PUFF', 'OTHER'])

/** Business code identifier for a canopy, e.g. "CANOPY-1". */
export const canopyCode = z
  .string()
  .regex(/^CANOPY-[1-9][0-9]*$/, 'code must match CANOPY-<n> (e.g. CANOPY-1)')

/* ──────────────────────────────────────────────────────────────────────────
 * Canopy item — a single inline canopy entry. All fields optional.
 * ────────────────────────────────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────────────────────────────────
 * Canopy create/upsert payload.
 * ────────────────────────────────────────────────────────────────────────── */

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
