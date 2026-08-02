import { useAccessoriesHydration } from '@/hooks/useAccessoriesHydration'
import { DrainageFlashingPartition } from '@/components/quotation/sections/accessories/DrainageFlashingPartition'
import { InsulationVentilatorFeatures } from '@/components/quotation/sections/accessories/InsulationVentilatorFeatures'
import { PaintPrimer } from '@/components/quotation/sections/accessories/PaintPrimer'
import { DoorsWindowsFoldedPlates } from '@/components/quotation/sections/accessories/DoorsWindowsFoldedPlates'
import { Openings } from '@/components/quotation/sections/accessories/Openings'
import { RecentlyUsed } from '@/components/quotation/RecentlyUsed'

/**
 * Step 6 — Accessories. An always-on form for a job's accessories: drainage,
 * flashing, the six roof-derived quantities (with per-field override), partition
 * & insulation, ventilator & handrail, feature toggles, paint & primer, and the
 * four line-item arrays (doors, windows, folded plates, openings). Every field
 * is optional; blanks are dropped by `buildAccessoriesPayload` and the draft
 * hydrates from the server on resume.
 */
export function Step6Accessories() {
  useAccessoriesHydration()

  return (
    <section>
      <RecentlyUsed step={6} />
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Accessories</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Drainage, flashing, insulation, paint and the building's door, window and opening schedule.
        </p>
      </div>

      <DrainageFlashingPartition />
      <Openings />
      <InsulationVentilatorFeatures />
      <DoorsWindowsFoldedPlates />
      <PaintPrimer />
    </section>
  )
}
