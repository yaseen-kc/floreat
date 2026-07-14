import { useStairHydration } from '@/hooks/useStairHydration'
import { StairItems } from '@/components/quotation/sections/stair/StairItems'
import { AreaDeductions } from '@/components/quotation/sections/stair/AreaDeductions'

export function Step4Stair() {
  useStairHydration()

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Stair</h2>
        <p className="text-muted-foreground text-sm mt-1">Staircases and area deductions.</p>
      </div>
      <StairItems />
      <AreaDeductions />
    </section>
  )
}
