import { useQuotationStore } from '@/stores/quotation-store'
import type { AccessoryWindowDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { RowCard, type RowGroup } from '@/components/quotation/shared/RowCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { AppWindow, Plus } from 'lucide-react'

const WINDOW_GROUPS: RowGroup[] = [
  {
    title: 'Dimensions',
    fields: [
      { kind: 'number', name: 'height', label: 'Height', unit: 'm' },
      { kind: 'number', name: 'width', label: 'Width', unit: 'm' },
      { kind: 'number', name: 'nos', label: 'Nos', unit: 'count', step: 1 },
    ],
  },
]

/** Repeating window line items for Step 6. `quantity` is server-derived (not shown). */
export function Windows() {
  const { windows, setAccessories } = useQuotationStore(
    useShallow((s) => ({ windows: s.accessories.windows, setAccessories: s.setAccessories })),
  )

  const addRow = () => setAccessories({ windows: [...windows, {}] })
  const removeRow = (index: number) => setAccessories({ windows: windows.filter((_, i) => i !== index) })
  const updateRow = (index: number, patch: Partial<AccessoryWindowDraft>) =>
    setAccessories({ windows: windows.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <SectionCard icon={<AppWindow className="w-3.5 h-3.5" />} title="Windows">
      <div className="flex flex-col gap-[18px]">
        {windows.length === 0 && (
          <EmptyState
            icon={<AppWindow />}
            title="No windows added yet."
            description="Add a window to include it in this quotation."
          />
        )}

        {windows.map((row, index) => (
          <RowCard
            key={index}
            title={`Window ${index + 1}`}
            groups={WINDOW_GROUPS}
            values={row as Record<string, number | string | boolean | undefined>}
            onChange={(patch) => updateRow(index, patch as Partial<AccessoryWindowDraft>)}
            onRemove={() => removeRow(index)}
          />
        ))}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus /> Add window
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
