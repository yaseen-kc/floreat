import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { Weight } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { ROOF_SECTION_FIELDS } from '@/stores/quotation-store'

export function MaterialConsumption() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.materialConsumption,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof) : {}
  const sectionError = ROOF_SECTION_FIELDS.materialConsumption.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<Weight className="w-3.5 h-3.5" />}
      title="Material Consumption"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('materialConsumption', e)}
      error={sectionError}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        <NumberField
          label="Material Consumption (Excluding Purlin)"
          unit="kg/m²"
          required={isRequired('materialConsumptionExcludingPurlin')}
          value={roof.materialConsumptionExcludingPurlin}
          error={Boolean(errors.materialConsumptionExcludingPurlin)}
          onChange={(v) => setRoof({ materialConsumptionExcludingPurlin: v })}
        />
      </div>
    </CollapsibleSection>
  )
}
