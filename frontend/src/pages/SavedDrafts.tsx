import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Folder } from 'lucide-react'
import { useJobs, type Job } from '@/api/quotation/jobs/getJobs'
import { useDeleteJob } from '@/api/quotation/jobs/deleteJobs'
import { useQuotationStore } from '@/stores/quotation-store'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table'
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog'

export default function SavedDrafts() {
  const navigate = useNavigate()
  const { data, isLoading } = useJobs(1, 50)
  const deleteJob = useDeleteJob()
  const currentJobId = useQuotationStore((s) => s.jobId)
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

  function handleDelete(id: string) {
    if (id === currentJobId) useQuotationStore.getState().resetQuotation()
    deleteJob.mutate(id, { onSettled: () => setDeletingId(null) })
  }

  const jobs = data?.data ?? []

  return (
    <div className="mx-auto w-full max-w-[var(--container-max)] p-[var(--s7)] max-[560px]:p-[var(--s4)]">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-[-0.025em] text-foreground">Saved Drafts</h1>
        <p className="text-sm text-muted-foreground">Quotations in progress.</p>
      </header>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      )}

      {!isLoading && jobs.length === 0 && (
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <EmptyState
            icon={<Folder />}
            title="No drafts yet."
            description="Start a new quotation and it will appear here."
          />
        </div>
      )}

      {!isLoading && jobs.length > 0 && (
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project No</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <span className="font-mono text-xs text-foreground">{job.projectNo}</span>
                    {job.id === currentJobId && (
                      <Badge variant="outline" className="ml-2 text-xs">In progress</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-foreground">{job.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{job.clientName ?? '—'}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{job.date}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {new Date(job.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" onClick={() => handleResume(job)}>Resume</Button>
                      <AlertDialog open={deletingId === job.id} onOpenChange={(open) => setDeletingId(open ? job.id : null)}>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this draft?</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{job.subject}" will be permanently removed. This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction variant="destructive" onClick={() => handleDelete(job.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
