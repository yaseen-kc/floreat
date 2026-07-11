/**
 * Canonical Load request contract shared by the Floreat frontend and backend.
 * Load is a flat, 1-to-1 resource per job with NO child arrays; all fields are
 * optional so partial drafts can be saved. Units are implied constants
 * (loads → KN/M²; wind → KMPH) and are NOT persisted, except
 * `approvalDrawingsUnit` which is genuinely variable (DAYS | WEEKS | MONTHS).
 *
 * Numeric fields are typed as `number` (the create/upsert payload); the `Load`
 * HTTP response serialises Prisma `Decimal` columns back as `string`.
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
