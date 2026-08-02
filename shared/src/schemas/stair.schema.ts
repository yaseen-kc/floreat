/**
 * Canonical Stair request contract shared by the Floreat frontend and backend.
 * A Stair is the container plus inline `stairs[]` and `areaDeductions[]` arrays.
 */
import { z } from 'zod'

/** Valid stair step construction types. */
export const stairStepTypeEnum = z.enum(['CHQ_PLATE_6MM', 'CHQ_PLATE_4MM', 'TUBE'])

/** Valid floor levels a stair runs from/to (ground through 6th floor). */
export const stairFloorLevelEnum = z.enum([
  'GROUND', 'FIRST_FLOOR', 'SECOND_FLOOR', 'THIRD_FLOOR',
  'FOURTH_FLOOR', 'FIFTH_FLOOR', 'SIXTH_FLOOR',
])

/** Valid stringer construction types. */
export const stairStringerTypeEnum = z.enum(['HR_SECTION', 'FAB_SECTION'])

/** Valid area-deduction kinds. */
export const areaDeductionTypeEnum = z.enum(['LIFT', 'DUCT', 'CUT_OUT'])

/** What an area deduction applies to. */
export const areaDeductionForEnum = z.enum(['STRUCTURE_DEDUCTION', 'COVERING_DEDUCTION', 'BOTH'])

/** Business code identifier for a stair, e.g. "STAIR_1" to "STAIR_12". */
export const stairCodeEnum = z.enum([
  'STAIR_1', 'STAIR_2', 'STAIR_3', 'STAIR_4', 'STAIR_5', 'STAIR_6',
  'STAIR_7', 'STAIR_8', 'STAIR_9', 'STAIR_10', 'STAIR_11', 'STAIR_12',
])
export const stairCode = stairCodeEnum

/** Location code for a stair or deduction, e.g. "MEZ_1" or "EXT_2". */
export const locationCode = z.string().regex(/^(MEZ|EXT)_[1-9][0-9]*$/, 'location must match MEZ_<n> or EXT_<n>')

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
