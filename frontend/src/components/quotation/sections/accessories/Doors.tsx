import { useQuotationStore } from '@/stores/quotation-store'
import type { AccessoryDoorDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { RowCard, type RowGroup } from '@/components/quotation/shared/RowCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { DoorOpen, Plus } from 'lucide-react'

const DOOR_GROUPS: RowGroup[] = [
  {
    title: 'Dimensions',
    fields: [
      { kind: 'number', name: 'height', label: 'Height', unit: 'm' },
      { kind: 'number', name: 'width', label: 'Width', unit: 'm' },
      { kind: 'number', name: 'nos', label: 'Nos', unit: 'count', step: 1 },
    ],
  },
]

/** Repeating door line items for Step 6. `quantity` is server-derived (not shown). */
export function Doors() {
  const { doors, setAccessories } = useQuotationStore(
    useShallow((s) => ({ doors: s.accessories.doors, setAccessories: s.setAccessories })),
  )

  const addRow = () => setAccessories({ doors: [...doors, {}] })
  const removeRow = (index: number) => setAccessories({ doors: doors.filter((_, i) => i !== index) })
  const updateRow = (index: number, patch: Partial<AccessoryDoorDraft>) =>
    setAccessories({ doors: doors.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <SectionCard icon={<DoorOpen className="w-3.5 h-3.5" />} title="Doors">
      <div className="flex flex-col gap-[18px] desktop:gap-6">
        {doors.length === 0 && (
          <EmptyState
            icon={<DoorOpen />}
            title="No doors added yet."
            description="Add a door to include it in this quotation."
          />
        )}

        {doors.map((row, index) => (
          <RowCard
            key={index}
            title={`Door ${index + 1}`}
            groups={DOOR_GROUPS}
            values={row as Record<string, number | string | boolean | undefined>}
            onChange={(patch) => updateRow(index, patch as Partial<AccessoryDoorDraft>)}
            onRemove={() => removeRow(index)}
          />
        ))}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus /> Add door
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
