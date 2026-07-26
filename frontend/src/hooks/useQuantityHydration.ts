import { useEffect, useRef } from 'react'
import { useQuantity } from '@/api/quotation/quantity/getQuantity'
import { useQuotationStore } from '@/stores/quotation-store'

/**
 * Hydrates the Step 12 quantity data from the server.
 *
 * Fetches the job's computed quantity and writes it to the store the first
 * time it arrives. No draft-guard needed — quantity is server-computed, not
 * user-input, so overwriting on remount is safe.
 */
export function useQuantityHydration(): void {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data } = useQuantity(jobId ?? '')
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current || !data) return
    hydrated.current = true
    useQuotationStore.setState({ quantity: data })
  }, [data])
}
