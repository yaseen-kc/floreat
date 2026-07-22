import { useEffect, useRef, useState, Fragment } from 'react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { useQuotationStore } from '@/stores/quotation-store'
import { ApiError } from '@/lib/api'
import { useQuantity } from '@/api/quotation/quantity/getQuantity'
import { useUpsertQuantity } from '@/api/quotation/quantity/postQuantity'
import type { CreateQuantityPayload } from '@/api/quotation/quantity/postQuantity'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Layers, LayoutGrid, Umbrella, Wrench, Layers2, MoveUpRight, Nut, Save } from 'lucide-react'
import type { RowDef } from './QuantityTableTypes'
import { PEB_ROOF_ROWS, CLADDING_ROWS, CANOPY_ROWS, ACCESSORIES_ROWS, MEZZANINE_ROWS, STAIR_ROWS, ADDITIONAL_BOLTS_ROWS } from './quantity-data'

type SectionKey =
  | 'pebRoof'
  | 'cladding'
  | 'canopy'
  | 'accessories'
  | 'mezzanine'
  | 'stair'
  | 'additionalBolts'

interface SectionTableProps {
  icon: ReactNode
  title: string
  rows: RowDef[]
  sectionData: Record<string, string | number | boolean | null | undefined> | null
  draft: Record<string, string>
  onEdit: (field: string, value: string) => void
  onSave: () => void
  saving: boolean
}

const getEditableFields = (rows: RowDef[]): string[] => {
  return rows.flatMap(r => {
    const fields = [r.qtyField];
    if (r.subRows) {
      r.subRows.forEach(sub => {
        if (sub.addlField) fields.push(sub.addlField);
        if (sub.purchField) fields.push(sub.purchField);
      });
    }
    return fields.filter(Boolean);
  });
}

