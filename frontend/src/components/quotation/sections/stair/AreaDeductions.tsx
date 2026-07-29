import { useQuotationStore } from '@/stores/quotation-store'
import type { AreaDeductionDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField } from '@/components/quotation/shared/SelectField'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Scissors, Plus, Trash2 } from 'lucide-react'
import {
  AREA_DEDUCTION_TYPE_OPTIONS,
  AREA_DEDUCTION_FOR_OPTIONS,
  buildLocationOptions,
} from './stairOptions'

export function AreaDeductions() {
  const { areaDeductions, mezzanine, setStair } = useQuotationStore(
    useShallow((s) => ({ areaDeductions: s.stair.areaDeductions, mezzanine: s.mezzanine, setStair: s.setStair })),
  )

  const locationOptions = buildLocationOptions(mezzanine)

  const addRow = () => setStair({ areaDeductions: [...areaDeductions, {}] })
  const removeRow = (index: number) => setStair({ areaDeductions: areaDeductions.filter((_, i) => i !== index) })
  const updateRow = (index: number, patch: Partial<AreaDeductionDraft>) =>
    setStair({ areaDeductions: areaDeductions.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <SectionCard icon={<Scissors className="w-3.5 h-3.5" />} title="Area Deductions">
      <div className="flex flex-col gap-[18px] desktop:gap-6">
        {areaDeductions.length === 0 && (
          <EmptyState
            icon={<Scissors />}
            title="No area deductions added yet."
            description="Add a deduction to subtract it from the stair area."
          />
        )}

        {areaDeductions.length > 0 && (
          <Table className="min-w-[1000px] border-collapse text-sm">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead scope="col" className="w-12 border-r text-center">SL</TableHead>
                <TableHead scope="col" className="min-w-36 border-r">Type</TableHead>
                <TableHead scope="col" className="min-w-32 border-r">Location</TableHead>
                <TableHead scope="col" className="min-w-32 border-r text-center">Area</TableHead>
                <TableHead scope="col" className="min-w-32 border-r text-center">Numbers</TableHead>
                <TableHead scope="col" className="min-w-56" aria-label="Row actions" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {areaDeductions.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="border-r text-center text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="border-r">
                    <SelectField className="[&>label]:sr-only" label="Type" options={AREA_DEDUCTION_TYPE_OPTIONS} required={false} error={false} value={row.type} onChange={(value) => updateRow(index, { type: value as AreaDeductionDraft['type'] })} />
                  </TableCell>
                  <TableCell className="border-r">
                    <SelectField className="[&>label]:sr-only" label="Location" options={locationOptions} required={false} error={false} value={row.location} onChange={(value) => updateRow(index, { location: value })} />
                  </TableCell>
                  <TableCell className="border-r">
                    <NumberField className="[&>label]:sr-only" label="Area" unit="m2" required={false} error={false} value={row.areaM2} onChange={(value) => updateRow(index, { areaM2: value })} />
                  </TableCell>
                  <TableCell className="border-r">
                    <NumberField className="[&>label]:sr-only" label="Numbers" unit="count" step={1} required={false} error={false} value={row.numbers} onChange={(value) => updateRow(index, { numbers: value })} />
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-56 items-end gap-2">
                      <SelectField className="min-w-44 [&>label]:sr-only" label="Deduction For" options={AREA_DEDUCTION_FOR_OPTIONS} required={false} error={false} value={row.deductionFor} onChange={(value) => updateRow(index, { deductionFor: value as AreaDeductionDraft['deductionFor'] })} />
                      <Button type="button" variant="ghost" size="icon" className="shrink-0" aria-label={`Remove deduction ${index + 1}`} title={`Remove deduction ${index + 1}`} onClick={() => removeRow(index)}>
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus /> Add deduction
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
