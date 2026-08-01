import { useEffect, useRef } from 'react'
import { useQuotation } from '@/api/quotation/quotation/getQuotation'
import { useQuotationStore, buildQuotationPayload } from '@/stores/quotation-store'
import { mapQuotationResponseToDraft } from '@/utils/hydrateQuotation'

/**
 * Hydrates the Step 13 quotation draft from the server when resuming a job.
 *
 * Fetches the job's quotation (no-op until a `jobId` exists) and, the first time
 * the response arrives, maps it into the store — but only if the local draft is
 * still untouched (every field blank). A locally-edited draft is never overwritten,
 * so unsaved work survives a resume.
 */
export function useQuotationHydration(): void {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data } = useQuotation(jobId ?? '')
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current || !data) return
    hydrated.current = true

    const s = useQuotationStore.getState()
    if (Object.keys(buildQuotationPayload(s.quotation)).length > 0) return

    useQuotationStore.setState({ quotation: mapQuotationResponseToDraft(data) })
  }, [data])
}
