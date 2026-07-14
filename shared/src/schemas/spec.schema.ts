import { z } from 'zod'

/**
 * Schema for an individual product entry in a job's specification — all fields
 * optional (draft-friendly). Each product is one row in the Step 9 table.
 */
export const specProductItemSchema = z.object({
  code: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  specification: z.string().min(1).optional(),
  makeOrBrand: z.string().min(1).optional(),
  yieldStrengthMpa: z.number().int().positive().optional(),
})

/** Schema for creating/upserting a job's product specification — optional inline products array. */
export const createSpecSchema = z.object({
  products: z.array(specProductItemSchema).optional(),
})

/** Schema for partially updating a job's product specification. */
export const updateSpecSchema = createSpecSchema.partial()

/** Validated payload for a single specification product. */
export type SpecProductInput = z.infer<typeof specProductItemSchema>

/** Validated payload for creating a job's product specification. */
export type CreateSpecInput = z.infer<typeof createSpecSchema>

/** Validated payload for updating a job's product specification. */
export type UpdateSpecInput = z.infer<typeof updateSpecSchema>
