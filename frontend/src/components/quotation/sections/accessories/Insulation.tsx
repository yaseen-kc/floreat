import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { SelectField } from '@/components/quotation/shared/SelectField'
import { LayoutPanelTop } from 'lucide-react'
import type { InsulationType } from '@/api/quotation/accessories/getAccessories'
import { INSULATION_TYPE_OPTIONS } from './accessoriesOptions'

/** Roof and wall insulation selectors for Step 6. */
export function Insulation() {
  const { accessories, setAccessories } = useQuotationStore(
    useShallow((s) => ({ accessories: s.accessories, setAccessories: s.setAccessories })),
  )

  return (
    <SectionCard icon={<LayoutPanelTop className="w-3.5 h-3.5" />} title="Insulation">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 desktop:gap-6">
        <SelectField
          label="Roof Insulation"
          value={accessories.roofInsulationType}
          options={INSULATION_TYPE_OPTIONS}
          required={false}
          error={false}
          onChange={(value) => setAccessories({ roofInsulationType: value as InsulationType })}
        />
        <SelectField
          label="Wall Insulation"
          value={accessories.wallInsulationType}
          options={INSULATION_TYPE_OPTIONS}
          required={false}
          error={false}
          onChange={(value) => setAccessories({ wallInsulationType: value as InsulationType })}
        />
      </div>
    </SectionCard>
  )
}
