import { useQuotationStore } from '@/stores/quotation-store'

function fmt(n: number, d = 0) { return n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d }) }
function inr(n: number) { return '₹' + Math.round(n).toLocaleString('en-IN') }

const ROOF_LABELS: Record<string, string> = { gable: 'Gable PEB', mono: 'Mono-pitch PEB', multi: 'Multi-bay saw-tooth', flat: 'Low-slope structure' }

export function ReviewDocument() {
  const { projectInfo: pi, structuralInputs: si, getCalc, getTotals } = useQuotationStore()
  const calc = getCalc()
  const totals = getTotals()

  const dateStr = pi.date
    ? new Date(pi.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="max-w-[780px] mx-auto bg-card border border-border rounded-[14px] overflow-hidden">
      {/* Accent band */}
      <div className="h-1.5 bg-primary" />

      <div className="p-9">
        {/* Header */}
        <div className="flex justify-between items-start pb-[22px] border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-primary/10 text-primary grid place-items-center">
              <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Strukt Structures Pvt. Ltd.</h3>
              <div className="text-xs text-muted-foreground">PEB design · fabrication · erection</div>
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="text-base font-bold">Q-2615</div>
            <div className="text-muted-foreground">Revision {pi.revision.split(' ')[0]}</div>
            <div className="text-muted-foreground">{dateStr}</div>
          </div>
        </div>

        {/* Prepared for */}
        <DocSection title="Prepared for">
          <KVGrid items={[
            ['Client', pi.client || '—'],
            ['Project', pi.project || '—'],
            ['Site', pi.site || '—'],
            ['Consultant', pi.consultant || '—'],
          ]} />
        </DocSection>

        {/* Engineering summary */}
        <DocSection title="Engineering summary">
          <KVGrid items={[
            ['Configuration', `${ROOF_LABELS[si.roofType] || 'PEB'} · ${si.sidewall ? 'clad sidewalls' : 'open sides'}`],
            ['Footprint', `${fmt(calc.planArea > 0 ? si.length : 0)} × ${fmt(si.width)} m · ${calc.bays} bays`],
            ['Plan area', `${fmt(calc.planArea)} m²`],
            ['Structural steel', `${fmt(calc.steelMass)} kg`],
            ['Cladding area', `${fmt(calc.cladArea)} m²`],
            ['Design wind pressure', `${fmt(calc.q, 2)} kN/m²`],
          ]} />
        </DocSection>

        {/* Pricing summary */}
        <DocSection title="Pricing summary">
          <SummRow label="Material & cladding" value={inr(totals.materialSubtotal)} />
          <SummRow label="Labour, erection & transport" value={inr(totals.services)} />
          <SummRow label="Margin, discount & GST" value={inr(totals.marginAmt - totals.discountAmt + totals.tax)} />
          <div className="flex justify-between items-center text-lg font-bold pt-3 mt-1.5 border-t-2 border-foreground">
            <span>Total quotation value</span>
            <span className="text-primary">{inr(totals.grand)}</span>
          </div>
        </DocSection>

        {/* Terms */}
        <div className="pt-[22px]">
          <h4 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Terms & conditions</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Validity {pi.validity} from quotation date · 40% advance, 50% against material readiness, 10% on erection completion · Prices exclusive of site civil works and foundation bolts · Subject to IS 875 / IS 800 design review on award.
          </p>
        </div>
      </div>
    </div>
  )
}

function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-[22px] border-b border-border/50">
      <h4 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{title}</h4>
      {children}
    </div>
  )
}

function KVGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-x-7 gap-y-2.5 text-[13.5px]">
      {items.map(([k, v]) => (
        <div key={k}><span className="text-muted-foreground">{k}</span><div className="font-medium">{v}</div></div>
      ))}
    </div>
  )
}

function SummRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-[13.5px] py-[5px]"><span>{label}</span><span className="font-mono">{value}</span></div>
}
