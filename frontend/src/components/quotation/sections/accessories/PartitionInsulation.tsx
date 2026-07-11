import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { SelectField } from '@/components/quotation/shared/SelectField'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { LayoutPanelTop } from 'lucide-react'
import type {
  PartitionType,
  PartitionThickness,
  InsulationType,
} from '@/api/quotation/accessories/getAccessories'
import {
  PARTITION_TYPE_OPTIONS,
  PARTITION_THICKNESS_OPTIONS,
  INSULATION_TYPE_OPTIONS,
} from './accessoriesOptions'

/** Partition wall + roof/wall insulation fields for Step 6. */
export function PartitionInsulation() {
  const { accessories, setAccessories } = useQuotationStore(
    useShallow((s) => ({ accessories: s.accessories, setAccessories: s.setAccessories })),
  )

  return (
    <SectionCard icon={<LayoutPanelTop className="w-3.5 h-3.5" />} title="Partition & Insulation">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Partition Type"
          value={accessories.partitionType}
          options={PARTITION_TYPE_OPTIONS}
          required={false}
          error={false}
          onChange={(v) => setAccessories({ partitionType: v as PartitionType })}
        />
        <SelectField
          label="Partition Thickness"
          value={accessories.partitionThickness}
          options={PARTITION_THICKNESS_OPTIONS}
          required={false}
          error={false}
          onChange={(v) => setAccessories({ partitionThickness: v as PartitionThickness })}
        />
        <NumberField
          label="Partition Quantity"
          value={accessories.partitionQuantity}
          unit="sqft"
          step={1}
          required={false}
          error={false}
          onChange={(v) => setAccessories({ partitionQuantity: v })}
        />
        <SelectField
          label="Roof Insulation"
          value={accessories.roofInsulationType}
          options={INSULATION_TYPE_OPTIONS}
          required={false}
          error={false}
          onChange={(v) => setAccessories({ roofInsulationType: v as InsulationType })}
        />
        <SelectField
          label="Wall Insulation"
          value={accessories.wallInsulationType}
          options={INSULATION_TYPE_OPTIONS}
          required={false}
          error={false}
          onChange={(v) => setAccessories({ wallInsulationType: v as InsulationType })}
        />
      </div>
    </SectionCard>
  )
}
