import { z } from 'zod'

const stringArray = z.array(z.string().min(1))

/** Schema for creating/upserting a job's product specification. All fields optional (draft-friendly). */
export const createSpecSchema = z.object({
  description: z.string().min(1).optional(),
  specifications: stringArray.optional(),
  makeOrBrand: stringArray.optional(),
  yieldStrengthMpa: z.number().int().positive().optional(),
})

/** Schema for partially updating a job's product specification. */
export const updateSpecSchema = createSpecSchema.partial()

/** Validated payload for creating a job's product specification. */
export type CreateSpecInput = z.infer<typeof createSpecSchema>

/** Validated payload for updating a job's product specification. */
export type UpdateSpecInput = z.infer<typeof updateSpecSchema>
