import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { Spline } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { ROOF_SECTION_FIELDS } from '@/stores/quotation-store'

type SagRodField = 'diaOfRoofSagRod' | 'diaOfCladdingSagRod'

const FIELDS: { name: SagRodField; label: string; unit: string }[] = [
  { name: 'diaOfRoofSagRod', label: 'Roof SAG Rod Diameter', unit: 'mm' },
  { name: 'diaOfCladdingSagRod', label: 'Cladding SAG Rod Diameter', unit: 'mm' },
]

export function SagRod() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.sagRod,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof) : {}
  const sectionError = ROOF_SECTION_FIELDS.sagRod.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<Spline className="w-3.5 h-3.5" />}
      title="SAG Rod"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('sagRod', e)}
      error={sectionError}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        {FIELDS.map(({ name, label, unit }) => (
          <NumberField
            key={name}
            label={label}
            unit={unit}
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
