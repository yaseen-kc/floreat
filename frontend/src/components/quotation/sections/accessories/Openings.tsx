import { useQuotationStore } from '@/stores/quotation-store'
import type { AccessoryOpeningDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { RowCard, type RowGroup } from '@/components/quotation/shared/RowCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Blinds, Plus } from 'lucide-react'
import { ACCESSORY_OPENING_KIND_OPTIONS } from './accessoriesOptions'

const OPENING_GROUPS: RowGroup[] = [
  {
    title: 'Classification',
    fields: [
      { kind: 'select', name: 'kind', label: 'Kind', options: ACCESSORY_OPENING_KIND_OPTIONS },
    ],
  },
  {
    title: 'Dimensions',
    fields: [
      { kind: 'number', name: 'length', label: 'Length', unit: 'm' },
      { kind: 'number', name: 'width', label: 'Width', unit: 'm' },
      { kind: 'number', name: 'nos', label: 'Nos', unit: 'count', step: 1 },
    ],
  },
]

/** Repeating opening line items for Step 6 — `kind` is required. `quantity` is server-derived (not shown). */
export function Openings() {
  const { openings, setAccessories } = useQuotationStore(
    useShallow((s) => ({ openings: s.accessories.openings, setAccessories: s.setAccessories })),
  )

  const addRow = () => setAccessories({ openings: [...openings, {}] })
  const removeRow = (index: number) => setAccessories({ openings: openings.filter((_, i) => i !== index) })
  const updateRow = (index: number, patch: Partial<AccessoryOpeningDraft>) =>
    setAccessories({ openings: openings.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <SectionCard icon={<Blinds className="w-3.5 h-3.5" />} title="Openings">
      <div className="flex flex-col gap-[18px] desktop:gap-6">
        {openings.length === 0 && (
          <EmptyState
            icon={<Blinds />}
            title="No openings added yet."
            description="Add an opening (rolling shutter, louver, sky light, wall light) to include it."
          />
        )}

        {openings.map((row, index) => (
          <RowCard
            key={index}
            title={`Opening ${index + 1}`}
            groups={OPENING_GROUPS}
            values={row as Record<string, number | string | boolean | undefined>}
            onChange={(patch) => updateRow(index, patch as Partial<AccessoryOpeningDraft>)}
            onRemove={() => removeRow(index)}
          />
        ))}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus /> Add opening
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
