import { QuotationDocument } from '@/components/quotation/sections/quotation/QuotationDocument'
import { Button } from '@/components/ui/button'
import { useAmountHydration } from '@/hooks/useAmountHydration'
import { useQuantityHydration } from '@/hooks/useQuantityHydration'
import { useQuotationHydration } from '@/hooks/useQuotationHydration'
import { Printer } from 'lucide-react'

export function Step13Quotation() {
  useQuotationHydration()
  useQuantityHydration()
  useAmountHydration()

  return (
    <section>
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Quotation</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Final quotation document assembled from the preceding steps. Review each chapter before
            issuing to the client.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>

      <div id="quotation-print-area">
        {/* Print-only letterhead. Header is in normal flow so it renders on
            page 1 only; footer is fixed so Chromium repeats it on every page. */}
        <img src="/header.jpeg" alt="" aria-hidden className="quotation-print-header" />
        <QuotationDocument />
        <img src="/footer.jpeg" alt="" aria-hidden className="quotation-print-footer" />
      </div>
    </section>
  )
}
