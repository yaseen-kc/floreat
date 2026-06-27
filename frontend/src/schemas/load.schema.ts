/**
 * Single source of truth for the Load (quotation) request contract on the
 * frontend.
 *
 * Mirrors the backend `createLoadSchema` (backend/schemas/load.schema.ts).
 * Load is a flat, 1-to-1 resource per job with NO child arrays.
 *
 * NOTE: Unlike the frontend roof schema, this schema is intentionally
 * ALL-OPTIONAL — it matches the backend exactly, where partial drafts are
 * allowed. Tighten individual fields to required only if a Load form step needs
 * to force completion.
 *
 * NOTE: Numeric load fields are typed as `number` here (the create/update
 * payload). The `Load` response serialises Prisma `Decimal` columns back as
 * `string` (see getLoad.ts).
 */
import { z } from 'zod'

/** Valid time units for the approval-drawings completion period. */
export const approvalDrawingsTimeUnitEnum = z.enum(['DAYS', 'WEEKS', 'MONTHS'])

/** Schema for creating/upserting a load — all fields optional (partial drafts allowed). */
export const createLoadSchema = z.object({
  // ── Load details (units implied: KN/M²; wind = KMPH) ──
  deadLoadOnRoofRafters: z.number().positive().optional(),
  liveLoadOnRoofRafters: z.number().positive().optional(),
  collateralLoadOnRoofRafters: z.number().positive().optional(),
  windLoadOnRoofRaftersUpward: z.number().positive().optional(),
  windLoadHorizontal: z.number().positive().optional(),
  deadLoadOnRoofFloor: z.number().positive().optional(),
  liveLoadOnRoofFloor: z.number().positive().optional(),
  floorDeadLoad: z.number().positive().optional(),
  floorFinishLoad: z.number().positive().optional(),
  floorLiveLoad: z.number().positive().optional(),
  snowLoad: z.number().positive().optional(),
  earthquakeLoad: z.number().positive().optional(),

  // ── Completion period ──
  approvalDrawingsTime: z.number().int().positive().optional(),
  approvalDrawingsUnit: approvalDrawingsTimeUnitEnum.optional(),
  supplyOfMaterialsDays: z.number().int().positive().optional(),
  erectionOfStructureDays: z.number().int().positive().optional(),
})

/** Schema for updating a load — all fields optional (partial update). */
export const updateLoadSchema = createLoadSchema.partial()

/** Validated payload for creating/upserting a load. */
export type CreateLoadInput = z.infer<typeof createLoadSchema>

/** Validated payload for updating a load (all fields optional). */
export type UpdateLoadInput = z.infer<typeof updateLoadSchema>
