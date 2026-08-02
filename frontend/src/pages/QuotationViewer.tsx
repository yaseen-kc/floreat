import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useJob } from '@/api/quotation/jobs/getJobs'
import { Step13Quotation } from '@/components/quotation/steps/Step13Quotation'
import { useAccessoriesHydration } from '@/hooks/useAccessoriesHydration'
import { useCanopyHydration } from '@/hooks/useCanopyHydration'
import { useMezzanineHydration } from '@/hooks/useMezzanineHydration'
import { useRoofHydration } from '@/hooks/useRoofHydration'
import { useStairHydration } from '@/hooks/useStairHydration'
import { useQuotationStore } from '@/stores/quotation-store'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'

function ViewQuotationData() {
  useRoofHydration()
  useMezzanineHydration()
  useStairHydration()
  useCanopyHydration()
  useAccessoriesHydration()

  return <Step13Quotation />
}

export default function QuotationViewer() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { data: job, isLoading, isError } = useJob(jobId ?? '')
  const initializedJobId = useRef<string | null>(null)

  useEffect(() => {
    if (!jobId || !job || initializedJobId.current === jobId) return
    initializedJobId.current = jobId

    const store = useQuotationStore.getState()
    store.resetQuotation()
    store.setJobId(jobId)
    store.setProjectInfo({
      projectNo: job.projectNo,
      subject: job.subject,
      refNo: job.refNo,
      date: job.date,
      designedByName: job.designedByName,
      designedByMobile: job.designedByMobile,
      clientName: job.clientName ?? '',
      estimationEngineerName: job.estimationEngineerName ?? '',
      estimationEngineerMobile: job.estimationEngineerMobile ?? '',
      headOfSalesName: job.headOfSalesName ?? '',
      headOfSalesMobile: job.headOfSalesMobile ?? '',
      firmName: job.firmName ?? '',
      buildingUsage: job.buildingUsage,
      numberOfBuilding: job.numberOfBuilding,
      frameType: job.frameType,
      configuration: job.configuration,
    })
  }, [jobId, job])

  if (isError) {
    return <div className="mx-auto flex min-h-[calc(100vh-var(--topbar-h))] max-w-lg flex-col items-center justify-center px-6 text-center"><h1 className="text-lg font-semibold">Quotation could not be loaded.</h1><p className="mt-1 text-sm text-muted-foreground">This quotation may no longer be available.</p><Button className="mt-4" variant="outline" onClick={() => window.history.back()}>Go back</Button></div>
  }

  if (!jobId || isLoading || !job) {
    return <div className="flex min-h-[calc(100vh-var(--topbar-h))] items-center justify-center" role="status" aria-label="Loading quotation"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
  }

  return (
    <div className="flex min-h-[calc(100vh-var(--topbar-h))] flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-7 max-[640px]:px-4 max-[640px]:py-5">
        <div className="mx-auto max-w-[1040px]">
          <div className="mb-5 flex items-center justify-end">
            <Button variant="outline" size="sm" onClick={() => navigate('/quotations/new')}>
              <Pencil />
              Edit quotation
            </Button>
          </div>
          <ViewQuotationData key={jobId} />
        </div>
      </div>
    </div>
  )
}
