import { useEffect, useRef } from 'react'
import { useAccessory } from '@/api/quotation/accessories/getAccessories'
import { useQuotationStore, buildAccessoriesPayload } from '@/stores/quotation-store'
import { mapAccessoriesResponseToDraft } from '@/utils/hydrateAccessories'

/**
 * Hydrates the Step 6 accessories draft from the server when resuming a job.
 *
 * Fetches the job's accessories (no-op until a `jobId` exists) and, the first
 * time the response arrives, maps it into the store — but only if the local
 * draft is still untouched (every field blank). A locally-edited draft is never
 * overwritten, so unsaved work survives a resume.
 */
export function useAccessoriesHydration(): void {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data } = useAccessory(jobId ?? '')
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current || !data) return
    hydrated.current = true

    const s = useQuotationStore.getState()
    if (Object.keys(buildAccessoriesPayload(s.accessories)).length > 0) return

    useQuotationStore.setState({ accessories: mapAccessoriesResponseToDraft(data) })
  }, [data])
}
