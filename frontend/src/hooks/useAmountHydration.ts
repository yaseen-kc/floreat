import { useEffect, useRef } from 'react'
import { useAmount } from '@/api/quotation/amount/getAmount'
import { useQuotationStore } from '@/stores/quotation-store'

/**
 * Hydrates the Step 12 amount data from the server.
 *
 * Fetches the job's amount record and writes it to the store the first
 * time it arrives.
 */
export function useAmountHydration(): void {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data } = useAmount(jobId ?? '')
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current || !data) return
    hydrated.current = true
    useQuotationStore.setState({ amount: data })
  }, [data])
}
