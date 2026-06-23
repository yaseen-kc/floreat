import { useQuotationStore } from '@/stores/quotation-store'
import type { StairItemDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { RowCard, type RowGroup } from '@/components/quotation/shared/RowCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Footprints, Plus } from 'lucide-react'
import {
  STAIR_STEP_TYPE_OPTIONS,
  STAIR_FLOOR_LEVEL_OPTIONS,
  STAIR_STRINGER_TYPE_OPTIONS,
  buildLocationOptions,
} from './stairOptions'
import type { SelectFieldOption } from '@/components/quotation/shared/SelectField'

/** Grouped field layout for a staircase row. `location` options are injected per render. */
const stairGroups = (locationOptions: SelectFieldOption[]): RowGroup[] => [
  {
    title: 'Classification',
    fields: [
      { kind: 'select', name: 'typeOfStep', label: 'Type of Step', options: STAIR_STEP_TYPE_OPTIONS },
      { kind: 'select', name: 'location', label: 'Location', options: locationOptions },
      { kind: 'select', name: 'startingFrom', label: 'Starting From', options: STAIR_FLOOR_LEVEL_OPTIONS },
      { kind: 'select', name: 'endingUpTo', label: 'Ending Up To', options: STAIR_FLOOR_LEVEL_OPTIONS },
      { kind: 'select', name: 'typeOfStringer', label: 'Type of Stringer', options: STAIR_STRINGER_TYPE_OPTIONS },
    ],
  },
  {
    title: 'Dimensions',
    fields: [
      { kind: 'number', name: 'length', label: 'Length', unit: 'm' },
      { kind: 'number', name: 'width', label: 'Width', unit: 'm' },
      { kind: 'number', name: 'height', label: 'Height', unit: 'm' },
      { kind: 'number', name: 'numberOfMidLanding', label: 'Mid Landings', unit: 'count', step: 1 },
      { kind: 'number', name: 'unitWeightOfStringer', label: 'Unit Weight of Stringer', unit: 'kg/m' },
    ],
  },
]

export function StairItems() {
  const { stairs, mezzanine, setStair } = useQuotationStore(
    useShallow((s) => ({ stairs: s.stair.stairs, mezzanine: s.mezzanine, setStair: s.setStair })),
  )

  const groups = stairGroups(buildLocationOptions(mezzanine))

  // ponytail: codes are reassigned STAIR-1..STAIR-n by position on every add/remove.
  const withCodes = (rows: StairItemDraft[]): StairItemDraft[] =>
    rows.map((row, i) => ({ ...row, code: `STAIR-${i + 1}` }))

  const addRow = () => setStair({ stairs: withCodes([...stairs, {}]) })
  const removeRow = (index: number) => setStair({ stairs: withCodes(stairs.filter((_, i) => i !== index)) })
  const updateRow = (index: number, patch: Partial<StairItemDraft>) =>
    setStair({ stairs: stairs.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <SectionCard icon={<Footprints className="w-3.5 h-3.5" />} title="Staircases">
      <div className="flex flex-col gap-[18px]">
        {stairs.length === 0 && (
          <EmptyState
            icon={<Footprints />}
            title="No staircases added yet."
            description="Add a staircase to include it in this quotation."
          />
        )}

        {stairs.map((row, index) => (
          <RowCard
            key={index}
            title={`Staircase ${index + 1}`}
            badge={row.code}
            groups={groups}
            values={row as Record<string, number | string | undefined>}
            onChange={(patch) => updateRow(index, patch as Partial<StairItemDraft>)}
            onRemove={() => removeRow(index)}
          />
        ))}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus /> Add staircase
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
