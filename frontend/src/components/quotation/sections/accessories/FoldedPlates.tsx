import { useQuotationStore } from '@/stores/quotation-store'
import type { AccessoriesDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { Rows3 } from 'lucide-react'
import { deriveLineItemQuantity } from '@floreat/shared/calc'

/** Flat folded plate fields for Step 6. */
export function FoldedPlates() {
  const { length, width, nos, setAccessories } = useQuotationStore(
    useShallow((s) => ({
      length: s.accessories.foldedPlateLength as number | undefined,
      width: s.accessories.foldedPlateWidth as number | undefined,
      nos: s.accessories.foldedPlateNos as number | undefined,
      setAccessories: s.setAccessories,
    })),
  )

  const quantity = deriveLineItemQuantity(length, width, nos)

  return (
    <SectionCard icon={<Rows3 className="w-3.5 h-3.5" />} title="Folded Plates">
      <div className="flex flex-col gap-3 p-4 border rounded-md bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Folded Plate</h4>
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
            onChange={(v) => setAccessories({ foldedPlateLength: v } as unknown as Partial<AccessoriesDraft>)}
          />
          <NumberField
            label="Width"
            value={width}
            unit="m"
            required={false}
            error={false}
            onChange={(v) => setAccessories({ foldedPlateWidth: v } as unknown as Partial<AccessoriesDraft>)}
          />
          <NumberField
            label="Nos"
            value={nos}
            unit="count"
            step={1}
            required={false}
            error={false}
            onChange={(v) => setAccessories({ foldedPlateNos: v } as unknown as Partial<AccessoriesDraft>)}
          />
        </div>
      </div>
    </SectionCard>
  )
}
