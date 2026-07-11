import { useQuotationStore } from '@/stores/quotation-store'
import type { AccessoriesDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ToggleRight } from 'lucide-react'

/** The three optional boolean feature toggles on the accessories draft. */
const FEATURE_TOGGLES = [
  { field: 'deckSheetFlashingEnabled', label: 'Deck Sheet Flashing' },
  { field: 'gantryGirderEnabled', label: 'Gantry Girder' },
  { field: 'liftStructureEnabled', label: 'Lift Structure' },
] as const

/** Boolean feature toggles (deck sheet flashing, gantry girder, lift structure) for Step 6. */
export function FeatureToggles() {
  const { accessories, setAccessories } = useQuotationStore(
    useShallow((s) => ({ accessories: s.accessories, setAccessories: s.setAccessories })),
  )

  return (
    <SectionCard icon={<ToggleRight className="w-3.5 h-3.5" />} title="Additional Features">
      <div className="flex flex-col gap-4">
        {FEATURE_TOGGLES.map((t) => (
          <div key={t.field} className="flex items-center justify-between">
            <Label htmlFor={t.field}>{t.label}</Label>
            <Switch
              id={t.field}
              checked={accessories[t.field as keyof AccessoriesDraft] === true}
              onCheckedChange={(checked) =>
                setAccessories({ [t.field]: checked } as Partial<AccessoriesDraft>)
              }
              aria-label={t.label}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
