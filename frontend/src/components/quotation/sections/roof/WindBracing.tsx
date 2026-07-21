import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField, type SelectFieldOption } from '@/components/quotation/shared/SelectField'
import { Wind } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { ROOF_SECTION_FIELDS } from '@/stores/quotation-store'

const WIND_BRACING_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'ROD', label: 'Rod' },
  { value: 'TUBE', label: 'Tube' },
]

type WindBracingNumberField =
  | 'roofWindBracingSegmentsInOneHalf'
  | 'columnWindBracingSegments'
  | 'roofWindBracingProvidedBays'
  | 'columnWindBracingProvidedBays'
  | 'windBracingColumnHeight'
  | 'windBracingUnitWeight'

const NUMBER_FIELDS: { name: WindBracingNumberField; label: string; unit: string; step?: number }[] = [
  { name: 'roofWindBracingSegmentsInOneHalf', label: 'Roof Wind Bracing Segments (One Half)', unit: 'count', step: 1 },
  { name: 'columnWindBracingSegments', label: 'Column Wind Bracing Segments', unit: 'count', step: 1 },
  { name: 'roofWindBracingProvidedBays', label: 'Roof Wind Bracing Provided Bays', unit: 'count', step: 1 },
  { name: 'columnWindBracingProvidedBays', label: 'Column Wind Bracing Provided Bays', unit: 'count', step: 1 },
  { name: 'windBracingColumnHeight', label: 'Wind Bracing Column Height', unit: 'm' },
  { name: 'windBracingUnitWeight', label: 'Wind Bracing Unit Weight', unit: 'kg/m' },
]

type DerivedField = 'roofWindBracingBaySpacing' | 'columnWindBracingBaySpacing' | 'roofWindBracingLength' | 'columnWindBracingLength'

const DERIVED_FIELDS: { name: DerivedField; label: string; unit: string }[] = [
  { name: 'roofWindBracingBaySpacing', label: 'Roof Wind Bracing Bay Spacing', unit: 'm' },
  { name: 'columnWindBracingBaySpacing', label: 'Column Wind Bracing Bay Spacing', unit: 'm' },
  { name: 'roofWindBracingLength', label: 'Roof Wind Bracing Length', unit: 'm' },
  { name: 'columnWindBracingLength', label: 'Column Wind Bracing Length', unit: 'm' },
]

export function WindBracing() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.windBracing,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof) : {}
  const sectionError = ROOF_SECTION_FIELDS.windBracing.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<Wind className="w-3.5 h-3.5" />}
      title="Wind Bracing"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('windBracing', e)}
      error={sectionError}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] desktop:gap-6">
        <SelectField
          label="Wind Bracing Type"
          options={WIND_BRACING_TYPE_OPTIONS}
          required={isRequired('windBracingType')}
          value={roof.windBracingType}
          error={Boolean(errors.windBracingType)}
          onChange={(v) => setRoof({ windBracingType: v as RoofDraft['windBracingType'] })}
        />
        {NUMBER_FIELDS.map(({ name, label, unit, step }) => (
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
        {DERIVED_FIELDS.map(({ name, label, unit }) => (
          <NumberField
            key={name}
            label={label}
            unit={unit}
            readOnly
            required={false}
            value={roof[name]}
            error={false}
            onChange={() => {}}
          />
        ))}
      </div>
    </CollapsibleSection>
  )
}
