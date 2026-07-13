import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField, type SelectFieldOption } from '@/components/quotation/shared/SelectField'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Fence, Plus, Trash2 } from 'lucide-react'

/** A single sidewall row in the draft (inline `sidewalls` array element). */
type SidewallRow = NonNullable<RoofDraft['sidewalls']>[number]

/** Human-readable labels for the sidewall side enum. */
const SIDE_OPTIONS: SelectFieldOption[] = [
  { value: 'FRONT', label: 'Front' },
  { value: 'BACK', label: 'Back' },
  { value: 'RIGHT', label: 'Right' },
  { value: 'LEFT', label: 'Left' },
]

/** Human-readable labels for the wall-type enum. */
const WALL_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'BRICK', label: 'Brick' },
  { value: 'PANEL', label: 'Panel' },
  { value: 'LATERITE', label: 'Laterite' },
  { value: 'AAC', label: 'AAC' },
  { value: 'BLOCK', label: 'Block' },
]

/** A fresh sidewall row — numeric fields start at 0 so validation flags them. */
const newRow = (): SidewallRow => ({ side: 'FRONT', wallType: 'BRICK', thickness: 0, height: 0 })

export function Sidewalls() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.sidewalls,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const rows = roof.sidewalls ?? []

  const addRow = () => setRoof({ sidewalls: [...rows, newRow()] })
  const removeRow = (index: number) => setRoof({ sidewalls: rows.filter((_, i) => i !== index) })
  const updateRow = (index: number, patch: Partial<SidewallRow>) =>
    setRoof({ sidewalls: rows.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <CollapsibleSection
      icon={<Fence className="w-3.5 h-3.5" />}
      title="Sidewalls"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('sidewalls', e)}
    >
      <div className="flex flex-col gap-[18px] desktop:gap-6">
        {rows.length === 0 && (
          <EmptyState
            icon={<Fence />}
            title="No sidewalls added yet."
            description="Add a sidewall to include it in the roof."
          />
        )}

        {rows.map((row, index) => (
          <div key={index} className="border border-border rounded-[12px] p-[18px] max-[640px]:p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground">Sidewall {index + 1}</span>
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                aria-label={`Remove sidewall ${index + 1}`}
                onClick={() => removeRow(index)}
              >
                <Trash2 />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] desktop:gap-6">
              <SelectField
                label="Side"
                options={SIDE_OPTIONS}
                required
                error={false}
                value={row.side}
                onChange={(v) => updateRow(index, { side: v as SidewallRow['side'] })}
              />
              <SelectField
                label="Wall Type"
                options={WALL_TYPE_OPTIONS}
                required
                error={false}
                value={row.wallType}
                onChange={(v) => updateRow(index, { wallType: v as SidewallRow['wallType'] })}
              />
              <NumberField
                label="Thickness"
                unit="mm"
                required
                error={showValidation && !(row.thickness > 0)}
                value={row.thickness}
                onChange={(v) => updateRow(index, { thickness: v ?? 0 })}
              />
              <NumberField
                label="Height"
                unit="m"
                required
                error={showValidation && !(row.height > 0)}
                value={row.height}
                onChange={(v) => updateRow(index, { height: v ?? 0 })}
              />
            </div>
          </div>
        ))}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus /> Add sidewall
          </Button>
        </div>
      </div>
    </CollapsibleSection>
  )
}
