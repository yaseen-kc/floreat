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

/** The 36 canonical amount line-item descriptions shown in every job's bill of quantities. */
export const DEFAULT_AMOUNT_ITEMS: { description: string; unit: 'KG' | 'RM' | 'SQM' | 'NOS' }[] = [
  { description: 'STEEL STRUCTURES', unit: 'KG' },
  { description: 'WIND BRACINGS', unit: 'RM' },
  { description: 'SAG ROD', unit: 'RM' },
  { description: 'FLANGE BRACE', unit: 'KG' },
  { description: 'Z/C PURLINS', unit: 'KG' },
  { description: 'ROOF SHEET', unit: 'SQM' },
  { description: 'CLADDING SHEET', unit: 'SQM' },
  { description: 'CANOPY SHEET', unit: 'SQM' },
  { description: 'PURLIN BOLTS', unit: 'NOS' },
  { description: 'JOINT BOLTS', unit: 'NOS' },
  { description: 'FOUNDATION BOLTS', unit: 'NOS' },
  { description: 'ANCHOR BOLTS', unit: 'NOS' },
  { description: 'RIDGE', unit: 'RM' },
  { description: 'GUTTER', unit: 'RM' },
  { description: 'DOWNTAKE', unit: 'RM' },
  { description: 'DRIP TRIM', unit: 'RM' },
  { description: 'FLASHING', unit: 'RM' },
  { description: 'ROLLING SHUTTER', unit: 'SQM' },
  { description: 'LOUVERS', unit: 'SQM' },
  { description: 'SKY LIGHT', unit: 'SQM' },
  { description: 'WALL LIGHT', unit: 'SQM' },
  { description: 'ROOF INSULATION', unit: 'SQM' },
  { description: 'WALL INSULATION', unit: 'SQM' },
  { description: 'TURBO VENTILATORS', unit: 'NOS' },
  { description: 'DECKING SHEET', unit: 'SQM' },
  { description: 'SHEAR STUDS', unit: 'NOS' },
  { description: 'POLY CARBONATE SHEET', unit: 'SQM' },
  { description: 'STAIR - HR SECTION', unit: 'KG' },
  { description: 'STAIR 6MM CHQ PLATE STEPS', unit: 'KG' },
  { description: 'HANDRAIL', unit: 'KG' },
  { description: 'CANOPY SIDE COVERING', unit: 'SQM' },
  { description: 'DOORS', unit: 'SQM' },
  { description: 'WINDOWS', unit: 'SQM' },
  { description: 'FASCIA STRUCTURE', unit: 'KG' },
  { description: 'FASCIA COVERING SHEET/ BOARD', unit: 'SQM' },
  { description: 'INTERNAL PARTITIONS', unit: 'SQM' },
]
