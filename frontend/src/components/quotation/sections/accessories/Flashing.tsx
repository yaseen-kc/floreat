import { useQuotationStore } from '@/stores/quotation-store'
import type { AccessoriesDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { SelectField } from '@/components/quotation/shared/SelectField'
import { Layers } from 'lucide-react'
import type { FlashingType, FlashingThickness } from '@/api/quotation/accessories/getAccessories'
import { FLASHING_TYPE_OPTIONS, FLASHING_THICKNESS_OPTIONS } from './accessoriesOptions'

/** The four flashing groups, each a `${name}Type` + `${name}Thickness` pair on the draft. */
const FLASHING_GROUPS = [
  { label: 'Drip Trim', typeField: 'dripTrimType', thicknessField: 'dripTrimThickness' },
  { label: 'Gable End Flashing', typeField: 'gableEndFlashingType', thicknessField: 'gableEndFlashingThickness' },
  { label: 'Corner Flash', typeField: 'cornerFlashType', thicknessField: 'cornerFlashThickness' },
  { label: 'Ridge', typeField: 'ridgeType', thicknessField: 'ridgeThickness' },
] as const

/** Flashing material/thickness selects for Step 6. Quantities live in DerivedQuantities. */
export function Flashing() {
  const { accessories, setAccessories } = useQuotationStore(
    useShallow((s) => ({ accessories: s.accessories, setAccessories: s.setAccessories })),
  )

  return (
    <SectionCard icon={<Layers className="w-3.5 h-3.5" />} title="Flashing">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FLASHING_GROUPS.map((g) => (
          <div key={g.typeField} className="contents">
            <SelectField
              label={`${g.label} Material`}
              value={accessories[g.typeField as keyof AccessoriesDraft] as FlashingType | undefined}
              options={FLASHING_TYPE_OPTIONS}
              required={false}
              error={false}
              onChange={(v) => setAccessories({ [g.typeField]: v as FlashingType } as Partial<AccessoriesDraft>)}
            />
            <SelectField
              label={`${g.label} Thickness`}
              value={accessories[g.thicknessField as keyof AccessoriesDraft] as FlashingThickness | undefined}
              options={FLASHING_THICKNESS_OPTIONS}
              required={false}
              error={false}
              onChange={(v) => setAccessories({ [g.thicknessField]: v as FlashingThickness } as Partial<AccessoriesDraft>)}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
