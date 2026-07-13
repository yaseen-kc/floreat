import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { SelectField } from '@/components/quotation/shared/SelectField'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { Fan } from 'lucide-react'
import type { TurboVentilatorDiameter } from '@/api/quotation/accessories/getAccessories'
import { TURBO_VENTILATOR_DIAMETER_OPTIONS } from './accessoriesOptions'

/** Turbo ventilator + handrail fields for Step 6. */
export function VentilatorHandrail() {
  const { accessories, setAccessories } = useQuotationStore(
    useShallow((s) => ({ accessories: s.accessories, setAccessories: s.setAccessories })),
  )

  return (
    <SectionCard icon={<Fan className="w-3.5 h-3.5" />} title="Ventilator & Handrail">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 desktop:gap-6">
        <SelectField
          label="Turbo Ventilator Diameter"
          value={accessories.turboVentilatorDiameter}
          options={TURBO_VENTILATOR_DIAMETER_OPTIONS}
          required={false}
          error={false}
          onChange={(v) => setAccessories({ turboVentilatorDiameter: v as TurboVentilatorDiameter })}
        />
        <NumberField
          label="Turbo Ventilator Nos"
          value={accessories.turboVentilatorNos}
          unit="count"
          step={1}
          required={false}
          error={false}
          onChange={(v) => setAccessories({ turboVentilatorNos: v })}
        />
        <NumberField
          label="Handrail Weight"
          value={accessories.handrailWeightKg}
          unit="kg"
          required={false}
          error={false}
          onChange={(v) => setAccessories({ handrailWeightKg: v })}
        />
      </div>
    </SectionCard>
  )
}
