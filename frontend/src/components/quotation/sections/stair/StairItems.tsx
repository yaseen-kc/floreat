import { useQuotationStore } from '@/stores/quotation-store'
import type { StairItemDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField } from '@/components/quotation/shared/SelectField'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Footprints, Plus, Trash2 } from 'lucide-react'
import {
  STAIR_STEP_TYPE_OPTIONS,
  STAIR_FLOOR_LEVEL_OPTIONS,
  STAIR_STRINGER_TYPE_OPTIONS,
  buildLocationOptions,
} from './stairOptions'

export function StairItems() {
  const { stairs, mezzanine, setStair } = useQuotationStore(
    useShallow((s) => ({ stairs: s.stair.stairs, mezzanine: s.mezzanine, setStair: s.setStair })),
  )

  const locationOptions = buildLocationOptions(mezzanine)

  // Codes are reassigned STAIR_1..STAIR_n by position on every add/remove.
  const withCodes = (rows: StairItemDraft[]): StairItemDraft[] =>
    rows.map((row, i) => ({ ...row, code: `STAIR_${i + 1}` as StairItemDraft['code'] }))

  const addRow = () => {
    if (stairs.length >= 12) return
    setStair({ stairs: withCodes([...stairs, {}]) })
  }
  const removeRow = (index: number) => setStair({ stairs: withCodes(stairs.filter((_, i) => i !== index)) })
  const updateRow = (index: number, patch: Partial<StairItemDraft>) =>
    setStair({ stairs: stairs.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <SectionCard icon={<Footprints className="w-3.5 h-3.5" />} title="Staircases">
      <div className="flex flex-col gap-[18px] desktop:gap-6">
        {stairs.length === 0 && (
          <EmptyState
            icon={<Footprints />}
            title="No staircases added yet."
            description="Add a staircase to include it in this quotation."
          />
        )}

        {stairs.length > 0 && (
          <Table className="min-w-[1850px] border-collapse text-sm">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead scope="col" className="w-12 border-r text-center">SL</TableHead>
                <TableHead scope="col" className="min-w-32 border-r">ID</TableHead>
                <TableHead scope="col" className="min-w-36 border-r">Type Of Step</TableHead>
                <TableHead scope="col" className="min-w-32 border-r">Location</TableHead>
                <TableHead scope="col" className="min-w-36 border-r">Starting From</TableHead>
                <TableHead scope="col" className="min-w-36 border-r">Ending Upto</TableHead>
                <TableHead scope="col" className="min-w-28 border-r text-center">Length (M)</TableHead>
                <TableHead scope="col" className="min-w-28 border-r text-center">Width (M)</TableHead>
                <TableHead scope="col" className="min-w-28 border-r text-center">Height (M)</TableHead>
                <TableHead scope="col" className="min-w-36 border-r text-center">No of Mid Stringer</TableHead>
                <TableHead scope="col" className="min-w-40 border-r">Type of Stringer</TableHead>
                <TableHead scope="col" className="min-w-44 text-center">Unit Weight Of Stringer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stairs.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="border-r text-center text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="border-r">
                    <div className="flex items-center gap-1">
                      <span className="sr-only">Staircase {index + 1}</span>
                      <span className="font-mono text-xs font-medium">{row.code ?? `STAIR_${index + 1}`}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-auto shrink-0"
                        aria-label={`Remove staircase ${index + 1}`}
                        title={`Remove staircase ${index + 1}`}
                        onClick={() => removeRow(index)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="border-r">
                    <SelectField className="[&>label]:sr-only" label="Type Of Step" options={STAIR_STEP_TYPE_OPTIONS} required={false} error={false} value={row.typeOfStep} onChange={(value) => updateRow(index, { typeOfStep: value as StairItemDraft['typeOfStep'] })} />
                  </TableCell>
                  <TableCell className="border-r">
                    <SelectField className="[&>label]:sr-only" label="Location" options={locationOptions} required={false} error={false} value={row.location} onChange={(value) => updateRow(index, { location: value })} />
                  </TableCell>
                  <TableCell className="border-r">
                    <SelectField className="[&>label]:sr-only" label="Starting From" options={STAIR_FLOOR_LEVEL_OPTIONS} required={false} error={false} value={row.startingFrom} onChange={(value) => updateRow(index, { startingFrom: value as StairItemDraft['startingFrom'] })} />
                  </TableCell>
                  <TableCell className="border-r">
                    <SelectField className="[&>label]:sr-only" label="Ending Upto" options={STAIR_FLOOR_LEVEL_OPTIONS} required={false} error={false} value={row.endingUpTo} onChange={(value) => updateRow(index, { endingUpTo: value as StairItemDraft['endingUpTo'] })} />
                  </TableCell>
                  <TableCell className="border-r">
                    <NumberField className="[&>label]:sr-only" label="Length" unit="m" required={false} error={false} value={row.length} onChange={(value) => updateRow(index, { length: value })} />
                  </TableCell>
                  <TableCell className="border-r">
                    <NumberField className="[&>label]:sr-only" label="Width" unit="m" required={false} error={false} value={row.width} onChange={(value) => updateRow(index, { width: value })} />
                  </TableCell>
                  <TableCell className="border-r">
                    <NumberField className="[&>label]:sr-only" label="Height" unit="m" required={false} error={false} value={row.height} onChange={(value) => updateRow(index, { height: value })} />
                  </TableCell>
                  <TableCell className="border-r">
                    <NumberField className="[&>label]:sr-only" label="No of Mid Stringer" unit="count" step={1} required={false} error={false} value={row.numberOfMidLanding} onChange={(value) => updateRow(index, { numberOfMidLanding: value })} />
                  </TableCell>
                  <TableCell className="border-r">
                    <SelectField className="[&>label]:sr-only" label="Type of Stringer" options={STAIR_STRINGER_TYPE_OPTIONS} required={false} error={false} value={row.typeOfStringer} onChange={(value) => updateRow(index, { typeOfStringer: value as StairItemDraft['typeOfStringer'] })} />
                  </TableCell>
                  <TableCell>
                    <NumberField className="[&>label]:sr-only" label="Unit Weight Of Stringer" unit="kg/m" required={false} error={false} value={row.unitWeightOfStringer} onChange={(value) => updateRow(index, { unitWeightOfStringer: value })} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow} disabled={stairs.length >= 12}>
            <Plus /> Add staircase
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
