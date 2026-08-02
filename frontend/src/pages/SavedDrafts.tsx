import { useMemo, useState } from 'react'
import { FileText, Play, Plus, Search, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useJobs, type Job } from '@/api/quotation/jobs/getJobs'
import { useDeleteJob } from '@/api/quotation/jobs/deleteJobs'
import { useQuotations } from '@/api/quotation/quotation/getQuotation'
import { ApiError } from '@/lib/api'
import { useQuotationStore } from '@/stores/quotation-store'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table'
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog'

const PAGE_SIZE = 50
const date = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

function display(value: string | null | undefined) {
  return value?.trim() || '-'
}

function matchesSearch(job: Job, search: string) {
  if (!search.trim()) return true
  const query = search.trim().toLowerCase()
  return [job.refNo, job.clientName, job.firmName, job.projectNo, job.subject]
    .some((value) => value?.toLowerCase().includes(query))
}

export default function SavedDrafts() {
  const navigate = useNavigate()
  const { data: jobsData, isLoading: jobsLoading, isError: jobsError, error: jobsFetchError, refetch: refetchJobs } = useJobs(1, PAGE_SIZE)
  const { data: quotationsData, isLoading: quotationsLoading, isError: quotationsError, error: quotationsFetchError, refetch: refetchQuotations } = useQuotations(1, PAGE_SIZE)
  const deleteJob = useDeleteJob()
  const currentJobId = useQuotationStore((s) => s.jobId)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const completedJobIds = useMemo(
    () => new Set((quotationsData?.data ?? []).filter((quotation) => quotation.grandTotal !== null).map((quotation) => quotation.jobId)),
    [quotationsData?.data],
  )
  const pendingJobs = useMemo(
    () => (jobsData?.data ?? []).filter((job) => !completedJobIds.has(job.id)),
    [completedJobIds, jobsData?.data],
  )
  const jobs = useMemo(
    () => pendingJobs.filter((job) => matchesSearch(job, search)),
    [pendingJobs, search],
  )
  const isLoading = jobsLoading || quotationsLoading
  const isError = jobsError || quotationsError
  const fetchError = jobsFetchError ?? quotationsFetchError

  function handleResume(job: Job) {
    if (currentJobId === job.id) { navigate('/quotations/new'); return }
    const store = useQuotationStore.getState()
    store.resetQuotation()
    store.setJobId(job.id)
    store.setProjectInfo({
      projectNo: job.projectNo, subject: job.subject, refNo: job.refNo,
      date: job.date, designedByName: job.designedByName,
      designedByMobile: job.designedByMobile,
      clientName: job.clientName ?? '',
      estimationEngineerName: job.estimationEngineerName ?? '',
      estimationEngineerMobile: job.estimationEngineerMobile ?? '',
      headOfSalesName: job.headOfSalesName ?? '',
      headOfSalesMobile: job.headOfSalesMobile ?? '',
      firmName: job.firmName ?? '',
      buildingUsage: job.buildingUsage,
      numberOfBuilding: job.numberOfBuilding,
      frameType: job.frameType, configuration: job.configuration,
    })
    navigate('/quotations/new')
  }

  function handleCreateQuotation() {
    useQuotationStore.getState().resetQuotation()
    navigate('/quotations/new')
  }

  function handleDelete(id: string) {
    if (id === currentJobId) useQuotationStore.getState().resetQuotation()
    deleteJob.mutate(id, { onSettled: () => setDeletingId(null) })
  }

  function retry() {
    if (jobsError) void refetchJobs()
    if (quotationsError) void refetchQuotations()
  }

  return (
    <div className="mx-auto w-full max-w-[var(--container-max)] p-[var(--s7)] max-[560px]:p-[var(--s4)]">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Workspace / In progress</p>
          <h1 className="text-2xl font-semibold tracking-[-0.025em] text-foreground">Saved drafts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {jobsData ? `${pendingJobs.length} quotation${pendingJobs.length === 1 ? '' : 's'} in progress.` : 'Quotations in progress.'}
          </p>
        </div>
        <Button onClick={handleCreateQuotation}>
          <Plus />
          New quotation
        </Button>
      </header>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reference, client, project or subject"
            aria-label="Search saved drafts"
            className="pl-8"
          />
        </div>
      </div>

      {isLoading && <div className="flex items-center justify-center py-16" role="status" aria-label="Loading saved drafts"><Spinner className="size-6 text-muted-foreground" /></div>}

      {isError && (
        <div className="rounded-lg border border-danger/30 bg-danger-soft px-6 py-10 text-center">
          <p className="font-medium text-foreground">Saved drafts could not be loaded.</p>
          <p className="mt-1 text-sm text-muted-foreground">{fetchError instanceof ApiError ? fetchError.message : 'Check your connection and try again.'}</p>
          <Button className="mt-4" variant="outline" onClick={retry}>Try again</Button>
        </div>
      )}

      {!isLoading && !isError && pendingJobs.length === 0 && (
        <div className="rounded-lg border border-border bg-card shadow-sm"><EmptyState icon={<FileText />} title="No saved drafts yet." description="Start a new quotation and it will appear here." /></div>
      )}

      {!isLoading && !isError && pendingJobs.length > 0 && jobs.length === 0 && (
        <div className="rounded-lg border border-border bg-card shadow-sm"><EmptyState icon={<Search />} title="No drafts match this search." description="Try a different reference, client, project, or subject." /></div>
      )}

      {!isLoading && !isError && jobs.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <Table className="min-w-[820px]">
            <TableHeader className="bg-surface-2">
              <TableRow>
                <TableHead className="pl-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Ref</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Client / Project</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Type</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Updated</TableHead>
                <TableHead className="pr-4 text-right font-mono text-xs uppercase tracking-wider text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => {
                const client = display(job.clientName || job.firmName)
                const project = `${display(job.projectNo)} / ${display(job.subject)}`
                return <TableRow
                  key={job.id}
                  tabIndex={0}
                  className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                  aria-label={`Resume draft ${display(job.refNo)} for ${client}, project ${project}`}
                  onClick={() => handleResume(job)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      handleResume(job)
                    }
                  }}
                >
                  <TableCell className="pl-4 font-mono text-sm font-medium text-primary">{display(job.refNo)}</TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{client}</div>
                    <div className="mt-0.5 text-sm text-muted-foreground">{display(job.projectNo)} / {display(job.firmName)}</div>
                  </TableCell>
                  <TableCell><span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">{display(job.frameType)}</span><div className="mt-1 text-xs text-muted-foreground">{display(job.configuration)}</div></TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{date.format(new Date(job.updatedAt))}</TableCell>
                  <TableCell className="pr-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" onClick={(event) => { event.stopPropagation(); handleResume(job) }}><Play /> Resume</Button>
                      <AlertDialog open={deletingId === job.id} onOpenChange={(open) => setDeletingId(open ? job.id : null)}>
                        <AlertDialogTrigger asChild>
                          <Button size="icon-sm" variant="ghost" className="text-destructive hover:text-destructive" aria-label={`Delete draft ${display(job.refNo)}`} title="Delete draft" onClick={(event) => event.stopPropagation()}><Trash2 /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this draft?</AlertDialogTitle>
                            <AlertDialogDescription>"{job.subject}" will be permanently removed. This cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction variant="destructive" onClick={() => handleDelete(job.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
