import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, FileText, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuotations, type Quotation } from '@/api/quotation/quotation/getQuotation'
import { ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

const PAGE_SIZE = 10
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
const date = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

function display(value: string | null | undefined) {
  return value?.trim() || '-'
}

function matchesSearch(quotation: Quotation, search: string) {
  if (!search.trim()) return true
  const job = quotation.job
  return [job.refNo, job.clientName, job.firmName, job.projectNo, job.subject]
    .some((value) => value?.toLowerCase().includes(search.trim().toLowerCase()))
}

export default function Quotations() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { data, isLoading, isError, error, refetch } = useQuotations(page, PAGE_SIZE)
  const quotations = useMemo(
    () => (data?.data ?? []).filter((quotation) => quotation.grandTotal !== null && matchesSearch(quotation, search)),
    [data?.data, search],
  )
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE))

  return (
    <div className="mx-auto w-full max-w-[var(--container-max)] p-[var(--s7)] max-[560px]:p-[var(--s4)]">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Workspace / Completed</p>
          <h1 className="text-2xl font-semibold tracking-[-0.025em] text-foreground">Quotations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data ? `${data.total} completed quotation${data.total === 1 ? '' : 's'}.` : 'Completed quotations.'}
          </p>
        </div>
      </header>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1) }}
            placeholder="Search reference, client, project or subject"
            aria-label="Search quotations"
            className="pl-8"
          />
        </div>
      </div>

      {isLoading && <div className="flex items-center justify-center py-16" role="status" aria-label="Loading quotations"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}

      {isError && (
        <div className="rounded-lg border border-danger/30 bg-danger-soft px-6 py-10 text-center">
          <p className="font-medium text-foreground">Quotations could not be loaded.</p>
          <p className="mt-1 text-sm text-muted-foreground">{error instanceof ApiError ? error.message : 'Check your connection and try again.'}</p>
          <Button className="mt-4" variant="outline" onClick={() => refetch()}>Try again</Button>
        </div>
      )}

      {!isLoading && !isError && data?.total === 0 && (
        <div className="rounded-lg border border-border bg-card shadow-sm"><EmptyState icon={<FileText />} title="No completed quotations yet." description="Completed quotations will appear here once a total has been calculated." /></div>
      )}

      {!isLoading && !isError && data && data.total > 0 && quotations.length === 0 && (
        <div className="rounded-lg border border-border bg-card shadow-sm"><EmptyState icon={<Search />} title="No quotations match this search." description="Try a different reference, client, project, or subject." /></div>
      )}

      {!isLoading && !isError && quotations.length > 0 && (
        <>
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <Table className="min-w-[780px]">
              <TableHeader className="bg-surface-2">
                <TableRow>
                  <TableHead className="pl-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Ref</TableHead>
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Client / Project</TableHead>
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Type</TableHead>
                  <TableHead className="text-right font-mono text-xs uppercase tracking-wider text-muted-foreground">Value</TableHead>
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Updated</TableHead>
                  <TableHead className="pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((quotation) => {
                  const job = quotation.job
                  const client = display(job.clientName || job.firmName)
                  const project = `${display(job.projectNo)} / ${display(job.subject)}`
                  const quotationPath = `/quotations/${quotation.jobId}`
                  const openQuotation = () => navigate(quotationPath)
                  return <TableRow
                    key={quotation.id}
                    tabIndex={0}
                    className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                    aria-label={`Open quotation ${display(job.refNo)} for ${client}, project ${project}`}
                    onClick={openQuotation}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        openQuotation()
                      }
                    }}
                  >
                    <TableCell className="pl-4 font-mono text-sm font-medium text-primary">{display(job.refNo)}</TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{client}</div>
                      <div className="mt-0.5 text-sm text-muted-foreground">{display(job.projectNo)} / {display(job.firmName)}</div>
                    </TableCell>
                    <TableCell><span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">{display(job.frameType)}</span><div className="mt-1 text-xs text-muted-foreground">{display(job.configuration)}</div></TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium tabular-nums">{currency.format(quotation.grandTotal ?? 0)}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{date.format(new Date(quotation.updatedAt))}</TableCell>
                    <TableCell className="pr-4"><span className="inline-flex items-center gap-1.5 rounded-4xl bg-success-soft px-2 py-1 text-xs font-medium text-success"><span className="size-1.5 rounded-full bg-success" aria-hidden="true" />Completed</span></TableCell>
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} aria-label="Previous page"><ChevronLeft /> Previous</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} aria-label="Next page">Next <ChevronRight /></Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
