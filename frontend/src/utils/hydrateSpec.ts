import type { Spec } from '@/api/quotation/spec/getSpec'
import type { SpecDraft } from '@/stores/quotation-store'

/**
 * Maps a `Spec` API response into a Step 9 {@link SpecDraft}. Spec is flat with
 * no child arrays: the two string-list fields default to `[]` when absent, a
 * blank `description` collapses to `undefined`, and `yieldStrengthMpa` is kept
 * as a number (dropped when absent).
 */
export function mapSpecResponseToDraft(s: Spec): SpecDraft {
  return {
    description: s.description?.trim() ? s.description : undefined,
    specifications: s.specifications ?? [],
    makeOrBrand: s.makeOrBrand ?? [],
    yieldStrengthMpa: s.yieldStrengthMpa ?? undefined,
  }
}
