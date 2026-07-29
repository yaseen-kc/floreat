import { useQuotationStore } from '@/stores/quotation-store'
import type { CanopyItemDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField } from '@/components/quotation/shared/SelectField'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tent, Plus, Trash2 } from 'lucide-react'
import {
  CANOPY_HEIGHT_FROM_OPTIONS,
  CANOPY_SHEET_TYPE_OPTIONS,
} from './canopyOptions'

export function CanopyItems() {
  const { canopies, setCanopy } = useQuotationStore(
    useShallow((s) => ({ canopies: s.canopy.canopies, setCanopy: s.setCanopy })),
  )

  // Codes are reassigned CANOPY_1..CANOPY_n by position on every add/remove.
  const withCodes = (rows: CanopyItemDraft[]): CanopyItemDraft[] =>
    rows.map((row, i) => ({ ...row, code: `CANOPY_${i + 1}` as CanopyItemDraft['code'] }))

  const addRow = () => {
    if (canopies.length >= 10) return
    setCanopy({ canopies: withCodes([...canopies, {}]) })
  }
  const removeRow = (index: number) => setCanopy({ canopies: withCodes(canopies.filter((_, i) => i !== index)) })
  const updateRow = (index: number, patch: Partial<CanopyItemDraft>) =>
    setCanopy({ canopies: canopies.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <SectionCard icon={<Tent className="w-3.5 h-3.5" />} title="Canopy Items">
      <div className="flex flex-col gap-[18px] desktop:gap-6">
        {canopies.length === 0 && (
          <EmptyState
            icon={<Tent />}
            title="No canopy items added yet."
            description="Add a canopy to include it in this quotation."
          />
        )}

        {canopies.length > 0 && (
          <Table className="min-w-[2700px] border-collapse text-sm">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead scope="col" className="w-12 border-r text-center">Sl</TableHead>
                <TableHead scope="col" className="min-w-36 border-r">ID</TableHead>
                <TableHead scope="col" className="min-w-28 border-r text-center">Length (M)</TableHead>
                <TableHead scope="col" className="min-w-28 border-r text-center">Width (M)</TableHead>
                <TableHead scope="col" className="min-w-28 border-r text-center">Height (M)</TableHead>
                <TableHead scope="col" className="min-w-36 border-r">Height From</TableHead>
                <TableHead scope="col" className="min-w-48 border-r text-center">Material Consumption (Kg/Sqft)</TableHead>
                <TableHead scope="col" className="min-w-36 border-r text-center">Number Of Beams</TableHead>
                <TableHead scope="col" className="min-w-32 border-r text-center">No.of Purlins</TableHead>
                <TableHead scope="col" className="min-w-32 border-r text-center">Purlin Depth</TableHead>
                <TableHead scope="col" className="min-w-44 border-r text-center">Unit Weight Of Purlin</TableHead>
                <TableHead scope="col" className="min-w-32 border-r">Canopy Sheet</TableHead>
                <TableHead scope="col" className="min-w-28 border-r text-center">Sheet Thick</TableHead>
                <TableHead scope="col" className="min-w-24 border-r text-center">Gutter</TableHead>
                <TableHead scope="col" className="min-w-28 border-r text-center">Down Take</TableHead>
                <TableHead scope="col" className="min-w-52 border-r text-center">Canopy Side Covering Height(M)</TableHead>
                <TableHead scope="col" className="min-w-24 text-center">Flashing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {canopies.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="border-r text-center text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="border-r">
                    <div className="flex items-center gap-1">
                      <span className="sr-only">Canopy {index + 1}</span>
                      <span className="font-mono text-xs font-medium">{row.code ?? `CANOPY_${index + 1}`}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-auto shrink-0"
                        aria-label={`Remove canopy ${index + 1}`}
                        title={`Remove canopy ${index + 1}`}
                        onClick={() => removeRow(index)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="border-r"><NumberField className="[&>label]:sr-only" label="Length" unit="m" required={false} error={false} value={row.length} onChange={(value) => updateRow(index, { length: value })} /></TableCell>
                  <TableCell className="border-r"><NumberField className="[&>label]:sr-only" label="Width" unit="m" required={false} error={false} value={row.width} onChange={(value) => updateRow(index, { width: value })} /></TableCell>
                  <TableCell className="border-r"><NumberField className="[&>label]:sr-only" label="Height" unit="m" required={false} error={false} value={row.height} onChange={(value) => updateRow(index, { height: value })} /></TableCell>
                  <TableCell className="border-r"><SelectField className="[&>label]:sr-only" label="Height From" options={CANOPY_HEIGHT_FROM_OPTIONS} required={false} error={false} value={row.heightFrom} onChange={(value) => updateRow(index, { heightFrom: value as CanopyItemDraft['heightFrom'] })} /></TableCell>
                  <TableCell className="border-r"><NumberField className="[&>label]:sr-only" label="Material Consumption" unit="kg/sqft" required={false} error={false} value={row.materialConsumptionKgPerSqft} onChange={(value) => updateRow(index, { materialConsumptionKgPerSqft: value })} /></TableCell>
                  <TableCell className="border-r"><NumberField className="[&>label]:sr-only" label="Number Of Beams" unit="count" step={1} required={false} error={false} value={row.numberOfBeams} onChange={(value) => updateRow(index, { numberOfBeams: value })} /></TableCell>
                  <TableCell className="border-r"><NumberField className="[&>label]:sr-only" label="No.of Purlins" unit="count" step={1} required={false} error={false} value={row.numberOfPurlins} onChange={(value) => updateRow(index, { numberOfPurlins: value })} /></TableCell>
                  <TableCell className="border-r"><NumberField className="[&>label]:sr-only" label="Purlin Depth" unit="m" required={false} error={false} value={row.purlinDepth} onChange={(value) => updateRow(index, { purlinDepth: value })} /></TableCell>
                  <TableCell className="border-r"><NumberField className="[&>label]:sr-only" label="Unit Weight Of Purlin" unit="kg/m" required={false} error={false} value={row.unitWeightOfPurlin} onChange={(value) => updateRow(index, { unitWeightOfPurlin: value })} /></TableCell>
                  <TableCell className="border-r"><SelectField className="[&>label]:sr-only" label="Canopy Sheet" options={CANOPY_SHEET_TYPE_OPTIONS} required={false} error={false} value={row.canopySheet} onChange={(value) => updateRow(index, { canopySheet: value as CanopyItemDraft['canopySheet'] })} /></TableCell>
                  <TableCell className="border-r"><NumberField className="[&>label]:sr-only" label="Sheet Thick" unit="mm" required={false} error={false} value={row.sheetThick} onChange={(value) => updateRow(index, { sheetThick: value })} /></TableCell>
                  <TableCell className="border-r text-center"><Switch checked={row.gutter === true} onCheckedChange={(checked) => updateRow(index, { gutter: checked })} aria-label={`Gutter for canopy ${index + 1}`} /></TableCell>
                  <TableCell className="border-r text-center"><Switch checked={row.downTake === true} onCheckedChange={(checked) => updateRow(index, { downTake: checked })} aria-label={`Down Take for canopy ${index + 1}`} /></TableCell>
                  <TableCell className="border-r"><NumberField className="[&>label]:sr-only" label="Canopy Side Covering Height" unit="m" required={false} error={false} value={row.canopySideCoveringHeight} onChange={(value) => updateRow(index, { canopySideCoveringHeight: value })} /></TableCell>
                  <TableCell className="text-center"><Switch checked={row.flashing === true} onCheckedChange={(checked) => updateRow(index, { flashing: checked })} aria-label={`Flashing for canopy ${index + 1}`} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow} disabled={canopies.length >= 10}>
            <Plus /> Add canopy
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
