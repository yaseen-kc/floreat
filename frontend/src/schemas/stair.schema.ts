import { z } from 'zod'

const stairStepTypeEnum = z.enum(['CHQ_PLATE_6MM', 'CHQ_PLATE_4MM', 'TUBE'])
const stairFloorLevelEnum = z.enum(['GROUND', 'FIRST_FLOOR', 'SECOND_FLOOR', 'THIRD_FLOOR', 'FOURTH_FLOOR', 'FIFTH_FLOOR', 'SIXTH_FLOOR'])
const stairStringerTypeEnum = z.enum(['HR_SECTION', 'FAB_SECTION'])
const areaDeductionTypeEnum = z.enum(['LIFT', 'DUCT', 'CUT_OUT'])
const areaDeductionForEnum = z.enum(['STRUCTURE_DEDUCTION', 'COVERING_DEDUCTION', 'BOTH'])

export const stairItemSchema = z.object({
  code: z.string().regex(/^STAIR-[1-9][0-9]*$/).optional(),
  typeOfStep: stairStepTypeEnum.optional(),
  location: z.string().regex(/^(MEZ|EXT)-[1-9][0-9]*$/).optional(),
  startingFrom: stairFloorLevelEnum.optional(),
  endingUpTo: stairFloorLevelEnum.optional(),
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  numberOfMidLanding: z.number().int().nonnegative().optional(),
  typeOfStringer: stairStringerTypeEnum.optional(),
  unitWeightOfStringer: z.number().positive().optional(),
})

export const areaDeductionSchema = z.object({
  type: areaDeductionTypeEnum.optional(),
  location: z.string().regex(/^(MEZ|EXT)-[1-9][0-9]*$/).optional(),
  areaM2: z.number().positive().optional(),
  numbers: z.number().int().nonnegative().optional(),
  deductionFor: areaDeductionForEnum.optional(),
})

export const createStairSchema = z.object({
  stairs: z.array(stairItemSchema).optional(),
  areaDeductions: z.array(areaDeductionSchema).optional(),
})

export const updateStairSchema = createStairSchema.partial()

export type CreateStairInput = z.infer<typeof createStairSchema>
export type UpdateStairInput = z.infer<typeof updateStairSchema>
