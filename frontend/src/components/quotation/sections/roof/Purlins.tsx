import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField, type SelectFieldOption } from '@/components/quotation/shared/SelectField'
import { Columns3 } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { ROOF_SECTION_FIELDS } from '@/stores/quotation-store'

/** Human-readable labels for the purlin material-type enum. */
const PURLIN_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'Z_C', label: 'Z / C Section' },
  { value: 'TUBE', label: 'Tube' },
]

type PurlinTypeField = 'roofPurlinType' | 'claddingPurlinType'
type PurlinNumberField =
  | 'roofPurlinDepth'
  | 'roofPurlinUnitWeight'
  | 'claddingPurlinDepth'
  | 'claddingPurlinUnitWeight'

const NUMBER_FIELDS: { name: PurlinNumberField; label: string; unit: string }[] = [
  { name: 'roofPurlinDepth', label: 'Roof Purlin Depth', unit: 'mm' },
  { name: 'roofPurlinUnitWeight', label: 'Roof Purlin Unit Weight', unit: 'kg/m' },
  { name: 'claddingPurlinDepth', label: 'Cladding Purlin Depth', unit: 'mm' },
  { name: 'claddingPurlinUnitWeight', label: 'Cladding Purlin Unit Weight', unit: 'kg/m' },
]

export function Purlins() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.purlins,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof) : {}
  const sectionError = ROOF_SECTION_FIELDS.purlins.some((f) => Boolean(errors[f]))

  const setType = (name: PurlinTypeField) => (v: string) => {
    const patch: Partial<RoofDraft> = {}
    patch[name] = v as RoofDraft[PurlinTypeField]
    setRoof(patch)
  }

  return (
    <CollapsibleSection
      icon={<Columns3 className="w-3.5 h-3.5" />}
      title="Purlins"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('purlins', e)}
      error={sectionError}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        <SelectField
          label="Roof Purlin Type"
          options={PURLIN_TYPE_OPTIONS}
          required={isRequired('roofPurlinType')}
          value={roof.roofPurlinType}
          error={Boolean(errors.roofPurlinType)}
          onChange={setType('roofPurlinType')}
        />
        <SelectField
          label="Cladding Purlin Type"
          options={PURLIN_TYPE_OPTIONS}
          required={isRequired('claddingPurlinType')}
          value={roof.claddingPurlinType}
          error={Boolean(errors.claddingPurlinType)}
          onChange={setType('claddingPurlinType')}
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
