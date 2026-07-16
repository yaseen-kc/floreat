/**
 * Rate master-data contract on the frontend — re-exported from the single
 * source of truth in `@floreat/shared/schemas`. Adds the frontend-only
 * `RateRowDraft` (an editable Step 10 table row), the ordered list of raw
 * pricing fields, and the canonical 35-item default set that seeds the rate
 * table before the server master is populated.
 */
import type { CreateRateInput } from '@floreat/shared/schemas'

export { createRateSchema, updateRateSchema, rateUnitEnum } from '@floreat/shared/schemas'
export type { CreateRateInput, UpdateRateInput } from '@floreat/shared/schemas'

/** Unit of measure for a rate item — mirrors the backend `RateUnit` enum. */
export type RateUnit = CreateRateInput['unit']

/** The eight raw pricing components of a rate row, in table-column order. */
export const PRICING_FIELDS = [
  'material',
  'fabrication',
  'transportation',
  'installation',
  'loadingUnloading',
  'overheads',
  'others',
  'marginPercentage',
] as const

/** A single raw pricing field key. */
export type PricingField = (typeof PRICING_FIELDS)[number]

/**
 * One editable row in the Step 10 rate table. `id` is present once the row has
 * been persisted (a server master row); an absent `id` marks an unsaved default.
 * Every pricing component is an optional number (blank = draft), mirroring
 * `CreateRateInput` minus its required `item`/`unit`.
 */
export type RateRowDraft = {
  id?: string
  item: string
  unit: RateUnit
} & Partial<Record<PricingField, number>>

/**
 * The canonical 35 rate master items (item + unit), mirroring the backend seed
 * (`rateSeedData`). These render as the always-present baseline in the Step 10
 * table; a matching server row (by `item`) supplies pricing + derived rates,
 * and an unmatched item stays an unpriced draft until saved.
 */
export const DEFAULT_RATE_ITEMS: ReadonlyArray<{ item: string; unit: RateUnit }> = [
  { item: 'STEEL STRUCTURE', unit: 'KG' },
  { item: 'WIND BRACING - ROD', unit: 'RM' },
  { item: 'SAG ROD - 12 MM', unit: 'RM' },
  { item: 'FLANGE BRACE - GI', unit: 'KG' },
  { item: 'Z/C - PURLINS', unit: 'KG' },
  { item: 'PUFF SHEET 30MM THICK - ROOF', unit: 'SQM' },
  { item: 'PPGL 0.4MM THICK - CLADDING', unit: 'SQM' },
  { item: 'PPGL 0.4MM THICK - CANOPY', unit: 'SQM' },
  { item: '12 MM DIA BOLT - ORD', unit: 'NOS' },
  { item: '16 MM DIA BOLT - HSFG', unit: 'NOS' },
  { item: '20 MM FOUNDATION BOLT', unit: 'NOS' },
  { item: '20 MM ANCHOR BOLT', unit: 'NOS' },
  { item: 'RIDGE', unit: 'RM' },
  { item: 'GUTTER', unit: 'RM' },
  { item: 'DOWNTAKE', unit: 'RM' },
  { item: 'DRIP TRIM', unit: 'RM' },
  { item: 'FLASHING', unit: 'RM' },
  { item: 'ROLLING SHUTTER', unit: 'SQM' },
  { item: 'LOUVERS', unit: 'NOS' },
  { item: 'SKY LIGHT', unit: 'NOS' },
  { item: 'WALL LIGHT', unit: 'NOS' },
  { item: 'INSULATION', unit: 'SQM' },
  { item: 'TURBO VENTILATORS', unit: 'NOS' },
  { item: 'DECKING SHEET', unit: 'SQM' },
  { item: 'SHEAR STUDS', unit: 'NOS' },
  { item: 'POLYCARBONATE SHEET', unit: 'SQM' },
  { item: 'STAIR - HR SECTION', unit: 'KG' },
  { item: 'STAIR 6MM CHQ PLATE STEPS', unit: 'KG' },
  { item: 'HANDRAIL', unit: 'KG' },
  { item: 'CANOPY SIDE COVERING', unit: 'SQM' },
  { item: 'DOORS', unit: 'SQM' },
  { item: 'WINDOWS', unit: 'SQM' },
  { item: 'FASCIA STRUCTURE', unit: 'KG' },
  { item: 'FASCIA COVERING SHEET / BOARD', unit: 'SQM' },
  { item: 'INTERNAL PARTITIONS', unit: 'SQM' },
]
