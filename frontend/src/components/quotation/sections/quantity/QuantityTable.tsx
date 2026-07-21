import { useEffect, useRef, useState } from 'react'
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

type SectionKey =
  | 'pebRoof'
  | 'cladding'
  | 'canopy'
  | 'accessories'
  | 'mezzanine'
  | 'stair'
  | 'additionalBolts'

interface RowDef {
  label: string
  unitField: string | null
  qtyField: string
  addlField?: string
  purchField?: string
}

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

const getEditableFields = (rows: RowDef[]): string[] =>
  rows.flatMap((r) => [r.qtyField, r.addlField, r.purchField].filter((f): f is string => !!f))

function SectionTable({ icon, title, rows, sectionData, draft, onEdit, onSave, saving }: SectionTableProps) {
  const isDirty = getEditableFields(rows).some((f) => (draft[f] ?? '') !== String(sectionData?.[f] ?? ''))
  const showAddl = rows.some((r) => r.addlField)
  const showPurch = rows.some((r) => r.purchField)

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
      <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 text-right">#</TableHead>
              <TableHead className="min-w-44">Item</TableHead>
              <TableHead className="min-w-24">Unit</TableHead>
              <TableHead className="min-w-28 text-right">Quantity</TableHead>
              {showAddl && <TableHead className="min-w-28 text-right">Additional</TableHead>}
              {showPurch && <TableHead className="min-w-28 text-right">Purchase</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => {
              const unitVal = row.unitField ? sectionData?.[row.unitField] : null
              return (
                <TableRow key={row.qtyField}>
                  <TableCell className="text-right text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell>
                    {unitVal ? <Badge variant="outline">{String(unitVal)}</Badge> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    <Input type="number" inputMode="decimal" min={0} className="text-right font-mono tabular-nums" value={draft[row.qtyField] ?? ''} onChange={(e) => onEdit(row.qtyField, e.target.value)} aria-label={row.label} />
                  </TableCell>
                  {showAddl && (
                    <TableCell>
                      {row.addlField
                        ? <Input type="number" inputMode="decimal" min={0} className="text-right font-mono tabular-nums" value={draft[row.addlField] ?? ''} onChange={(e) => onEdit(row.addlField!, e.target.value)} aria-label={`${row.label} additional`} />
                        : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                  )}
                  {showPurch && (
                    <TableCell>
                      {row.purchField
                        ? <Input type="number" inputMode="decimal" min={0} className="text-right font-mono tabular-nums" value={draft[row.purchField] ?? ''} onChange={(e) => onEdit(row.purchField!, e.target.value)} aria-label={`${row.label} purchase`} />
                        : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
    </SectionCard>
  )
}

const PEB_ROOF_ROWS: RowDef[] = [
  { label: 'Material with purlin', unitField: 'materialWithPurlinUnit', qtyField: 'materialWithPurlinQuantity' },
  { label: 'Rafters & columns', unitField: 'raftersAndColumnsUnit', qtyField: 'raftersAndColumnsQuantity', addlField: 'raftersAndColumnsAdditionalQuantity' },
  { label: 'Roof purlins', unitField: 'roofPurlinsUnit', qtyField: 'roofPurlinsQuantity', addlField: 'roofPurlinsAdditionalQuantity' },
  { label: 'Roof sheet', unitField: 'roofSheetUnit', qtyField: 'roofSheetQuantity', addlField: 'roofSheetAdditionalQuantity', purchField: 'roofSheetPurchaseQuantity' },
  { label: 'Polycarbonate sheet', unitField: 'polycarbonateSheetUnit', qtyField: 'polycarbonateSheetQuantity', addlField: 'polycarbonateSheetAdditionalQuantity', purchField: 'polycarbonateSheetPurchaseQuantity' },
  { label: 'Roof wind bracings', unitField: 'roofWindBracingsUnit', qtyField: 'roofWindBracingsQuantity', addlField: 'roofWindBracingsAdditionalQuantity' },
  { label: 'Roof sag rod', unitField: 'roofSagRodUnit', qtyField: 'roofSagRodQuantity', addlField: 'roofSagRodAdditionalQuantity' },
  { label: 'Roof flange brace', unitField: 'roofFlangeBraceUnit', qtyField: 'roofFlangeBraceQuantity', addlField: 'roofFlangeBraceAdditionalQuantity' },
  { label: 'Purlin bolts', unitField: 'purlinBoltsUnit', qtyField: 'purlinBoltsQuantity' },
  { label: 'Roof joint bolts', unitField: 'roofJointBoltsUnit', qtyField: 'roofJointBoltsQuantity' },
  { label: 'Foundation bolts', unitField: 'foundationBoltsUnit', qtyField: 'foundationBoltsQuantity' },
  { label: 'Anchor bolts', unitField: 'anchorBoltsUnit', qtyField: 'anchorBoltsQuantity' },
]

const CLADDING_ROWS: RowDef[] = [
  { label: 'Cladding structure', unitField: 'claddingStructureUnit', qtyField: 'claddingStructureQuantity', addlField: 'claddingStructureAdditionalQuantity' },
  { label: 'Cladding sheet', unitField: 'claddingSheetUnit', qtyField: 'claddingSheetQuantity', purchField: 'claddingSheetPurchaseQuantity' },
  { label: 'Column wind bracings', unitField: 'columnWindBracingsUnit', qtyField: 'columnWindBracingsQuantity' },
  { label: 'Cladding sag rod', unitField: 'claddingSagRodUnit', qtyField: 'claddingSagRodQuantity' },
  { label: 'Cladding flange brace', unitField: 'claddingFlangeBraceUnit', qtyField: 'claddingFlangeBraceQuantity' },
  { label: 'Cladding purlin bolts', unitField: 'claddingPurlinBoltsUnit', qtyField: 'claddingPurlinBoltsQuantity' },
]

const CANOPY_ROWS: RowDef[] = [
  { label: 'Structure', unitField: 'structureUnit', qtyField: 'structureQuantity' },
  { label: 'Purlin', unitField: 'purlinUnit', qtyField: 'purlinQuantity' },
  { label: 'Sheet', unitField: 'sheetUnit', qtyField: 'sheetQuantity', purchField: 'sheetPurchaseQuantity' },
  { label: 'Gutter', unitField: 'gutterUnit', qtyField: 'gutterQuantity' },
  { label: 'Down take', unitField: 'downTakeUnit', qtyField: 'downTakeQuantity' },
  { label: 'Side covering', unitField: 'sideCoveringUnit', qtyField: 'sideCoveringQuantity' },
  { label: 'Flashing', unitField: 'flashingUnit', qtyField: 'flashingQuantity' },
  { label: 'Purlin bolts', unitField: 'purlinBoltsUnit', qtyField: 'purlinBoltsQuantity' },
  { label: 'Joint bolts', unitField: 'jointBoltsUnit', qtyField: 'jointBoltsQuantity' },
]

const ACCESSORIES_ROWS: RowDef[] = [
  { label: 'Doors', unitField: 'doorsCountUnit', qtyField: 'doorsCount' },
  { label: 'Windows', unitField: 'windowsCountUnit', qtyField: 'windowsCount' },
  { label: 'Fascia structure', unitField: 'fasciaStructureUnit', qtyField: 'fasciaStructureQuantity' },
  { label: 'Fascia covering sheet', unitField: 'fasciaCoveringSheetUnit', qtyField: 'fasciaCoveringSheetQuantity' },
  { label: 'Internal partitions', unitField: 'internalPartitionsUnit', qtyField: 'internalPartitionsQuantity' },
  { label: 'Ridge', unitField: 'ridgeUnit', qtyField: 'ridgeQuantity' },
  { label: 'Gutter', unitField: 'gutterUnit', qtyField: 'gutterQuantity' },
  { label: 'Down take', unitField: 'downTakeUnit', qtyField: 'downTakeQuantity' },
  { label: 'Drip trim', unitField: 'dripTrimUnit', qtyField: 'dripTrimQuantity' },
  { label: 'Gable end flashing', unitField: 'gableEndFlashingUnit', qtyField: 'gableEndFlashingQuantity' },
  { label: 'Corner flash', unitField: 'cornerFlashCountUnit', qtyField: 'cornerFlashCount' },
  { label: 'Rolling shutter', unitField: 'rollingShutterCountUnit', qtyField: 'rollingShutterCount' },
  { label: 'Louvers', unitField: 'louversCountUnit', qtyField: 'louversCount' },
  { label: 'Sky light', unitField: 'skyLightCountUnit', qtyField: 'skyLightCount' },
  { label: 'Wall light', unitField: 'wallLightCountUnit', qtyField: 'wallLightCount' },
  { label: 'Roof insulation', unitField: 'roofInsulationUnit', qtyField: 'roofInsulationQuantity' },
  { label: 'Wall insulation', unitField: 'wallInsulationUnit', qtyField: 'wallInsulationQuantity' },
  { label: 'Turbo ventilators', unitField: 'turboVentilatorsUnit', qtyField: 'turboVentilatorsQuantity' },
  { label: 'Handrail', unitField: 'handrailUnit', qtyField: 'handrailQuantity' },
]

const MEZZANINE_ROWS: RowDef[] = [
  { label: 'Structure', unitField: 'structureUnit', qtyField: 'structureQuantity', addlField: 'structureAdditionalQuantity' },
  { label: 'Deck sheet', unitField: 'deckSheetUnit', qtyField: 'deckSheetQuantity', addlField: 'deckSheetAdditionalQuantity', purchField: 'deckSheetPurchaseQuantity' },
  { label: 'Shear studs', unitField: 'shearStudsUnit', qtyField: 'shearStudsQuantity' },
  { label: 'Concrete flashing', unitField: 'concreteFlashingUnit', qtyField: 'concreteFlashingQuantity' },
  { label: 'Joint bolts', unitField: null, qtyField: 'jointBoltsQuantity' },
  { label: 'Foundation bolts', unitField: null, qtyField: 'foundationBoltsQuantity' },
]

const STAIR_ROWS: RowDef[] = [
  { label: 'Total area', unitField: 'totalAreaUnit', qtyField: 'totalAreaQuantity' },
  { label: 'Stringer beams', unitField: 'stringerBeamsUnit', qtyField: 'stringerBeamsQuantity', addlField: 'stringerBeamsAdditionalQuantity' },
  { label: 'Steps', unitField: 'stepsUnit', qtyField: 'stepsQuantity', addlField: 'stepsAdditionalQuantity' },
]

const ADDITIONAL_BOLTS_ROWS: RowDef[] = [
  { label: 'Joint bolt 24mm HSFG', unitField: 'jointBolt24mmHsfgUnit', qtyField: 'jointBolt24mmHsfgQuantity' },
  { label: 'Joint bolt 20mm HSFG', unitField: 'jointBolt20mmHsfgUnit', qtyField: 'jointBolt20mmHsfgQuantity' },
  { label: 'Joint bolt 16mm HSFG', unitField: 'jointBolt16mmHsfgUnit', qtyField: 'jointBolt16mmHsfgQuantity' },
  { label: 'Purlin bolt 12mm ordinary', unitField: 'purlinBolt12mmOrdinaryUnit', qtyField: 'purlinBolt12mmOrdinaryQuantity' },
  { label: 'Anchor bolt', unitField: 'anchorBoltUnit', qtyField: 'anchorBoltQuantity' },
  { label: 'Foundation bolt', unitField: 'foundationBoltUnit', qtyField: 'foundationBoltQuantity' },
]

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
    const seed = (obj: Record<string, unknown> | null | undefined, rows: RowDef[]) =>
      Object.fromEntries(getEditableFields(rows).map((f) => [f, toStr(obj?.[f])]))
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
