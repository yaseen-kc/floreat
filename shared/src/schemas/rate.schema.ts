import { z } from 'zod'

/** Unit of measure for a rate master item. Mirrors the `RateUnit` Prisma enum. */
export const rateUnitEnum = z.enum(['KG', 'RM', 'SQM', 'NOS'])

/**
 * Schema for creating a rate master item. `item` and `unit` are required; every
 * pricing component is optional and non-negative (blank pricing is a valid
 * draft row — see `rate.json`). The four derived rates are computed
 * server-side (`@floreat/shared/calc`) and never accepted from the client.
 */
export const createRateSchema = z.object({
  item: z.string().min(1),
  unit: rateUnitEnum,
  material: z.number().nonnegative().optional(),
  fabrication: z.number().nonnegative().optional(),
  transportation: z.number().nonnegative().optional(),
  installation: z.number().nonnegative().optional(),
  loadingUnloading: z.number().nonnegative().optional(),
  overheads: z.number().nonnegative().optional(),
  others: z.number().nonnegative().optional(),
  marginPercentage: z.number().nonnegative().optional(),
})

/** Schema for partially updating a rate master item (all fields optional). */
export const updateRateSchema = createRateSchema.partial()

/** Validated payload for creating a rate master item. */
export type CreateRateInput = z.infer<typeof createRateSchema>

/** Validated payload for updating a rate master item (all fields optional). */
export type UpdateRateInput = z.infer<typeof updateRateSchema>
