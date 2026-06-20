import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { useMezzanineHydration } from '@/hooks/useMezzanineHydration'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Building2 } from 'lucide-react'
import { MezzanineFloors } from '@/components/quotation/sections/mezzanine/MezzanineFloors'
import { MezzanineExtensions } from '@/components/quotation/sections/mezzanine/MezzanineExtensions'

export function Step3Mezzanine() {
  useMezzanineHydration()
  const { hasMezzanine, setHasMezzanine } = useQuotationStore(
    useShallow((s) => ({ hasMezzanine: s.hasMezzanine, setHasMezzanine: s.setHasMezzanine })),
  )

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Mezzanine</h2>
        <p className="text-muted-foreground text-sm mt-1">Optional intermediate floors and their extensions.</p>
      </div>

      <SectionCard icon={<Building2 className="w-3.5 h-3.5" />} title="Configuration">
        <div className="flex items-center justify-between">
          <Label htmlFor="has-mezzanine">This job has a mezzanine</Label>
          <Switch
            id="has-mezzanine"
            checked={hasMezzanine}
            onCheckedChange={setHasMezzanine}
            aria-label="This job has a mezzanine"
          />
        </div>
      </SectionCard>

      {hasMezzanine && (
        <>
          <MezzanineFloors />
          <MezzanineExtensions />
        </>
      )}
    </section>
  )
}
