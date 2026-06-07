import { PricingTable } from '@/components/quotation/sections/PricingTable'
import { PricingTotals } from '@/components/quotation/sections/PricingTotals'

export function Step4Pricing() {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Pricing & cost breakdown</h2>
        <p className="text-muted-foreground text-sm mt-1">Material lines flow in from the calc engine. Edit any rate — totals recalculate live.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5 items-start">
        <PricingTable />
        <PricingTotals />
      </div>
    </section>
  )
}
