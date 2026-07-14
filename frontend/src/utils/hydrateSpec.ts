import type { Spec } from '@/api/quotation/spec/getSpec'
import type { SpecDraft, SpecProductDraft } from '@/stores/quotation-store'

/** Collapses a nullable/blank response string into an optional draft value. */
const opt = (v: string | null): string | undefined => (v?.trim() ? v : undefined)

/**
 * Maps a `Spec` API response into a Step 9 {@link SpecDraft}. Each server
 * product row becomes a {@link SpecProductDraft}: nullable/blank string fields
 * collapse to `undefined`, and `yieldStrengthMpa` is kept as a number (dropped
 * when absent). An absent `products` array yields an empty table.
 */
export function mapSpecResponseToDraft(s: Spec): SpecDraft {
  const products: SpecProductDraft[] = (s.products ?? []).map((p) => ({
    code: opt(p.code),
    description: opt(p.description),
    specification: opt(p.specification),
    makeOrBrand: opt(p.makeOrBrand),
    yieldStrengthMpa: p.yieldStrengthMpa ?? undefined,
  }))

  return { products }
}
