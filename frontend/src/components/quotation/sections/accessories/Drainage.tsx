import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { SelectField } from '@/components/quotation/shared/SelectField'
import { Droplets } from 'lucide-react'
import type { DrainageMaterial, DrainageSize } from '@/api/quotation/accessories/getAccessories'
import { DRAINAGE_MATERIAL_OPTIONS, DRAINAGE_SIZE_OPTIONS } from './accessoriesOptions'

/** Gutter & down-take material/size selects for Step 6. Quantities live in DerivedQuantities. */
export function Drainage() {
  const { accessories, setAccessories } = useQuotationStore(
    useShallow((s) => ({ accessories: s.accessories, setAccessories: s.setAccessories })),
  )

  return (
    <SectionCard icon={<Droplets className="w-3.5 h-3.5" />} title="Drainage">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 desktop:gap-6">
        <SelectField
          label="Gutter Material"
          value={accessories.gutterType}
          options={DRAINAGE_MATERIAL_OPTIONS}
          required={false}
          error={false}
          onChange={(v) => setAccessories({ gutterType: v as DrainageMaterial })}
        />
        <SelectField
          label="Gutter Size"
          value={accessories.gutterSize}
          options={DRAINAGE_SIZE_OPTIONS}
          required={false}
          error={false}
          onChange={(v) => setAccessories({ gutterSize: v as DrainageSize })}
        />
        <SelectField
          label="Down Take Material"
          value={accessories.downTakeType}
          options={DRAINAGE_MATERIAL_OPTIONS}
          required={false}
          error={false}
          onChange={(v) => setAccessories({ downTakeType: v as DrainageMaterial })}
        />
        <SelectField
          label="Down Take Size"
          value={accessories.downTakeSize}
          options={DRAINAGE_SIZE_OPTIONS}
          required={false}
          error={false}
          onChange={(v) => setAccessories({ downTakeSize: v as DrainageSize })}
        />
      </div>
    </SectionCard>
  )
}
