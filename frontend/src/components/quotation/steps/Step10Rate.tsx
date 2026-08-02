import { RateTable } from '@/components/quotation/sections/rate/RateTable'
import { RecentlyUsed } from '@/components/quotation/RecentlyUsed'

export function Step10Rate() {
  return (
    <section className="min-h-full">
      <RecentlyUsed step={10} />
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Job rates</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Each job starts with 35 default rate items. Enter pricing for each item and save rows individually. Click an item name to open a popup editor for faster editing on smaller screens.
        </p>
      </div>

      <RateTable />
    </section>
  )
}
