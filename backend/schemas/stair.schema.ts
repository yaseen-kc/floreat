/**
 * Zod validation schemas for Stair API request payloads.
 * Handles the Stair container plus inline stairs and area-deductions arrays.
 */
import { z } from 'zod'

/** Valid stair step construction types. */
const stairStepTypeEnum = z.enum(['CHQ_PLATE_6MM', 'CHQ_PLATE_4MM', 'TUBE'])

/** Valid floor levels a stair runs from/to (ground through 6th floor). */
const stairFloorLevelEnum = z.enum([
  'GROUND', 'FIRST_FLOOR', 'SECOND_FLOOR', 'THIRD_FLOOR',
  'FOURTH_FLOOR', 'FIFTH_FLOOR', 'SIXTH_FLOOR',
])

/** Valid stringer construction types. */
const stairStringerTypeEnum = z.enum(['HR_SECTION', 'FAB_SECTION'])

/** Valid area-deduction kinds. */
const areaDeductionTypeEnum = z.enum(['LIFT', 'DUCT', 'CUT_OUT'])

/** What an area deduction applies to. */
const areaDeductionForEnum = z.enum(['STRUCTURE_DEDUCTION', 'COVERING_DEDUCTION', 'BOTH'])

/** Business code identifier for a stair, e.g. "STAIR-1". */
const stairCode = z.string().regex(/^STAIR-[1-9][0-9]*$/, 'code must match STAIR-<n> (e.g. STAIR-1)')

/** Location code for a stair or deduction, e.g. "MEZ-1" or "EXT-2". */
const locationCode = z.string().regex(/^(MEZ|EXT)-[1-9][0-9]*$/, 'location must match MEZ-<n> or EXT-<n>')

/** Schema for an individual stair — all fields optional. */
export const stairItemSchema = z.object({
  code: stairCode.optional(),
  typeOfStep: stairStepTypeEnum.optional(),
  location: locationCode.optional(),
  startingFrom: stairFloorLevelEnum.optional(),
  endingUpTo: stairFloorLevelEnum.optional(),

  // ── Dimensions ──
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),

  numberOfMidLanding: z.number().int().nonnegative().optional(),
  typeOfStringer: stairStringerTypeEnum.optional(),
  unitWeightOfStringer: z.number().positive().optional(),
})

/** Schema for an individual area deduction — all fields optional. */
export const areaDeductionSchema = z.object({
  type: areaDeductionTypeEnum.optional(),
  location: locationCode.optional(),
  areaM2: z.number().positive().optional(),
  numbers: z.number().int().nonnegative().optional(),
  deductionFor: areaDeductionForEnum.optional(),
})

/** Schema for creating/upserting a stair — inline stairs and area deductions. */
export const createStairSchema = z.object({
  stairs: z.array(stairItemSchema).optional(),
  areaDeductions: z.array(areaDeductionSchema).optional(),
})

/** Schema for updating a stair — all fields optional (partial update). */
export const updateStairSchema = createStairSchema.partial()

/** Validated payload for creating/upserting a stair. */
export type CreateStairInput = z.infer<typeof createStairSchema>

/** Validated payload for updating a stair (all fields optional). */
export type UpdateStairInput = z.infer<typeof updateStairSchema>

/** Schema for pagination query params with sensible defaults. */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
})