function SectionTable({ icon, title, rows, sectionData, draft, onEdit, onSave, saving }: SectionTableProps) {
  const isDirty = getEditableFields(rows).some((f) => (draft[f] ?? '') !== String(sectionData?.[f] ?? ''))

  return (
    <SectionCard
      icon={icon}
      title={title}
      action={
        <Button type="button" size="sm" variant={isDirty ? 'default' : 'ghost'} disabled={!isDirty || saving} onClick={onSave}>
          {saving ? <Spinner /> : <Save className="h-3.5 w-3.5" />}
          Save
        </Button>
      }
    >
      <Table className="min-w-[1000px] border-collapse text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50 border-b">
            <TableHead className="w-12 border-r">SL No.</TableHead>
            <TableHead colSpan={2} className="min-w-44 border-r">DESCRIPTION</TableHead>
            <TableHead colSpan={3} className="min-w-44 border-r">SPECIFICATION</TableHead>
            <TableHead className="w-20 border-r text-center">UNIT</TableHead>
            <TableHead className="w-32 text-right">QUANTITY</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => {
            const unitVal = (row.unitField && sectionData?.[row.unitField]) || row.unit;
            const unitDisplay = unitVal ? <Badge variant="outline">{String(unitVal)}</Badge> : <span className="text-muted-foreground">—</span>;
            
            return (
              <Fragment key={row.qtyField}>
                <TableRow className="border-b">
                  <TableCell className="border-r font-medium text-muted-foreground">{row.sl}</TableCell>
                  {row.labelPrefix ? (
                    <Fragment>
                      <TableCell className="border-r font-semibold text-center">{row.labelPrefix}</TableCell>
                      <TableCell className="border-r font-semibold">{row.label.toUpperCase()}</TableCell>
                    </Fragment>
                  ) : row.labelSuffix ? (
                    <Fragment>
                      <TableCell className="border-r font-semibold">{row.label.toUpperCase()}</TableCell>
                      <TableCell className="border-r font-semibold text-center">{row.labelSuffix}</TableCell>
                    </Fragment>
                  ) : (
                    <TableCell colSpan={2} className="border-r font-semibold">{row.label.toUpperCase()}</TableCell>
                  )}
                  {row.addlSpec ? (
                    <Fragment>
                      <TableCell className="border-r font-mono text-xs">{row.spec}</TableCell>
                      <TableCell className="border-r text-center">{row.unit}</TableCell>
                      <TableCell className="border-r text-center font-medium text-muted-foreground whitespace-nowrap">{row.addlSpec}</TableCell>
                      <TableCell className="border-r text-center">{row.addlUnit}</TableCell>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <TableCell colSpan={row.specValue ? 2 : 3} className="border-r font-mono text-xs">{row.spec || '—'}</TableCell>
                      {row.specValue && <TableCell className="border-r text-center font-medium text-muted-foreground whitespace-nowrap">{row.specValue}</TableCell>}
                      <TableCell className="border-r text-center">{unitDisplay}</TableCell>
                    </Fragment>
                  )}
                  <TableCell className="text-right p-1 align-middle">
                    <Input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      className="text-right font-mono tabular-nums h-8"
                      value={draft[row.qtyField] ?? ''}
                      onChange={(e) => onEdit(row.qtyField, e.target.value)}
                      aria-label={row.label}
                    />
                  </TableCell>
                </TableRow>
                {(row.subRows || []).map((sub, j) => (
                  <TableRow key={j} className="border-b bg-muted/5">
                    <TableCell className="border-r text-center text-muted-foreground">{sub.sl}</TableCell>
                    <TableCell colSpan={2} className="border-r">{sub.desc}</TableCell>
                    {sub.addlSpec ? (
                      <Fragment>
                        <TableCell colSpan={sub.unit ? 1 : 2} className="border-r font-mono text-xs">{sub.spec}</TableCell>
                        {sub.unit && <TableCell className="border-r text-center">{sub.unit}</TableCell>}
                        <TableCell className="border-r text-center font-medium text-muted-foreground whitespace-nowrap">{sub.addlSpec}</TableCell>
                        <TableCell className="border-r text-center">{sub.addlUnit}</TableCell>
                        <TableCell className="text-right p-1 align-middle">
                          {sub.addlField && (
                            <Input
                              type="number"
                              inputMode="decimal"
                              min={0}
                              className="text-right font-mono tabular-nums h-8"
                              value={draft[sub.addlField] ?? ''}
                              onChange={(e) => onEdit(sub.addlField, e.target.value)}
                              aria-label={`${sub.desc} additional`}
                            />
                          )}
                        </TableCell>
                      </Fragment>
                    ) : sub.spec === 'PURCHASE QUANTITY' ? (
                      <Fragment>
                        <TableCell colSpan={3} className="border-r text-center font-semibold text-muted-foreground">{sub.spec}</TableCell>
                        <TableCell className="border-r text-center">{sub.unit}</TableCell>
                        <TableCell className="text-right p-1 align-middle">
                          {sub.purchField && (
                            <Input
                              type="number"
                              inputMode="decimal"
                              min={0}
                              className="text-right font-mono tabular-nums h-8"
                              value={draft[sub.purchField] ?? ''}
                              onChange={(e) => onEdit(sub.purchField, e.target.value)}
                              aria-label={`${sub.desc} purchase`}
                            />
                          )}
                        </TableCell>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <TableCell className="border-r font-mono text-xs">{sub.spec}</TableCell>
                        <TableCell colSpan={2} className="border-r text-center">{sub.unit}</TableCell>
                        <TableCell className="border-r"></TableCell>
                        <TableCell></TableCell>
                      </Fragment>
                    )}
                  </TableRow>
                ))}
              </Fragment>
            )
          })}
        </TableBody>
      </Table>
    </SectionCard>
  )
}

type SectionDrafts = Record<SectionKey, Record<string, string>>

const EMPTY_DRAFTS: SectionDrafts = {
  pebRoof: {}, cladding: {}, canopy: {}, accessories: {}, mezzanine: {}, stair: {}, additionalBolts: {},
}

const EMPTY_SAVING: Record<SectionKey, boolean> = {
  pebRoof: false, cladding: false, canopy: false, accessories: false, mezzanine: false, stair: false, additionalBolts: false,
}

const toStr = (v: unknown): string => (v == null ? '' : String(v))

