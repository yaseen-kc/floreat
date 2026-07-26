import { useQuantityHydration } from '@/hooks/useQuantityHydration'
import { QuantityTableSection } from '@/components/quotation/sections/quantity/QuantityTableSection'
import { Layers, LayoutGrid, Umbrella, Wrench, Layers2, MoveUpRight, Nut } from 'lucide-react'
import {
  getPebRoofRows,
  getCladdingRows,
  getCanopyRows,
  getAccessoriesRows,
  getMezzanineRows,
  getStairRows,
  getAdditionalBoltsRows,
} from '@/components/quotation/sections/quantity/quantity-rows'
import { 
  calculatePebQuantities,
  calculateCladdingQuantities,
  calculateCanopyQuantities,
  calculateAccessoriesQuantities,
  calculateMezzanineQuantities,
  calculateStairQuantities,
  calculateAdditionalBoltsQuantities
} from '@floreat/shared/calc'
import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'

export function Step12Quantity() {
  useQuantityHydration()

  const { roof, joint, canopy, accessories, mezzanine, stair } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      joint: s.joint,
      canopy: s.canopy,
      accessories: s.accessories,
      mezzanine: s.mezzanine,
      stair: s.stair,
    }))
  )

  const pebCalculatedNested = calculatePebQuantities({
    roof,
    joint,
    jointBoltRoofs: joint?.jointBoltRoof,
    foundationBoltRoof: joint?.foundationBoltRoof,
  })

  const claddingCalc = calculateCladdingQuantities({ roof })
  const canopyCalc = calculateCanopyQuantities({ canopy, joint })
  const accessoriesCalc = calculateAccessoriesQuantities({ accessories, roof })
  const mezzanineCalc = calculateMezzanineQuantities({ mezzanine, joint, jointBoltMezzanines: joint.jointBoltMezzanine, stair })
  const stairCalc = calculateStairQuantities({ stair, mezzanine })
  const additionalBoltsCalc = calculateAdditionalBoltsQuantities({})

  const pebRoofRows = getPebRoofRows(pebCalculatedNested)
  const claddingRows = getCladdingRows(claddingCalc)
  const canopyRows = getCanopyRows(canopyCalc)
  const accessoriesRows = getAccessoriesRows(accessoriesCalc)
  const mezzanineRows = getMezzanineRows(mezzanineCalc)
  const stairRows = getStairRows(stairCalc)
  const additionalBoltsRows = getAdditionalBoltsRows(additionalBoltsCalc)

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Quantity</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Bill of quantities breakdown by section. Review and adjust computed quantities, then save each section independently or save the entire draft.
        </p>
      </div>
      <div className="space-y-6">
        <QuantityTableSection sectionKey="pebRoof" title="PEB Roof" icon={<Layers />} rows={pebRoofRows} calculatedData={pebCalculatedNested} />
        <QuantityTableSection sectionKey="cladding" title="Cladding" icon={<LayoutGrid />} rows={claddingRows} calculatedData={claddingCalc} />
        <QuantityTableSection sectionKey="canopy" title="Canopy" icon={<Umbrella />} rows={canopyRows} calculatedData={canopyCalc} />
        <QuantityTableSection sectionKey="accessories" title="Accessories" icon={<Wrench />} rows={accessoriesRows} calculatedData={accessoriesCalc} />
        <QuantityTableSection sectionKey="mezzanine" title="Mezzanine" icon={<Layers2 />} rows={mezzanineRows} calculatedData={mezzanineCalc} />
        <QuantityTableSection sectionKey="stair" title="Stair" icon={<MoveUpRight />} rows={stairRows} calculatedData={stairCalc} />
        <QuantityTableSection sectionKey="additionalBolts" title="Additional Bolts" icon={<Nut />} rows={additionalBoltsRows} calculatedData={additionalBoltsCalc} />
      </div>
    </section>
  )
}
