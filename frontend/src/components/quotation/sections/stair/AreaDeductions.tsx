import { useQuotationStore } from '@/stores/quotation-store'
import type { AreaDeductionDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { RowCard, type RowGroup } from '@/components/quotation/shared/RowCard'
import { Button } from '@/components/ui/button'
import { Scissors, Plus } from 'lucide-react'
import {
  AREA_DEDUCTION_TYPE_OPTIONS,
  AREA_DEDUCTION_FOR_OPTIONS,
  buildLocationOptions,
} from './stairOptions'
import type { SelectFieldOption } from '@/components/quotation/shared/SelectField'

/** Grouped field layout for an area-deduction row. `location` options are injected per render. */
const deductionGroups = (locationOptions: SelectFieldOption[]): RowGroup[] => [
  {
    title: 'Classification',
    fields: [
      { kind: 'select', name: 'type', label: 'Type', options: AREA_DEDUCTION_TYPE_OPTIONS },
      { kind: 'select', name: 'location', label: 'Location', options: locationOptions },
      { kind: 'select', name: 'deductionFor', label: 'Deduction For', options: AREA_DEDUCTION_FOR_OPTIONS },
    ],
  },
  {
    title: 'Measurement',
    fields: [
      { kind: 'number', name: 'areaM2', label: 'Area', unit: 'm²' },
      { kind: 'number', name: 'numbers', label: 'Numbers', unit: 'count', step: 1 },
    ],
  },
]

export function AreaDeductions() {
  const { areaDeductions, mezzanine, setStair } = useQuotationStore(
    useShallow((s) => ({ areaDeductions: s.stair.areaDeductions, mezzanine: s.mezzanine, setStair: s.setStair })),
  )

  const groups = deductionGroups(buildLocationOptions(mezzanine))

  const addRow = () => setStair({ areaDeductions: [...areaDeductions, {}] })
  const removeRow = (index: number) =>
    setStair({ areaDeductions: areaDeductions.filter((_, i) => i !== index) })
  const updateRow = (index: number, patch: Partial<AreaDeductionDraft>) =>
    setStair({ areaDeductions: areaDeductions.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <SectionCard icon={<Scissors className="w-3.5 h-3.5" />} title="Area Deductions">
      <div className="flex flex-col gap-[18px]">
        {areaDeductions.length === 0 && <p className="text-muted-foreground text-sm">No area deductions added yet.</p>}

        {areaDeductions.map((row, index) => (
          <RowCard
            key={index}
            title={`Deduction ${index + 1}`}
            groups={groups}
            values={row as Record<string, number | string | undefined>}
            onChange={(patch) => updateRow(index, patch as Partial<AreaDeductionDraft>)}
            onRemove={() => removeRow(index)}
          />
        ))}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus /> Add deduction
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
