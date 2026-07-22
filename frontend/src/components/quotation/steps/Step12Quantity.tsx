import { QuantityTable } from '@/components/quotation/sections/quantity/QuantityTable'

export function Step12Quantity() {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Quantity</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Bill of quantities breakdown by section. Review and adjust computed quantities, then save each section independently.
        </p>
      </div>
      <QuantityTable />
    </section>
  )
}
