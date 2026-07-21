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

/**
 * The 36 canonical amount line-item descriptions shown in every job's bill of quantities.
 * `rateItem` maps each description to its corresponding Rate master `item` name for rate lookup.
 */
export const DEFAULT_AMOUNT_ITEMS: {
  description: string
  unit: 'KG' | 'RM' | 'SQM' | 'NOS'
  rateItem?: string
}[] = [
  { description: 'STEEL STRUCTURES', unit: 'KG', rateItem: 'STEEL STRUCTURE' },
  { description: 'WIND BRACINGS', unit: 'RM', rateItem: 'WIND BRACING - ROD' },
  { description: 'SAG ROD', unit: 'RM', rateItem: 'SAG ROD - 12 MM' },
  { description: 'FLANGE BRACE', unit: 'KG', rateItem: 'FLANGE BRACE - GI' },
  { description: 'Z/C PURLINS', unit: 'KG', rateItem: 'Z/C - PURLINS' },
  { description: 'ROOF SHEET', unit: 'SQM', rateItem: 'PUFF SHEET 30MM THICK - ROOF' },
  { description: 'CLADDING SHEET', unit: 'SQM', rateItem: 'PPGL 0.4MM THICK - CLADDING' },
  { description: 'CANOPY SHEET', unit: 'SQM', rateItem: 'PPGL 0.4MM THICK - CANOPY' },
  { description: 'PURLIN BOLTS', unit: 'NOS', rateItem: '12 MM DIA BOLT - ORD' },
  { description: 'JOINT BOLTS', unit: 'NOS', rateItem: '16 MM DIA BOLT - HSFG' },
  { description: 'FOUNDATION BOLTS', unit: 'NOS', rateItem: '20 MM FOUNDATION BOLT' },
  { description: 'ANCHOR BOLTS', unit: 'NOS', rateItem: '20 MM ANCHOR BOLT' },
  { description: 'RIDGE', unit: 'RM', rateItem: 'RIDGE' },
  { description: 'GUTTER', unit: 'RM', rateItem: 'GUTTER' },
  { description: 'DOWNTAKE', unit: 'RM', rateItem: 'DOWNTAKE' },
  { description: 'DRIP TRIM', unit: 'RM', rateItem: 'DRIP TRIM' },
  { description: 'FLASHING', unit: 'RM', rateItem: 'FLASHING' },
  { description: 'ROLLING SHUTTER', unit: 'SQM', rateItem: 'ROLLING SHUTTER' },
  { description: 'LOUVERS', unit: 'SQM', rateItem: 'LOUVERS' },
  { description: 'SKY LIGHT', unit: 'SQM', rateItem: 'SKY LIGHT' },
  { description: 'WALL LIGHT', unit: 'SQM', rateItem: 'WALL LIGHT' },
  { description: 'ROOF INSULATION', unit: 'SQM', rateItem: 'INSULATION' },
  { description: 'WALL INSULATION', unit: 'SQM', rateItem: 'INSULATION' },
  { description: 'TURBO VENTILATORS', unit: 'NOS', rateItem: 'TURBO VENTILATORS' },
  { description: 'DECKING SHEET', unit: 'SQM', rateItem: 'DECKING SHEET' },
  { description: 'SHEAR STUDS', unit: 'NOS', rateItem: 'SHEAR STUDS' },
  { description: 'POLY CARBONATE SHEET', unit: 'SQM', rateItem: 'POLYCARBONATE SHEET' },
  { description: 'STAIR - HR SECTION', unit: 'KG', rateItem: 'STAIR - HR SECTION' },
  { description: 'STAIR 6MM CHQ PLATE STEPS', unit: 'KG', rateItem: 'STAIR 6MM CHQ PLATE STEPS' },
  { description: 'HANDRAIL', unit: 'KG', rateItem: 'HANDRAIL' },
  { description: 'CANOPY SIDE COVERING', unit: 'SQM', rateItem: 'CANOPY SIDE COVERING' },
  { description: 'DOORS', unit: 'SQM', rateItem: 'DOORS' },
  { description: 'WINDOWS', unit: 'SQM', rateItem: 'WINDOWS' },
  { description: 'FASCIA STRUCTURE', unit: 'KG', rateItem: 'FASCIA STRUCTURE' },
  { description: 'FASCIA COVERING SHEET/ BOARD', unit: 'SQM', rateItem: 'FASCIA COVERING SHEET / BOARD' },
  { description: 'INTERNAL PARTITIONS', unit: 'SQM', rateItem: 'INTERNAL PARTITIONS' },
]
