import { useQuotationStore } from '@/stores/quotation-store'
import type { CanopyItemDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { RowCard, type RowGroup } from '@/components/quotation/shared/RowCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Tent, Plus } from 'lucide-react'
import {
  CANOPY_HEIGHT_FROM_OPTIONS,
  CANOPY_SHEET_TYPE_OPTIONS,
} from './canopyOptions'

const CANOPY_GROUPS: RowGroup[] = [
  {
    title: 'Classification',
    fields: [
      { kind: 'select', name: 'heightFrom', label: 'Height From', options: CANOPY_HEIGHT_FROM_OPTIONS },
    ],
  },
  {
    title: 'Dimensions',
    fields: [
      { kind: 'number', name: 'length', label: 'Length', unit: 'm' },
      { kind: 'number', name: 'width', label: 'Width', unit: 'm' },
      { kind: 'number', name: 'height', label: 'Height', unit: 'm' },
      { kind: 'number', name: 'materialConsumptionKgPerSqft', label: 'Material Consumption', unit: 'kg/sqft' },
    ],
  },
  {
    title: 'Members',
    fields: [
      { kind: 'number', name: 'numberOfBeams', label: 'No. of Beams', unit: 'count', step: 1 },
      { kind: 'number', name: 'numberOfPurlins', label: 'No. of Purlins', unit: 'count', step: 1 },
      { kind: 'number', name: 'purlinDepth', label: 'Purlin Depth', unit: 'm' },
      { kind: 'number', name: 'unitWeightOfPurlin', label: 'Unit Weight of Purlin', unit: 'kg/m' },
    ],
  },
  {
    title: 'Covering',
    fields: [
      { kind: 'select', name: 'canopySheet', label: 'Canopy Sheet', options: CANOPY_SHEET_TYPE_OPTIONS },
      { kind: 'number', name: 'sheetThick', label: 'Sheet Thickness', unit: 'mm' },
      { kind: 'number', name: 'canopySideCoveringHeight', label: 'Side Covering Height', unit: 'm' },
    ],
  },
  {
    title: 'Accessories',
    fields: [
      { kind: 'boolean', name: 'gutter', label: 'Gutter' },
      { kind: 'boolean', name: 'downTake', label: 'Down Take' },
      { kind: 'boolean', name: 'flashing', label: 'Flashing' },
    ],
  },
]

export function CanopyItems() {
  const { canopies, setCanopy } = useQuotationStore(
    useShallow((s) => ({ canopies: s.canopy.canopies, setCanopy: s.setCanopy })),
  )

  // ponytail: codes are reassigned CANOPY-1..CANOPY-n by position on every add/remove.
  const withCodes = (rows: CanopyItemDraft[]): CanopyItemDraft[] =>
    rows.map((row, i) => ({ ...row, code: `CANOPY-${i + 1}` }))

  const addRow = () => setCanopy({ canopies: withCodes([...canopies, {}]) })
  const removeRow = (index: number) => setCanopy({ canopies: withCodes(canopies.filter((_, i) => i !== index)) })
  const updateRow = (index: number, patch: Partial<CanopyItemDraft>) =>
    setCanopy({ canopies: canopies.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <SectionCard icon={<Tent className="w-3.5 h-3.5" />} title="Canopy Items">
      <div className="flex flex-col gap-[18px]">
        {canopies.length === 0 && (
          <EmptyState
            icon={<Tent />}
            title="No canopy items added yet."
            description="Add a canopy to include it in this quotation."
          />
        )}

        {canopies.map((row, index) => (
          <RowCard
            key={index}
            title={`Canopy ${index + 1}`}
            badge={row.code}
            groups={CANOPY_GROUPS}
            values={row as Record<string, number | string | boolean | undefined>}
            onChange={(patch) => updateRow(index, patch as Partial<CanopyItemDraft>)}
            onRemove={() => removeRow(index)}
          />
        ))}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus /> Add canopy
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
