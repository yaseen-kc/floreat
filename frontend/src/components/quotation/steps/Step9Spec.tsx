import { useSpecHydration } from '@/hooks/useSpecHydration'
import { SpecDetails } from '@/components/quotation/sections/spec/SpecDetails'

/**
 * Step 9 — Spec. The wizard's final step: a flat, always-on form for a job's
 * product specification (a free-text description, a specifications list, a
 * make / brand list and an optional yield strength). Every field is optional;
 * blanks are dropped from the payload by `buildSpecPayload` and the draft
 * hydrates from the server on resume.
 */
export function Step9Spec() {
  useSpecHydration()

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Product specification</h2>
        <p className="text-muted-foreground text-sm mt-1">
          The material description, specifications, make / brand and yield strength for this quotation.
        </p>
      </div>

      <SpecDetails />
    </section>
  )
}
