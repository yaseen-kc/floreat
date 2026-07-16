import { RateTable } from '@/components/quotation/sections/rate/RateTable'

export function Step10Rate() {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Rate master</h2>
        <p className="text-muted-foreground text-sm mt-1">
          The canonical rate master contains 35 default items. Enter pricing for each item and save rows individually to persist the shared rate table. Click an item name to open a popup editor for faster editing on smaller screens.
        </p>
      </div>

      <RateTable />
    </section>
  )
}
