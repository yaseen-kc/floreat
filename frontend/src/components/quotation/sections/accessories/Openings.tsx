import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { Blinds } from 'lucide-react'
import { deriveLineItemQuantity } from '@floreat/shared/calc'
import { memo } from 'react'
import type { AccessoriesDraft } from '@/stores/quotation-store'

interface OpeningGroupProps {
  label: string
  prefix: 'rollingShutter' | 'louver' | 'skyLight' | 'wallLight'
}

const OpeningGroup = memo(function OpeningGroup({ label, prefix }: OpeningGroupProps) {
  const { length, width, nos, setAccessories } = useQuotationStore(
    useShallow((s) => ({
      length: s.accessories[`${prefix}Length` as keyof AccessoriesDraft] as number | undefined,
      width: s.accessories[`${prefix}Width` as keyof AccessoriesDraft] as number | undefined,
      nos: s.accessories[`${prefix}Nos` as keyof AccessoriesDraft] as number | undefined,
      setAccessories: s.setAccessories,
    })),
  )

  const quantity = deriveLineItemQuantity(length, width, nos)

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-md bg-zinc-50 dark:bg-zinc-900/50">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{label}</h4>
        {quantity !== undefined && (
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">
            Total: {quantity} m²
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NumberField
          label="Length"
          value={length}
          unit="m"
          required={false}
          error={false}
          onChange={(v) => setAccessories({ [`${prefix}Length`]: v } as unknown as Partial<AccessoriesDraft>)}
        />
        <NumberField
          label="Width"
          value={width}
          unit="m"
          required={false}
          error={false}
          onChange={(v) => setAccessories({ [`${prefix}Width`]: v } as unknown as Partial<AccessoriesDraft>)}
        />
        <NumberField
          label="Nos"
          value={nos}
          unit="count"
          step={1}
          required={false}
          error={false}
          onChange={(v) => setAccessories({ [`${prefix}Nos`]: v } as unknown as Partial<AccessoriesDraft>)}
        />
      </div>
    </div>
  )
})

/** Openings fields for Step 6. */
export function Openings() {
  return (
    <SectionCard icon={<Blinds className="w-3.5 h-3.5" />} title="Openings">
      <div className="flex flex-col gap-4 desktop:gap-6">
        <OpeningGroup label="Rolling Shutter" prefix="rollingShutter" />
        <OpeningGroup label="Louver" prefix="louver" />
        <OpeningGroup label="Sky Light" prefix="skyLight" />
        <OpeningGroup label="Wall Light" prefix="wallLight" />
      </div>
    </SectionCard>
  )
}
