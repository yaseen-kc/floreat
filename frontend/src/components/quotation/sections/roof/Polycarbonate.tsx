import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { PanelTop } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { ROOF_SECTION_FIELDS } from '@/stores/quotation-store'

type PolycarbonateField =
  | 'polycarbonateRoofLength'
  | 'polycarbonateRoofWidth'
  | 'polycarbonateRoofCount'

const FIELDS: { name: PolycarbonateField; label: string; unit: string; step?: number }[] = [
  { name: 'polycarbonateRoofLength', label: 'Polycarbonate Roof Length', unit: 'm' },
  { name: 'polycarbonateRoofWidth', label: 'Polycarbonate Roof Width', unit: 'm' },
  { name: 'polycarbonateRoofCount', label: 'Polycarbonate Roof Count', unit: 'count', step: 1 },
]

export function Polycarbonate() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.polycarbonate,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof) : {}
  const sectionError = ROOF_SECTION_FIELDS.polycarbonate.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<PanelTop className="w-3.5 h-3.5" />}
      title="Polycarbonate"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('polycarbonate', e)}
      error={sectionError}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] desktop:gap-6">
        {FIELDS.map(({ name, label, unit, step }) => (
          <NumberField
            key={name}
            label={label}
            unit={unit}
            step={step}
            required={isRequired(name)}
            value={roof[name]}
            error={Boolean(errors[name])}
            onChange={(v) => {
              const patch: Partial<RoofDraft> = {}
              patch[name] = v
              setRoof(patch)
            }}
          />
        ))}
      </div>
    </CollapsibleSection>
  )
}
