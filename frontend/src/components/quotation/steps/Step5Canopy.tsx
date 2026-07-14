import { useCanopyHydration } from '@/hooks/useCanopyHydration'
import { CanopyItems } from '@/components/quotation/sections/canopy/CanopyItems'

export function Step5Canopy() {
  useCanopyHydration()

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Canopy</h2>
        <p className="text-muted-foreground text-sm mt-1">Canopy coverings for the building.</p>
      </div>
      <CanopyItems />
    </section>
  )
}
