import type { CreateAmountInput } from '@floreat/shared/schemas'
import { DEFAULT_AMOUNT_ITEMS } from '@floreat/shared/schemas'
import { deriveAmountItemRates, type CalculatedAmountQuantities } from '@floreat/shared/calc'
import type { Rate } from '@/api/quotation/rate/getRate'
import type { Amount } from '@/api/quotation/amount/getAmount'

/** Prefix map connecting line item descriptions to flat schema field prefixes. */
export const ITEM_PREFIX_MAP: Record<string, string> = {
  'STEEL STRUCTURES': 'steelStructures',
  'WIND BRACINGS': 'windBracings',
  'SAG ROD': 'sagRod',
  'FLANGE BRACE': 'flangeBrace',
  'Z/C PURLINS': 'zCPurlins',
  'ROOF SHEET': 'roofSheet',
  'CLADDING SHEET': 'claddingSheet',
  'CANOPY SHEET': 'canopySheet',
  'PURLIN BOLTS': 'purlinBolts',
  'JOINT BOLTS': 'jointBolts',
  'FOUNDATION BOLTS': 'foundationBolts',
  'ANCHOR BOLTS': 'anchorBolts',
  'RIDGE': 'ridge',
  'GUTTER': 'gutter',
  'DOWNTAKE': 'downtake',
  'DRIP TRIM': 'dripTrim',
  'FLASHING': 'flashing',
  'ROLLING SHUTTER': 'rollingShutter',
  'LOUVERS': 'louvers',
  'SKY LIGHT': 'skyLight',
  'WALL LIGHT': 'wallLight',
  'ROOF INSULATION': 'roofInsulation',
  'WALL INSULATION': 'wallInsulation',
  'TURBO VENTILATORS': 'turboVentilators',
  'DECKING SHEET': 'deckingSheet',
  'SHEAR STUDS': 'shearStuds',
  'POLY CARBONATE SHEET': 'polyCarbonateSheet',
  'STAIR - HR SECTION': 'stair1',
  'STAIR 6MM CHQ PLATE STEPS': 'stair2',
  'HANDRAIL': 'handrail',
  'CANOPY SIDE COVERING': 'canopySideCovering',
  'DOORS': 'doors',
  'WINDOWS': 'windows',
  'FASCIA STRUCTURE': 'fasciaStructure',
  'FASCIA COVERING SHEET/ BOARD': 'fasciaCoveringSheetBoard',
  'INTERNAL PARTITIONS': 'internalPartitions',
}

const parseNum = (v?: string | number | null): number | undefined => {
  if (v == null || v === '') return undefined
  const n = Number(v)
  return isNaN(n) ? undefined : n
}

/**
 * Builds the canonical flat `CreateAmountInput` payload for POST/PUT /api/jobs/:jobId/amount
 * from calculated quantities, rate master data, and existing saved amount values.
 */
export function buildAmountPayload(
  calculatedQuantities: CalculatedAmountQuantities,
  rateByItemMap: Map<string, Rate>,
  existingAmount?: Amount | null,
): CreateAmountInput {
  const payload: Record<string, number | undefined> = {}

  for (const item of DEFAULT_AMOUNT_ITEMS) {
    const prefix = ITEM_PREFIX_MAP[item.description]
    if (!prefix) continue

    const qtyKey = `${prefix}Quantity` as keyof CalculatedAmountQuantities
    const savedQtyKey = `${prefix}Quantity` as keyof Amount

    const calcQty = calculatedQuantities[qtyKey] ?? 0
    const savedQty = parseNum(existingAmount?.[savedQtyKey])
    const qty = savedQty ?? calcQty

    const rates = deriveAmountItemRates(item.rateItem ? rateByItemMap.get(item.rateItem) : null)

    const amtFab = qty * rates.rateFabrication
    const amtErec = qty * rates.rateErection
    const amtLoad = qty * rates.rateLoading

    payload[`${prefix}Quantity`] = qty
    payload[`${prefix}FabricationRate`] = rates.rateFabrication
    payload[`${prefix}ErrectionRate`] = rates.rateErection
    payload[`${prefix}LoadingRate`] = rates.rateLoading
    payload[`${prefix}FabricationAmount`] = amtFab
    payload[`${prefix}ErrectionAmount`] = amtErec
    payload[`${prefix}LoadingAmount`] = amtLoad
  }

  return payload as CreateAmountInput
}
