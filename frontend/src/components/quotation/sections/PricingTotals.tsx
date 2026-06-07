import { useQuotationStore } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Calculator } from 'lucide-react'

function inr(n: number) { return '₹' + Math.round(n).toLocaleString('en-IN') }

export function PricingTotals() {
  const { getTotals, pricing } = useQuotationStore()
  const t = getTotals()

  return (
    <SectionCard icon={<Calculator className="w-3.5 h-3.5" />} title="Quotation total" className="m-0 sticky top-4">
      <div className="flex flex-col">
        <Row label="Material subtotal" value={inr(t.materialSubtotal)} />
        <Row label="Labour & services" value={inr(t.services + pricing.additional)} />
        <Row label="Base cost" value={inr(t.base)} />
        <Row label={`Margin (${pricing.margin}%)`} value={inr(t.marginAmt)} />
        <Row label={`Discount (${pricing.discount}%)`} value={`−${inr(t.discountAmt)}`} className="text-emerald-600" />
        <Row label="Taxable value" value={inr(t.taxable)} />
        <Row label={`GST (${pricing.gst}%)`} value={inr(t.tax)} />
        <div className="flex justify-between items-center pt-3.5 mt-1.5 border-t-2 border-foreground text-[15px] font-semibold">
          <span>Final quotation</span>
          <span className="text-2xl tracking-tight text-primary">{inr(t.grand)}</span>
        </div>
      </div>
      <p className="text-[11.5px] text-muted-foreground mt-3.5 leading-relaxed">Rounded to nearest ₹100. All figures recalculate as you type.</p>
    </SectionCard>
  )
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex justify-between py-[9px] text-[13.5px] border-t border-border/50 first:border-t-0">
      <span>{label}</span>
      <span className={className || 'text-foreground'}>{value}</span>
    </div>
  )
}
