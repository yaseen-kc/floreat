import { QuotationDocument } from '@/components/quotation/sections/quotation/QuotationDocument'

/**
 * Step 13 — the assembled quotation document, read-only.
 *
 * Content is currently placeholder data lifted from a reference quotation; the
 * chapters render from `quotation-data.ts` so swapping in the saved job,
 * quantity, amount and rate records is a change of data source only.
 */
export function Step13Quotation() {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Quotation</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Final quotation document assembled from the preceding steps. Review each chapter before
          issuing to the client.
        </p>
      </div>

      <QuotationDocument />
    </section>
  )
}
