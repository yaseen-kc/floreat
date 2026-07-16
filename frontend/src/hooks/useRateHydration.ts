import { useMemo } from 'react'
import { useRates } from '@/api/quotation/rate/getRate'
import { mergeRatesWithDefaults } from '@/utils/hydrateRate'
import type { RateRowDraft } from '@/schemas/rate.schema'

/** Result of {@link useRateHydration} — the merged rows plus query state. */
export interface RateHydration {
  rows: RateRowDraft[]
  isLoading: boolean
  isError: boolean
}

/**
 * Loads the Step 10 rate table: fetches the rate master (one page large enough
 * to cover the 35 defaults plus any user-added items) and merges the response
 * over the canonical defaults into ordered, editable rows.
 *
 * Rate is global master-data (not job-scoped), so this reads straight from the
 * API rather than the per-job quotation draft store. The merged rows are the
 * seed for the table's local edit state; `isLoading`/`isError` drive the
 * spinner and error states.
 */
export function useRateHydration(): RateHydration {
  const { data, isLoading, isError } = useRates(1, 100)

  const rows = useMemo(() => mergeRatesWithDefaults(data?.data ?? []), [data])

  return { rows, isLoading, isError }
}
