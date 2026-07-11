import { useAccessoriesHydration } from '@/hooks/useAccessoriesHydration'
import { Drainage } from '@/components/quotation/sections/accessories/Drainage'
import { Flashing } from '@/components/quotation/sections/accessories/Flashing'
import { DerivedQuantities } from '@/components/quotation/sections/accessories/DerivedQuantities'
import { PartitionInsulation } from '@/components/quotation/sections/accessories/PartitionInsulation'
import { VentilatorHandrail } from '@/components/quotation/sections/accessories/VentilatorHandrail'
import { FeatureToggles } from '@/components/quotation/sections/accessories/FeatureToggles'
import { PaintPrimer } from '@/components/quotation/sections/accessories/PaintPrimer'
import { Doors } from '@/components/quotation/sections/accessories/Doors'
import { Windows } from '@/components/quotation/sections/accessories/Windows'
import { FoldedPlates } from '@/components/quotation/sections/accessories/FoldedPlates'
import { Openings } from '@/components/quotation/sections/accessories/Openings'

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
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Accessories</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Drainage, flashing, insulation, paint and the building's door, window and opening schedule.
        </p>
      </div>

      <Drainage />
      <Flashing />
      <DerivedQuantities />
      <PartitionInsulation />
      <VentilatorHandrail />
      <FeatureToggles />
      <PaintPrimer />
      <Doors />
      <Windows />
      <FoldedPlates />
      <Openings />
    </section>
  )
}
