/**
 * Canonical Amount request contract shared by the Floreat frontend and
 * backend. An Amount is the bill-of-quantities cost summary for a job:
 * one container plus a flat list of AmountItems (description, unit, quantities
 * and rates). All fields are optional/nullable for partial saves.
 */
import { z } from 'zod'

export const amountUnitEnum = z.enum(['KG', 'RM', 'SQM', 'NOS'])

const dec = z.number().nullish()
const text = z.string().nullish()

export const amountItemSchema = z.object({
  description: text,
  unit: amountUnitEnum.nullish(),
  quantity: dec,
  rateFabrication: dec,
  rateErection: dec,
  rateLoading: dec,
  amountFabrication: dec,
  amountErection: dec,
  amountLoading: dec,
})

export const createAmountSchema = z.object({
  items: z.array(amountItemSchema).optional(),
})

export const updateAmountSchema = createAmountSchema.partial()

export type CreateAmountInput = z.infer<typeof createAmountSchema>
export type UpdateAmountInput = z.infer<typeof updateAmountSchema>
