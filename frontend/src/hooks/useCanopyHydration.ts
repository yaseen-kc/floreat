import { useEffect, useRef } from 'react'
import { useCanopy } from '@/api/quotation/canopy/getCanopy'
import { useQuotationStore } from '@/stores/quotation-store'
import { mapCanopyResponseToDraft } from '@/utils/hydrateCanopy'

/**
 * Hydrates the Step 5 canopy draft from the server when resuming a job.
 *
 * Fetches the job's canopy (no-op until a `jobId` exists) and, the first time
 * the response arrives, maps it into the store — but only if the local draft is
 * still untouched (toggle off and no rows). A locally-edited draft is never
 * overwritten, so unsaved work survives a resume.
 */
export function useCanopyHydration(): void {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data } = useCanopy(jobId ?? '')
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current || !data) return
    hydrated.current = true

    const s = useQuotationStore.getState()
    if (s.canopy.canopies.length > 0) return

    const canopy = mapCanopyResponseToDraft(data)
    useQuotationStore.setState({ canopy })
  }, [data])
}
