import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { deriveRateBreakdown } from '@floreat/shared/calc'
import { useRateHydration } from '@/hooks/useRateHydration'
import { useCreateRate } from '@/api/quotation/rate/postRate'
import { useUpdateRate } from '@/api/quotation/rate/putRate'
import type { Rate } from '@/api/quotation/rate/getRate'
import { PRICING_FIELDS, type PricingField, type RateRowDraft } from '@/schemas/rate.schema'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Num } from '@/components/ui/num'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { IndianRupee, Save } from 'lucide-react'

/** Short column headers for the eight raw pricing inputs, in `PRICING_FIELDS` order. */
const PRICING_LABELS: Record<PricingField, string> = {
  material: 'Material',
  fabrication: 'Fabrication',
  transportation: 'Transport',
  installation: 'Installation',
  loadingUnloading: 'Loading',
  overheads: 'Overheads',
  others: 'Others',
  marginPercentage: 'Margin %',
}

/** Parse a numeric input into a non-negative number, or `undefined` when blank/invalid. */
const parseNum = (v: string): number | undefined => {
  if (v.trim() === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 ? n : undefined
}

/** Stable dirty-check key for a row — its unit plus the eight pricing values. */
const rowKey = (row: RateRowDraft): string =>
  JSON.stringify([row.unit, ...PRICING_FIELDS.map((f) => row[f] ?? null)])

/** Extracts just the raw pricing components from a row (drops blanks). */
const pricingOf = (row: RateRowDraft): Partial<Record<PricingField, number>> => {
  const out: Partial<Record<PricingField, number>> = {}
  for (const f of PRICING_FIELDS) if (row[f] !== undefined) out[f] = row[f]
  return out
}

/**
 * The Step 10 rate master table — one editable row per rate item. The 35
 * canonical items always render (merged with any saved server pricing); each
 * row exposes the eight raw pricing inputs, previews the four server-derived
 * rates live via `deriveRateBreakdown`, and saves independently (POST for a new
 * item, PUT for an existing one). Rate is global master-data, so edits persist
 * to the shared `/rates` table rather than the per-job draft.
 */
export function RateTable() {
  const { rows: hydratedRows, isLoading, isError } = useRateHydration()
  const createRate = useCreateRate()
  const updateRate = useUpdateRate()

  const [rows, setRows] = useState<RateRowDraft[]>([])
  const [baseline, setBaseline] = useState<Record<string, string>>({})
  const [savingItem, setSavingItem] = useState<string | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorDraft, setEditorDraft] = useState<RateRowDraft | null>(null)
  const seeded = useRef(false)

  // Seed local edit state once, the first time the merged rows arrive.
  useEffect(() => {
    if (seeded.current || isLoading) return
    seeded.current = true
    setRows(hydratedRows)
    setBaseline(Object.fromEntries(hydratedRows.map((r) => [r.item, rowKey(r)])))
  }, [hydratedRows, isLoading])

  const updateRow = (index: number, patch: Partial<RateRowDraft>) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)))

  const openEditor = (index: number) => {
    setEditorDraft(rows[index])
    setEditorOpen(true)
  }

  const closeEditor = () => {
    setEditorOpen(false)
    setEditorDraft(null)
  }

  const updateDraft = (patch: Partial<RateRowDraft>) =>
    setEditorDraft((prev) => (prev ? { ...prev, ...patch } : prev))

  const saveDraftedRow = async () => {
    if (!editorDraft) return
    const saved = await saveRow(editorDraft)
    if (saved) closeEditor()
  }

  const editorPriced = editorDraft ? PRICING_FIELDS.some((f) => editorDraft[f] !== undefined) : false
  const editorDerived = editorDraft ? deriveRateBreakdown(pricingOf(editorDraft)) : null

  const isDirty = (row: RateRowDraft): boolean => baseline[row.item] !== rowKey(row)

  /** Persists one row: PUT when it already has an `id`, POST otherwise. */
  const saveRow = async (row: RateRowDraft): Promise<Rate | null> => {
    setSavingItem(row.item)
    try {
      const saved: Rate = row.id
        ? await updateRate.mutateAsync({ id: row.id, payload: { unit: row.unit, ...pricingOf(row) } })
        : await createRate.mutateAsync({ item: row.item, unit: row.unit, ...pricingOf(row) })
      setRows((prev) => prev.map((r) => (r.item === row.item ? { ...r, id: saved.id, fabricationRate: saved.fabricationRate, erectionRate: saved.erectionRate, loadingRate: saved.loadingRate, totalRate: saved.totalRate } : r)))
      setBaseline((prev) => ({ ...prev, [row.item]: rowKey(row) }))
      toast.success(`${row.item} saved`)
      return saved
    } catch {
      toast.error(`Failed to save ${row.item}`)
      return null
    } finally {
      setSavingItem(null)
    }
  }

  return (
    <SectionCard icon={<IndianRupee />} title="Rate Master">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
          <Spinner /> Loading rates…
        </div>
      ) : isError ? (
        <p className="py-14 text-center text-sm text-destructive">
          Couldn't load the rate master. The 35 defaults are shown; saving will retry the server.
        </p>
      ) : null}

      {!isLoading && (
        <Table className="min-w-[1500px]"> 
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 text-right">#</TableHead>
              <TableHead className="min-w-52">Item</TableHead>
              <TableHead>Unit</TableHead>
              {PRICING_FIELDS.map((f) => (
                <TableHead key={f} className="text-right">{PRICING_LABELS[f]}</TableHead>
              ))}
              <TableHead className="text-right">Fabrication</TableHead>
              <TableHead className="text-right">Erection</TableHead>
              <TableHead className="text-right">Load/Unload</TableHead>
              <TableHead className="text-right">Total Rate</TableHead>
              <TableHead className="w-10" aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => {
              const derived = (row.id && !isDirty(row) && row.fabricationRate !== undefined)
                ? { fabricationRate: row.fabricationRate, erectionRate: row.erectionRate!, loadingRate: row.loadingRate!, totalRate: row.totalRate! }
                : deriveRateBreakdown(pricingOf(row))
              const priced = PRICING_FIELDS.some((f) => row[f] !== undefined)
              const dirty = isDirty(row)
              return (
                <TableRow key={row.item}>
                  <TableCell className="text-right text-muted-foreground">
                    <Num>{index + 1}</Num>
                  </TableCell>
                  <TableCell className="font-medium">
                    <button
                      type="button"
                      className="text-left font-medium text-primary underline-offset-4 hover:underline"
                      onClick={() => openEditor(index)}
                    >
                      {row.item}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.unit}</Badge>
                  </TableCell>
                  {PRICING_FIELDS.map((f) => (
                    <TableCell key={f} className="min-w-24">
                      <Input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        className="text-right font-mono tabular-nums"
                        aria-label={`${row.item} ${PRICING_LABELS[f]}`}
                        value={row[f] ?? ''}
                        onChange={(e) => updateRow(index, { [f]: parseNum(e.target.value) })}
                      />
                    </TableCell>
                  ))}
                  <TableCell className="text-right">{priced ? <Num>{derived.fabricationRate}</Num> : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-right">{priced ? <Num>{derived.erectionRate}</Num> : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-right">{priced ? <Num>{derived.loadingRate}</Num> : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-right font-semibold">{priced ? <Num>{derived.totalRate}</Num> : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant={dirty ? 'default' : 'ghost'}
                      size="icon"
                      disabled={!dirty || savingItem === row.item}
                      aria-label={`Save ${row.item}`}
                      onClick={() => saveRow(row)}
                    >
                      {savingItem === row.item ? <Spinner /> : <Save />}
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={editorOpen} onOpenChange={(open) => !open && closeEditor()}>
        <AlertDialogContent
          size="lg"
          className="max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] overflow-y-auto p-3 sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] sm:p-4 lg:p-5"
        >
          <AlertDialogHeader className="place-items-start text-left">
            <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-1">
                <AlertDialogTitle className="truncate text-lg">
                  {editorDraft?.item ?? 'Edit rate item'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Update the raw pricing inputs. Derived rates refresh before saving.
                </AlertDialogDescription>
              </div>
              {editorDraft ? (
                <div className="flex shrink-0 flex-wrap items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
                  <span className="font-mono text-xs uppercase text-muted-foreground">Unit</span>
                  <Badge variant="outline">{editorDraft.unit}</Badge>
                </div>
              ) : null}
            </div>
          </AlertDialogHeader>

          {editorDraft ? (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)]">
              <section className="min-w-0 rounded-lg border border-border bg-background p-3 sm:p-4">
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Pricing inputs</h3>
                    <p className="text-sm text-muted-foreground">Blank fields are ignored in the rate calculation.</p>
                  </div>
                  <span className="font-mono text-xs uppercase text-muted-foreground">
                    {PRICING_FIELDS.length} fields
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2">
                  {PRICING_FIELDS.map((f) => (
                    <div key={f} className="min-w-0 space-y-2">
                      <label
                        className="block font-mono text-xs uppercase text-muted-foreground"
                        htmlFor={`editor-${f}`}
                      >
                        {PRICING_LABELS[f]}
                      </label>
                      <Input
                        id={`editor-${f}`}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        className="text-right font-mono tabular-nums"
                        aria-label={`${editorDraft.item} ${PRICING_LABELS[f]}`}
                        value={editorDraft[f] ?? ''}
                        onChange={(e) => updateDraft({ [f]: parseNum(e.target.value) })}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <aside className="min-w-0 rounded-lg border border-border bg-muted/40 p-3">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Derived rates</h3>
                    <p className="text-xs text-muted-foreground">Live preview from current inputs.</p>
                  </div>
                  <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[11px] uppercase text-muted-foreground">
                    Preview
                  </span>
                </div>

                <div className="overflow-hidden rounded-lg border border-border bg-background">
                  {[
                    ['Fab. rate', editorDerived?.fabricationRate],
                    ['Erec. rate', editorDerived?.erectionRate],
                    ['Load. rate', editorDerived?.loadingRate],
                    ['Total rate', editorDerived?.totalRate],
                  ].map(([label, value], index, list) => (
                    <div
                      key={label}
                      className={`flex min-h-12 items-center justify-between gap-3 px-3 py-2 ${
                        index < list.length - 1 ? 'border-b border-border' : 'bg-muted/40'
                      }`}
                    >
                      <p className="font-mono text-[11px] uppercase text-muted-foreground">{label}</p>
                      <p className="truncate text-right text-lg font-semibold">
                        {editorPriced ? <Num>{value}</Num> : <span className="text-muted-foreground">—</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          ) : null}

          <AlertDialogFooter className="-mx-3 -mb-3 sm:-mx-4 sm:-mb-4 lg:-mx-5 lg:-mb-5">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="default"
              onClick={saveDraftedRow}
              disabled={!editorDraft || savingItem === editorDraft.item}
            >
              {savingItem === editorDraft?.item ? <Spinner /> : 'Save changes'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SectionCard>
  )
}
