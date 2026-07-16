import type { Rate } from '@/api/quotation/rate/getRate'
import { DEFAULT_RATE_ITEMS, PRICING_FIELDS, type RateRowDraft } from '@/schemas/rate.schema'

/** Coerce a nullable wire string (Prisma `Decimal` → JSON string) to an optional number. */
const num = (v: string | null): number | undefined => {
  if (v == null || v.trim() === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

/** Maps a server `Rate` into an editable {@link RateRowDraft} (raw pricing only). */
function toDraft(rate: Rate): RateRowDraft {
  const row: RateRowDraft = { id: rate.id, item: rate.item, unit: rate.unit }
  for (const field of PRICING_FIELDS) {
    const value = num(rate[field])
    if (value !== undefined) row[field] = value
  }
  return row
}

/**
 * Merges the server rate master over the canonical 35 defaults into the ordered
 * list of editable table rows.
 *
 * Each default item is matched to its server row by `item` name (case-sensitive,
 * as seeded): a match yields a persisted, priced row; an unmatched default stays
 * an unpriced draft (no `id`). Any server rows that aren't part of the 35
 * defaults (user-added master items) are appended after, so nothing is hidden.
 */
export function mergeRatesWithDefaults(rates: Rate[]): RateRowDraft[] {
  const byItem = new Map(rates.map((r) => [r.item, r]))

  const rows: RateRowDraft[] = DEFAULT_RATE_ITEMS.map((def) => {
    const server = byItem.get(def.item)
    return server ? toDraft(server) : { item: def.item, unit: def.unit }
  })

  const defaultItems = new Set(DEFAULT_RATE_ITEMS.map((d) => d.item))
  const extras = rates.filter((r) => !defaultItems.has(r.item)).map(toDraft)

  return [...rows, ...extras]
}
