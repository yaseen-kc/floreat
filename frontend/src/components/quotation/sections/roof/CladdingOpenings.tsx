import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { DoorOpen } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { ROOF_SECTION_FIELDS } from '@/stores/quotation-store'

type CladdingOpeningField =
  | 'frontCladdingOpeningArea'
  | 'backCladdingOpeningArea'
  | 'rightCladdingOpeningArea'
  | 'leftCladdingOpeningArea'

const FIELDS: { name: CladdingOpeningField; label: string }[] = [
  { name: 'frontCladdingOpeningArea', label: 'Front Cladding Opening Area' },
  { name: 'backCladdingOpeningArea', label: 'Back Cladding Opening Area' },
  { name: 'rightCladdingOpeningArea', label: 'Right Cladding Opening Area' },
  { name: 'leftCladdingOpeningArea', label: 'Left Cladding Opening Area' },
]

export function CladdingOpenings() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.claddingOpenings,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof) : {}
  const sectionError = ROOF_SECTION_FIELDS.claddingOpenings.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<DoorOpen className="w-3.5 h-3.5" />}
      title="Cladding Openings"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('claddingOpenings', e)}
      error={sectionError}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] desktop:gap-6">
        {FIELDS.map(({ name, label }) => (
          <NumberField
            key={name}
            label={label}
            unit="m²"
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
