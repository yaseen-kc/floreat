import { useSpecHydration } from '@/hooks/useSpecHydration'
import { SpecProducts } from '@/components/quotation/sections/spec/SpecProducts'

/**
 * Step 9 — Spec. The wizard's final step: an always-on table of the products in
 * this quotation's specification. Each row holds a description, specification,
 * make / brand and an optional yield strength; rows can be added and removed.
 * Every field is optional — blank rows are dropped from the payload by
 * `buildSpecPayload` and the draft hydrates from the server on resume.
 */
export function Step9Spec() {
  useSpecHydration()

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Product specification</h2>
        <p className="text-muted-foreground text-sm mt-1">
          The products in this quotation — their description, specification, make / brand and yield strength.
        </p>
      </div>

      <SpecProducts />
    </section>
  )
}
