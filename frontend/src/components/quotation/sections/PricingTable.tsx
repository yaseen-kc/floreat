import { useQuotationStore } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { InputUnit } from '@/components/quotation/shared/InputUnit'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrendingUp } from 'lucide-react'

function fmt(n: number) { return n.toLocaleString('en-IN', { maximumFractionDigits: 0 }) }

export function PricingTable() {
  const { pricing, setPricing, getCalc } = useQuotationStore()
  const calc = getCalc()

  const rows = [
    { item: 'Structural steel', auto: true, qty: `${fmt(calc.steelMass)} kg`, amt: calc.steelMass * pricing.steelRate, rateKey: 'steelRate' as const },
    { item: 'Roof & wall cladding', auto: true, qty: `${fmt(calc.cladArea)} m²`, amt: calc.cladArea * pricing.cladRate, rateKey: 'cladRate' as const },
    { item: 'Fabrication & labour', auto: false, qty: 'lot', amt: pricing.labour, rateKey: 'labour' as const },
    { item: 'Erection & cranage', auto: false, qty: 'lot', amt: pricing.erection, rateKey: 'erection' as const },
    { item: 'Transportation', auto: false, qty: 'lot', amt: pricing.transport, rateKey: 'transport' as const },
    { item: 'Hardware & fasteners', auto: false, qty: 'lot', amt: pricing.hardware, rateKey: 'hardware' as const },
  ]

  return (
    <SectionCard icon={<TrendingUp className="w-3.5 h-3.5" />} title="Line items" className="m-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Rate (₹)</TableHead>
              <TableHead className="text-right">Amount (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.rateKey}>
                <TableCell>{r.item}{r.auto && <span className="ml-1.5 text-[10px] font-mono text-muted-foreground bg-muted px-1 py-px rounded">auto</span>}</TableCell>
                <TableCell className="text-right font-mono text-[13px]">{r.qty}</TableCell>
                <TableCell className="text-right">
                  <input
                    type="number"
                    className="w-[110px] px-2 py-1.5 text-right font-mono text-sm border border-transparent rounded-md bg-transparent hover:border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={pricing[r.rateKey]}
                    onChange={(e) => setPricing({ [r.rateKey]: parseFloat(e.target.value) || 0 })}
                  />
                </TableCell>
                <TableCell className="text-right font-mono text-[13.5px]">{fmt(r.amt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <hr className="my-4 border-border" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        <div>
          <Label>Discount</Label>
          <InputUnit value={pricing.discount} onChange={(v) => setPricing({ discount: v })} unit="%" step={0.5} />
        </div>
        <div>
          <Label>Profit margin</Label>
          <InputUnit value={pricing.margin} onChange={(v) => setPricing({ margin: v })} unit="%" step={0.5} />
        </div>
        <div>
          <Label>GST</Label>
          <InputUnit value={pricing.gst} onChange={(v) => setPricing({ gst: v })} unit="%" step={1} />
        </div>
        <div>
          <Label>Additional charges</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground text-xs font-mono">₹</span>
            <input
              type="number"
              className="flex h-9 w-full rounded-l-none rounded-r-md border border-input bg-background px-3 py-1 text-sm font-mono"
              value={pricing.additional}
              onChange={(e) => setPricing({ additional: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
