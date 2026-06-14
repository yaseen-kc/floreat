import { useEffect, useRef } from 'react'
import { useRoof } from '@/api/quotation/roof/getRoof'
import { useQuotationStore } from '@/stores/quotation-store'
import { mapRoofResponseToDraft } from '@/utils/hydrateRoof'

/**
 * Hydrates the Step 2 roof draft from the server when resuming a job.
 *
 * Fetches the job's roof (no-op until a `jobId` exists) and, the first time the
 * response arrives, maps it into the store — but only if the local draft is
 * still untouched (`roofFrameBaseFixing === ''`). A locally-edited draft is
 * never overwritten, so unsaved work survives a resume.
 */
export function useRoofHydration(): void {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data } = useRoof(jobId ?? '')
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current || !data) return
    hydrated.current = true

    // Don't clobber a draft the user has already started.
    if (useQuotationStore.getState().roof.roofFrameBaseFixing !== '') return

    const { roof, roofSectionsEnabled } = mapRoofResponseToDraft(data)
    useQuotationStore.setState({ roof, roofSectionsEnabled })
  }, [data])
}
