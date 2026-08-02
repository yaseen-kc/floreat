import { History, LoaderCircle } from 'lucide-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useRecentlyUsed } from '@/hooks/useRecentlyUsed'
import type { RecentlyUsedStep } from '@/components/quotation/recently-used'

interface RecentlyUsedProps {
  step: RecentlyUsedStep
}

const recentlyUsedQueryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: false } },
})

function RecentlyUsedContent({ step }: RecentlyUsedProps) {
  const { jobs, isLoading, isError, selectJob, selectedJobId, applyError, canApply } = useRecentlyUsed(step)

  return (
    <div className="mb-6 border-b border-border/70 pb-4" aria-label="Recently used jobs">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        <History className="size-3.5" aria-hidden="true" />
        <span>Recently Used</span>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          Loading recent jobs
        </div>
      )}

      {!isLoading && isError && (
        <p className="text-sm text-destructive">Recent jobs are unavailable.</p>
      )}

      {!isLoading && !isError && jobs.length === 0 && (
        <p className="text-sm text-muted-foreground">No previous jobs yet.</p>
      )}

      {!isLoading && !isError && jobs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="list">
          {jobs.map((job) => {
            const isSelected = selectedJobId === job.id
            const label = job.firmName || job.subject || job.projectNo || 'Untitled job'
            return (
              <Button
                key={job.id}
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-primary/25 bg-primary/[0.03] px-3 text-left hover:border-primary/50 hover:bg-primary/[0.08]"
                disabled={!canApply || selectedJobId !== null}
                onClick={() => void selectJob(job)}
                aria-label={`Use values from ${label}`}
              >
                {isSelected && <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />}
                <span>{label}</span>
                <span className="font-mono text-[0.68rem] text-muted-foreground">{job.projectNo}</span>
              </Button>
            )
          })}
        </div>
      )}

      {!isLoading && !isError && applyError && (
        <p className="mt-2 text-sm text-destructive" role="alert">{applyError}</p>
      )}
    </div>
  )
}

export function RecentlyUsed({ step }: RecentlyUsedProps) {
  return (
    <QueryClientProvider client={recentlyUsedQueryClient}>
      <RecentlyUsedContent step={step} />
    </QueryClientProvider>
  )
}
