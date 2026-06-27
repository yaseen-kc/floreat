import { useLoadHydration } from '@/hooks/useLoadHydration'
import { LoadDetails } from '@/components/quotation/sections/load/LoadDetails'
import { CompletionPeriod } from '@/components/quotation/sections/load/CompletionPeriod'

/**
 * Step 7 — Load. A flat, always-on form for a job's structural loads and the
 * completion period. Every field is optional; blank fields are dropped from the
 * payload by `buildLoadPayload` and the draft hydrates from the server on resume.
 */
export function Step7Load() {
  useLoadHydration()

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Load</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Structural design loads and the project completion period.
        </p>
      </div>

      <LoadDetails />
      <CompletionPeriod />
    </section>
  )
}
