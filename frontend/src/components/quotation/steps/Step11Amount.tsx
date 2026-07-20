import { AmountTable } from '@/components/quotation/sections/amount/AmountTable'

export function Step11Amount() {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Amount</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Bill of quantities cost summary. Values are derived from earlier steps — rates and amounts will populate automatically.
        </p>
      </div>

      <AmountTable />
    </section>
  )
}
