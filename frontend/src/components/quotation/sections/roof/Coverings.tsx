import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField, type SelectFieldOption } from '@/components/quotation/shared/SelectField'
import { Layers } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'

/** Human-readable labels for the covering-type enum. */
const COVERING_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'BARE_GALVALUME', label: 'Bare Galvalume' },
  { value: 'PPGL', label: 'PPGL' },
  { value: 'PUFF_SHEET', label: 'Puff Sheet' },
  { value: 'OTHER', label: 'Other' },
]

type CoveringTypeField = 'roofCoveringType' | 'claddingCoveringType'
type CoveringNumberField = 'roofCoveringThickness' | 'claddingCoveringThickness' | 'roofAreaDeduction'

const NUMBER_FIELDS: { name: CoveringNumberField; label: string; unit: string }[] = [
  { name: 'roofCoveringThickness', label: 'Roof Covering Thickness', unit: 'mm' },
  { name: 'claddingCoveringThickness', label: 'Cladding Covering Thickness', unit: 'mm' },
  { name: 'roofAreaDeduction', label: 'Roof Area Deduction', unit: 'm²' },
]

export function Coverings() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.coverings,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof) : {}

  const setType = (name: CoveringTypeField) => (v: string) => {
    const patch: Partial<RoofDraft> = {}
    patch[name] = v as RoofDraft[CoveringTypeField]
    setRoof(patch)
  }

  return (
    <CollapsibleSection
      icon={<Layers className="w-3.5 h-3.5" />}
      title="Coverings"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('coverings', e)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        <SelectField
          label="Roof Covering Type"
          options={COVERING_TYPE_OPTIONS}
          required={isRequired('roofCoveringType')}
          value={roof.roofCoveringType}
          error={Boolean(errors.roofCoveringType)}
          onChange={setType('roofCoveringType')}
        />
        <SelectField
          label="Cladding Covering Type"
          options={COVERING_TYPE_OPTIONS}
          required={isRequired('claddingCoveringType')}
          value={roof.claddingCoveringType}
          error={Boolean(errors.claddingCoveringType)}
          onChange={setType('claddingCoveringType')}
        />
        {NUMBER_FIELDS.map(({ name, label, unit }) => (
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
