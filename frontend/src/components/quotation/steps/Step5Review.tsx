import { ReviewDocument } from '@/components/quotation/sections/ReviewDocument'
import { useToast } from '@/components/quotation/shared/Toast'
import { Button } from '@/components/ui/button'
import { Copy, Printer, Download, Send } from 'lucide-react'

export function Step5Review() {
  const toast = useToast((s) => s.show)

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Review & generate</h2>
        <p className="text-muted-foreground text-sm mt-1">Final preview as the client will see it. Confirm, then export or send.</p>
      </div>
      <ReviewDocument />
      <div className="max-w-[780px] mx-auto flex flex-wrap justify-end gap-2.5 mt-[18px]">
        <Button variant="ghost" onClick={() => toast('Duplicated as Q-2616')}><Copy className="w-4 h-4" /> Duplicate</Button>
        <Button variant="secondary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</Button>
        <Button variant="secondary" onClick={() => toast('PDF export queued')}><Download className="w-4 h-4" /> Export PDF</Button>
        <Button onClick={() => toast('Quotation sent to client')}><Send className="w-4 h-4" /> Send to client</Button>
      </div>
    </section>
  )
}
