import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { SelectField, type SelectFieldOption } from '@/components/quotation/shared/SelectField'
import { Grid2x2 } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { ROOF_SECTION_FIELDS } from '@/stores/quotation-store'

/** Human-readable labels for the plate material grade enum. */
const GRADE_OPTIONS: SelectFieldOption[] = [
  { value: 'FE_250', label: 'FE 250' },
  { value: 'FE_345', label: 'FE 345' },
  { value: 'FE_400', label: 'FE 400' },
]

export function MaterialGrade() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.materialGrade,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof) : {}
  const sectionError = ROOF_SECTION_FIELDS.materialGrade.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<Grid2x2 className="w-3.5 h-3.5" />}
      title="Material Grade"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('materialGrade', e)}
      error={sectionError}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] desktop:gap-6">
        <SelectField
          label="Grade of Plate Material"
          options={GRADE_OPTIONS}
          required={isRequired('gradeOfPlateMaterial')}
          value={roof.gradeOfPlateMaterial}
          error={Boolean(errors.gradeOfPlateMaterial)}
          onChange={(v) => setRoof({ gradeOfPlateMaterial: v as RoofDraft['gradeOfPlateMaterial'] })}
        />
      </div>
    </CollapsibleSection>
  )
}
