import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { useCanopyHydration } from '@/hooks/useCanopyHydration'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tent } from 'lucide-react'
import { CanopyItems } from '@/components/quotation/sections/canopy/CanopyItems'

export function Step5Canopy() {
  useCanopyHydration()
  const { hasCanopy, setHasCanopy } = useQuotationStore(
    useShallow((s) => ({ hasCanopy: s.hasCanopy, setHasCanopy: s.setHasCanopy })),
  )

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Canopy</h2>
        <p className="text-muted-foreground text-sm mt-1">Optional canopy coverings for the building.</p>
      </div>

      <SectionCard icon={<Tent className="w-3.5 h-3.5" />} title="Configuration">
        <div className="flex items-center justify-between">
          <Label htmlFor="has-canopy">This job has a canopy</Label>
          <Switch
            id="has-canopy"
            checked={hasCanopy}
            onCheckedChange={setHasCanopy}
            aria-label="This job has a canopy"
          />
        </div>
      </SectionCard>

      {hasCanopy && <CanopyItems />}
    </section>
  )
}