export function QuantityTable() {
  const jobId = useQuotationStore((s) => s.jobId)
  const { data: quantity, isLoading, isError, error } = useQuantity(jobId ?? '')
  const notFound = error instanceof ApiError && error.status === 404
  const upsertQuantity = useUpsertQuantity()
  const [drafts, setDrafts] = useState<SectionDrafts>(EMPTY_DRAFTS)
  const [saving, setSaving] = useState<Record<SectionKey, boolean>>(EMPTY_SAVING)
  const seeded = useRef(false)

  useEffect(() => {
    if (!quantity || seeded.current) return
    seeded.current = true

    const getDefaults = (rows: RowDef[]) => {
      const defs: Record<string, string | number> = {}
      rows.forEach(r => {
        if (r.qtyField && r.defaultQty !== undefined) defs[r.qtyField] = r.defaultQty
        r.subRows?.forEach(sub => {
          if (sub.addlField && sub.defaultQty !== undefined) defs[sub.addlField] = sub.defaultQty
          if (sub.purchField && sub.defaultQty !== undefined) defs[sub.purchField] = sub.defaultQty
        })
      })
      return defs
    }

    const seed = (obj: Record<string, unknown> | null | undefined, rows: RowDef[]) => {
      const defs = getDefaults(rows)
      return Object.fromEntries(getEditableFields(rows).map((f) => [f, toStr(obj?.[f] ?? defs[f])]))
    }
    
    setDrafts({
      pebRoof: seed(quantity.pebRoof as unknown as Record<string, unknown>, PEB_ROOF_ROWS),
      cladding: seed(quantity.cladding as unknown as Record<string, unknown>, CLADDING_ROWS),
      canopy: seed(quantity.canopy as unknown as Record<string, unknown>, CANOPY_ROWS),
      accessories: seed(quantity.accessories as unknown as Record<string, unknown>, ACCESSORIES_ROWS),
      mezzanine: seed(quantity.mezzanine as unknown as Record<string, unknown>, MEZZANINE_ROWS),
      stair: seed(quantity.stair as unknown as Record<string, unknown>, STAIR_ROWS),
      additionalBolts: seed(quantity.additionalBolts as unknown as Record<string, unknown>, ADDITIONAL_BOLTS_ROWS),
    })
  }, [quantity])

  const editSection = (key: SectionKey) => (field: string, value: string) =>
    setDrafts((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }))

  const saveSection = async (key: SectionKey) => {
    if (!jobId) return
    setSaving((prev) => ({ ...prev, [key]: true }))
    const parseVal = (v: string) => (v === '' ? null : Number(v))
    const sectionPayload = Object.fromEntries(Object.entries(drafts[key]).map(([k, v]) => [k, parseVal(v)]))
    try {
      await upsertQuantity.mutateAsync({ jobId, payload: { [key]: sectionPayload } as CreateQuantityPayload })
      toast.success('Section saved')
    } catch {
      toast.error('Failed to save section')
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }))
    }
  }

  if (!jobId) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No active job. Start a quotation to view quantities.</p>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
        <Spinner /> Loading quantities…
      </div>
    )
  }

  if (isError && !notFound) {
    return <p className="py-14 text-center text-sm text-destructive">Couldn't load quantity data.</p>
  }

  const sd = (section: unknown) =>
    section as Record<string, string | number | boolean | null | undefined> | null

  return (
    <div className="space-y-6">
      <SectionTable icon={<Layers />} title="PEB Roof" rows={PEB_ROOF_ROWS} sectionData={sd(quantity?.pebRoof)} draft={drafts.pebRoof} onEdit={editSection('pebRoof')} onSave={() => saveSection('pebRoof')} saving={saving.pebRoof} />
      <SectionTable icon={<LayoutGrid />} title="Cladding" rows={CLADDING_ROWS} sectionData={sd(quantity?.cladding)} draft={drafts.cladding} onEdit={editSection('cladding')} onSave={() => saveSection('cladding')} saving={saving.cladding} />
      <SectionTable icon={<Umbrella />} title="Canopy" rows={CANOPY_ROWS} sectionData={sd(quantity?.canopy)} draft={drafts.canopy} onEdit={editSection('canopy')} onSave={() => saveSection('canopy')} saving={saving.canopy} />
      <SectionTable icon={<Wrench />} title="Accessories" rows={ACCESSORIES_ROWS} sectionData={sd(quantity?.accessories)} draft={drafts.accessories} onEdit={editSection('accessories')} onSave={() => saveSection('accessories')} saving={saving.accessories} />
      <SectionTable icon={<Layers2 />} title="Mezzanine" rows={MEZZANINE_ROWS} sectionData={sd(quantity?.mezzanine)} draft={drafts.mezzanine} onEdit={editSection('mezzanine')} onSave={() => saveSection('mezzanine')} saving={saving.mezzanine} />
      <SectionTable icon={<MoveUpRight />} title="Stair" rows={STAIR_ROWS} sectionData={sd(quantity?.stair)} draft={drafts.stair} onEdit={editSection('stair')} onSave={() => saveSection('stair')} saving={saving.stair} />
      <SectionTable icon={<Nut />} title="Additional Bolts" rows={ADDITIONAL_BOLTS_ROWS} sectionData={sd(quantity?.additionalBolts)} draft={drafts.additionalBolts} onEdit={editSection('additionalBolts')} onSave={() => saveSection('additionalBolts')} saving={saving.additionalBolts} />
    </div>
  )
}
