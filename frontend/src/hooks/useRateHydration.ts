import { useMemo } from 'react'
import { useRates } from '@/api/quotation/rate/getRate'
import { mergeRatesWithDefaults } from '@/utils/hydrateRate'
import type { RateRowDraft } from '@/schemas/rate.schema'
import { useQuotationStore } from '@/stores/quotation-store'

/** Result of {@link useRateHydration} — the merged rows plus query state. */
export interface RateHydration {
  rows: RateRowDraft[]
  isLoading: boolean
  isError: boolean
}

/**
 * Loads the Step 10 rate table: fetches the active job's rates (one page large enough
 * to cover the 35 defaults plus any user-added items) and merges the response
 * over the canonical defaults into ordered, editable rows.
 *
 * Rates are job-scoped, so this reads the active job rather than a shared
 * quotation draft store. The merged rows are the
 * seed for the table's local edit state; `isLoading`/`isError` drive the
 * spinner and error states.
 */
export function useRateHydration(): RateHydration {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data, isLoading, isError } = useRates(jobId ?? '', 1, 100)

  const rows = useMemo(() => mergeRatesWithDefaults(data?.data ?? []), [data])

  return { rows, isLoading, isError }
}
