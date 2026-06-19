import { useEffect, useRef } from 'react'
import { useMezzanine } from '@/api/quotation/mezz/getMezz'
import { useQuotationStore } from '@/stores/quotation-store'
import { mapMezzanineResponseToDraft } from '@/utils/hydrateMezzanine'

/**
 * Hydrates the Step 3 mezzanine draft from the server when resuming a job.
 *
 * Fetches the job's mezzanine (no-op until a `jobId` exists) and, the first
 * time the response arrives, maps it into the store — but only if the local
 * draft is still untouched (toggle off and no rows). A locally-edited draft is
 * never overwritten, so unsaved work survives a resume.
 */
export function useMezzanineHydration(): void {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data } = useMezzanine(jobId ?? '')
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current || !data) return
    hydrated.current = true

    // Don't clobber a draft the user has already started.
    const s = useQuotationStore.getState()
    if (s.hasMezzanine || s.mezzanine.floors.length > 0 || s.mezzanine.extensions.length > 0) return

    const { mezzanine, hasMezzanine } = mapMezzanineResponseToDraft(data)
    useQuotationStore.setState({ mezzanine, hasMezzanine })
  }, [data])
}
