import { BuildingDimensions } from '@/components/quotation/sections/BuildingDimensions'
import { RoofConfig } from '@/components/quotation/sections/RoofConfig'
import { SidewallCladding } from '@/components/quotation/sections/SidewallCladding'
import { LoadingConditions } from '@/components/quotation/sections/LoadingConditions'

export function Step2StructuralInputs() {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Structural inputs</h2>
        <p className="text-muted-foreground text-sm mt-1">Geometry and loading. Fields adapt to your roof and wall selections — only what's relevant appears.</p>
      </div>
      <BuildingDimensions />
      <RoofConfig />
      <SidewallCladding />
      <LoadingConditions />
    </section>
  )
}
