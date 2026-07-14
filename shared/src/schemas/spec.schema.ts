import { z } from 'zod'

const nonEmptyStringArray = z.array(z.string().min(1)).min(1)

/** Schema for creating a global product specification. */
export const createSpecSchema = z.object({
  description: z.string().min(1),
  specifications: nonEmptyStringArray,
  makeOrBrand: nonEmptyStringArray,
  yieldStrengthMpa: z.number().int().positive(),
})

/** Schema for partially updating a global product specification. */
export const updateSpecSchema = createSpecSchema.partial()

/** Validated payload for creating a global product specification. */
export type CreateSpecInput = z.infer<typeof createSpecSchema>

/** Validated payload for updating a global product specification. */
export type UpdateSpecInput = z.infer<typeof updateSpecSchema>
