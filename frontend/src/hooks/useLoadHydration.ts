import { useEffect, useRef } from 'react'
import { useLoad } from '@/api/quotation/load/getLoad'
import { useQuotationStore, buildLoadPayload } from '@/stores/quotation-store'
import { mapLoadResponseToDraft } from '@/utils/hydrateLoad'

/**
 * Hydrates the Step 7 load draft from the server when resuming a job.
 *
 * Fetches the job's load (no-op until a `jobId` exists) and, the first time the
 * response arrives, maps it into the store — but only if the local draft is
 * still untouched (every field blank). A locally-edited draft is never
 * overwritten, so unsaved work survives a resume.
 */
export function useLoadHydration(): void {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data } = useLoad(jobId ?? '')
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current || !data) return
    hydrated.current = true

    const s = useQuotationStore.getState()
    if (Object.keys(buildLoadPayload(s.load)).length > 0) return

    useQuotationStore.setState({ load: mapLoadResponseToDraft(data) })
  }, [data])
}
