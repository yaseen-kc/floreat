import { useQuotationStore } from '@/stores/quotation-store'
import type { AccessoryFoldedPlateDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { RowCard, type RowGroup } from '@/components/quotation/shared/RowCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Rows3, Plus } from 'lucide-react'

const FOLDED_PLATE_GROUPS: RowGroup[] = [
  {
    title: 'Dimensions',
    fields: [
      { kind: 'number', name: 'length', label: 'Length', unit: 'm' },
      { kind: 'number', name: 'width', label: 'Width', unit: 'm' },
      { kind: 'number', name: 'nos', label: 'Nos', unit: 'count', step: 1 },
    ],
  },
]

/** Repeating folded-plate line items for Step 6. `quantity` is server-derived (not shown). */
export function FoldedPlates() {
  const { foldedPlates, setAccessories } = useQuotationStore(
    useShallow((s) => ({ foldedPlates: s.accessories.foldedPlates, setAccessories: s.setAccessories })),
  )

  const addRow = () => setAccessories({ foldedPlates: [...foldedPlates, {}] })
  const removeRow = (index: number) =>
    setAccessories({ foldedPlates: foldedPlates.filter((_, i) => i !== index) })
  const updateRow = (index: number, patch: Partial<AccessoryFoldedPlateDraft>) =>
    setAccessories({ foldedPlates: foldedPlates.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <SectionCard icon={<Rows3 className="w-3.5 h-3.5" />} title="Folded Plates">
      <div className="flex flex-col gap-[18px] desktop:gap-6">
        {foldedPlates.length === 0 && (
          <EmptyState
            icon={<Rows3 />}
            title="No folded plates added yet."
            description="Add a folded plate to include it in this quotation."
          />
        )}

        {foldedPlates.map((row, index) => (
          <RowCard
            key={index}
            title={`Folded Plate ${index + 1}`}
            groups={FOLDED_PLATE_GROUPS}
            values={row as Record<string, number | string | boolean | undefined>}
            onChange={(patch) => updateRow(index, patch as Partial<AccessoryFoldedPlateDraft>)}
            onRemove={() => removeRow(index)}
          />
        ))}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus /> Add folded plate
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
