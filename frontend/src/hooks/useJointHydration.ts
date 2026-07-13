import { useEffect, useRef } from 'react'
import { useJoint } from '@/api/quotation/joint/getJoint'
import { useQuotationStore, buildJointPayload } from '@/stores/quotation-store'
import { mapJointResponseToDraft } from '@/utils/hydrateJoint'

/**
 * Hydrates the Step 8 joint draft from the server when resuming a job.
 *
 * Fetches the job's joint (no-op until a `jobId` exists) and, the first time the
 * response arrives, maps it into the store — but only if the local draft is
 * still untouched (its payload has no keys). A locally-edited draft is never
 * overwritten, so unsaved work survives a resume.
 */
export function useJointHydration(): void {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data } = useJoint(jobId ?? '')
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current || !data) return
    hydrated.current = true

    const s = useQuotationStore.getState()
    if (Object.keys(buildJointPayload(s.joint)).length > 0) return

    useQuotationStore.setState({ joint: mapJointResponseToDraft(data) })
  }, [data])
}
