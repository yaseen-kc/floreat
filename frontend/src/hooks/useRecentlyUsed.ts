import { useCallback, useMemo, useState } from 'react'
import { useAuth } from '@clerk/react'
import { useJobs, type Job } from '@/api/quotation/jobs/getJobs'
import { useQuotationStore } from '@/stores/quotation-store'
import { getRecentlyUsedAdapter, type RecentlyUsedStep } from '@/components/quotation/recently-used'

export function useRecentlyUsed(step: RecentlyUsedStep) {
  const { getToken } = useAuth()
  const { data, isLoading, isError } = useJobs(1, 50)
  const currentJobId = useQuotationStore((state) => state.jobId)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [applyError, setApplyError] = useState<string | null>(null)

  const jobs = useMemo(
    () => (data?.data ?? []).filter((job) => job.id !== currentJobId),
    [currentJobId, data],
  )

  const selectJob = useCallback(async (job: Job) => {
    const adapter = getRecentlyUsedAdapter(step)
    if (!adapter) return

    setSelectedJobId(job.id)
    setApplyError(null)
    try {
      const token = await getToken()
      await adapter.apply(job, token)
      useQuotationStore.setState({ showValidation: false })
    } catch {
      setApplyError('Could not load values from this job.')
    } finally {
      setSelectedJobId(null)
    }
  }, [getToken, step])

  return {
    jobs,
    isLoading,
    isError,
    selectJob,
    selectedJobId,
    applyError,
    canApply: Boolean(getRecentlyUsedAdapter(step)),
  }
}
