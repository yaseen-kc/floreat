import { useEffect, useRef } from 'react'
import { useStair } from '@/api/quotation/stair/getStairs'
import { useQuotationStore } from '@/stores/quotation-store'
import { mapStairResponseToDraft } from '@/utils/hydrateStair'

/**
 * Hydrates the Step 4 stair draft from the server when resuming a job.
 *
 * Fetches the job's stair (no-op until a `jobId` exists) and, the first time
 * the response arrives, maps it into the store — but only if the local draft is
 * still untouched (toggle off and no rows). A locally-edited draft is never
 * overwritten, so unsaved work survives a resume.
 */
export function useStairHydration(): void {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data } = useStair(jobId ?? '')
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current || !data) return
    hydrated.current = true

    // Don't clobber a draft the user has already started.
    const s = useQuotationStore.getState()
    if (s.stair.stairs.length > 0 || s.stair.areaDeductions.length > 0) return

    const stair = mapStairResponseToDraft(data)
    useQuotationStore.setState({ stair })
  }, [data])
}
