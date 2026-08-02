import { RateTable } from '@/components/quotation/sections/rate/RateTable'
import { RecentlyUsed } from '@/components/quotation/RecentlyUsed'

export function Step10Rate() {
  return (
    <section className="min-h-full">
      <RecentlyUsed step={10} />
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Job rates</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Each job starts with 35 default rate items. Edit the raw pricing fields and save the complete rate set together.
        </p>
      </div>

      <RateTable />
    </section>
  )
}
