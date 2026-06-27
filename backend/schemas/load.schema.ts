/**
 * Zod validation schemas for Load API request payloads.
 * Captures per-job structural load details and completion-period figures.
 * Units are implied constants (loads → KN/M²; wind → KMPH) and are NOT persisted,
 * except `approvalDrawingsUnit` which is genuinely variable (DAYS | WEEKS | MONTHS).
 */
import { z } from 'zod'

/** Valid time units for the approval-drawings completion period. */
const approvalDrawingsTimeUnitEnum = z.enum(['DAYS', 'WEEKS', 'MONTHS'])

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

/** Schema for pagination query params with sensible defaults. */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
})
