import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { useStairHydration } from '@/hooks/useStairHydration'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Footprints } from 'lucide-react'
import { StairItems } from '@/components/quotation/sections/stair/StairItems'
import { AreaDeductions } from '@/components/quotation/sections/stair/AreaDeductions'

export function Step4Stair() {
  useStairHydration()
  const { hasStair, setHasStair } = useQuotationStore(
    useShallow((s) => ({ hasStair: s.hasStair, setHasStair: s.setHasStair })),
  )

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Stair</h2>
        <p className="text-muted-foreground text-sm mt-1">Optional staircases and area deductions.</p>
      </div>

      <SectionCard icon={<Footprints className="w-3.5 h-3.5" />} title="Configuration">
        <div className="flex items-center justify-between">
          <Label htmlFor="has-stair">This job has a stair</Label>
          <Switch
            id="has-stair"
            checked={hasStair}
            onCheckedChange={setHasStair}
            aria-label="This job has a stair"
          />
        </div>
      </SectionCard>

      {hasStair && (
        <>
          <StairItems />
          <AreaDeductions />
        </>
      )}
    </section>
  )
}
