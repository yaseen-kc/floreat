import { useQuantityHydration } from '@/hooks/useQuantityHydration'
import { QuantityTableSection } from '@/components/quotation/sections/quantity/QuantityTableSection'
import { Layers, LayoutGrid, Umbrella, Wrench, Layers2, MoveUpRight, Nut } from 'lucide-react'
import {
  PEB_ROOF_ROWS,
  CLADDING_ROWS,
  CANOPY_ROWS,
  ACCESSORIES_ROWS,
  MEZZANINE_ROWS,
  STAIR_ROWS,
  ADDITIONAL_BOLTS_ROWS,
} from '@/components/quotation/sections/quantity/quantity-rows'

export function Step12Quantity() {
  useQuantityHydration()

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Quantity</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Bill of quantities breakdown by section. Review and adjust computed quantities, then save each section independently.
        </p>
      </div>
      <div className="space-y-6">
        <QuantityTableSection sectionKey="pebRoof" title="PEB Roof" icon={<Layers />} rows={PEB_ROOF_ROWS} />
        <QuantityTableSection sectionKey="cladding" title="Cladding" icon={<LayoutGrid />} rows={CLADDING_ROWS} />
        <QuantityTableSection sectionKey="canopy" title="Canopy" icon={<Umbrella />} rows={CANOPY_ROWS} />
        <QuantityTableSection sectionKey="accessories" title="Accessories" icon={<Wrench />} rows={ACCESSORIES_ROWS} />
        <QuantityTableSection sectionKey="mezzanine" title="Mezzanine" icon={<Layers2 />} rows={MEZZANINE_ROWS} />
        <QuantityTableSection sectionKey="stair" title="Stair" icon={<MoveUpRight />} rows={STAIR_ROWS} />
        <QuantityTableSection sectionKey="additionalBolts" title="Additional Bolts" icon={<Nut />} rows={ADDITIONAL_BOLTS_ROWS} />
      </div>
    </section>
  )
}
