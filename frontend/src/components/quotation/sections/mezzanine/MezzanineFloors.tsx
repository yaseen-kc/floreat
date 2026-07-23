import { useQuotationStore } from '@/stores/quotation-store'
import type { MezzanineFloorDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Button } from '@/components/ui/button'
import { Layers3, Plus } from 'lucide-react'
import { RowCard, type RowGroup } from '@/components/quotation/shared/RowCard'
import { EmptyState } from '@/components/ui/empty-state'
import {
  MEZZANINE_TYPE_OPTIONS,
  MEZZANINE_FLOOR_LEVEL_OPTIONS,
  MEZZANINE_HEIGHT_FROM_OPTIONS,
} from './mezzanineOptions'

/** Grouped field layout for a mezzanine floor row (identity badge handled separately). */
const FLOOR_GROUPS: RowGroup[] = [
  {
    title: 'Classification',
    fields: [
      { kind: 'select', name: 'floor', label: 'Floor Level', options: MEZZANINE_FLOOR_LEVEL_OPTIONS },
      { kind: 'select', name: 'type', label: 'Type', options: MEZZANINE_TYPE_OPTIONS },
      { kind: 'select', name: 'heightFrom', label: 'Height From', options: MEZZANINE_HEIGHT_FROM_OPTIONS },
    ],
  },
  {
    title: 'Dimensions',
    fields: [
      { kind: 'number', name: 'thicknessMm', label: 'Thickness', unit: 'mm' },
      { kind: 'number', name: 'lengthM', label: 'Length', unit: 'm' },
      { kind: 'number', name: 'widthM', label: 'Width', unit: 'm' },
      { kind: 'number', name: 'heightM', label: 'Height', unit: 'm' },
      { kind: 'number', name: 'materialConsumptionKgPerSqft', label: 'Material Consumption', unit: 'kg/sqft' },
    ],
  },
  {
    title: 'Beams',
    fields: [
      { kind: 'number', name: 'beamsMidPrimary', label: 'Mid Primary', unit: 'count', step: 1 },
      { kind: 'number', name: 'beamsEndPrimary', label: 'End Primary', unit: 'count', step: 1 },
      { kind: 'number', name: 'beamsSecondary', label: 'Secondary', unit: 'count', step: 1 },
    ],
  },
  {
    title: 'Joints in Beams',
    fields: [
      { kind: 'number', name: 'jointsMidPrimary', label: 'Mid Primary', unit: 'count', step: 1 },
      { kind: 'number', name: 'jointsEndPrimary', label: 'End Primary', unit: 'count', step: 1 },
    ],
  },
  {
    title: 'Internal Columns',
    fields: [
      { kind: 'number', name: 'internalColumnsMidPrimary', label: 'Mid Primary', unit: 'count', step: 1 },
      { kind: 'number', name: 'internalColumnsEndPrimary', label: 'End Primary', unit: 'count', step: 1 },
    ],
  },
]

export function MezzanineFloors() {
  const { floors, setMezzanine } = useQuotationStore(
    useShallow((s) => ({ floors: s.mezzanine.floors, setMezzanine: s.setMezzanine })),
  )

  // ponytail: codes are reassigned MEZ_1..MEZ_n by position on every add/remove.
  const withCodes = (rows: MezzanineFloorDraft[]): MezzanineFloorDraft[] =>
    rows.map((row, i) => ({ ...row, code: `MEZ_${i + 1}` as MezzanineFloorDraft['code'] }))

  const addRow = () => {
    if (floors.length >= 12) return
    setMezzanine({ floors: withCodes([...floors, {}]) })
  }
  const removeRow = (index: number) => setMezzanine({ floors: withCodes(floors.filter((_, i) => i !== index)) })
  const updateRow = (index: number, patch: Partial<MezzanineFloorDraft>) =>
    setMezzanine({ floors: floors.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <SectionCard icon={<Layers3 className="w-3.5 h-3.5" />} title="Floors">
      <div className="flex flex-col gap-[18px] desktop:gap-6">
        {floors.length === 0 && (
          <EmptyState
            icon={<Layers3 />}
            title="No floors added yet."
            description="Add a mezzanine floor to include it in this quotation."
          />
        )}

        {floors.map((row, index) => (
          <RowCard
            key={index}
            title={`Floor ${index + 1}`}
            badge={row.code}
            groups={FLOOR_GROUPS}
            values={row as Record<string, number | string | undefined>}
            onChange={(patch) => updateRow(index, patch as Partial<MezzanineFloorDraft>)}
            onRemove={() => removeRow(index)}
          />
        ))}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow} disabled={floors.length >= 12}>
            <Plus /> Add floor
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
