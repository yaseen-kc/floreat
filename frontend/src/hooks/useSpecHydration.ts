import { useEffect, useRef } from 'react'
import { useSpec } from '@/api/quotation/spec/getSpec'
import { useQuotationStore, isDefaultSpecDraft } from '@/stores/quotation-store'
import { mapSpecResponseToDraft } from '@/utils/hydrateSpec'

/**
 * Hydrates the Step 9 spec draft from the server when resuming a job.
 *
 * Fetches the job's spec (no-op until a `jobId` exists) and, the first time the
 * response arrives, maps it into the store — but only if the local draft is
 * still seeded with the default rows. A locally-edited draft is never
 * overwritten, so unsaved work survives a resume.
 */
export function useSpecHydration(): void {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data } = useSpec(jobId ?? '')
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current || !data) return
    hydrated.current = true

    const s = useQuotationStore.getState()
    if (!isDefaultSpecDraft(s.spec)) return

    useQuotationStore.setState({ spec: mapSpecResponseToDraft(data) })
  }, [data])
}
