import type { CreateAmountInput } from '@floreat/shared/schemas'
import { DEFAULT_AMOUNT_ITEMS, ITEM_PREFIX_MAP } from '@floreat/shared/schemas'
import { deriveAmountItemRates, type CalculatedAmountQuantities } from '@floreat/shared/calc'
import type { Rate } from '@/api/quotation/rate/getRate'
import type { Amount } from '@/api/quotation/amount/getAmount'

export { ITEM_PREFIX_MAP }



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
