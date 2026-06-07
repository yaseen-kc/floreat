import { useQuotationStore } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { InputUnit } from '@/components/quotation/shared/InputUnit'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { PanelTop } from 'lucide-react'

const WALL_CLADDINGS = ['0.5mm bare galvalume', '0.5mm colour-coated', 'Insulated sandwich panel']

export function SidewallCladding() {
  const { structuralInputs: si, setStructuralInputs } = useQuotationStore()

  return (
    <SectionCard
      icon={<PanelTop className="w-3.5 h-3.5" />}
      title="Sidewalls & cladding"
      action={<Switch checked={si.sidewall} onCheckedChange={(v) => setStructuralInputs({ sidewall: v })} />}
    >
      {si.sidewall && (
        <div className="animate-in fade-in duration-200">
          <span className="text-xs text-primary font-mono flex items-center gap-1 mb-3">— Sidewall configuration enabled</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
            <div>
              <Label>Wall cladding</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" value={si.wallCladding} onChange={(e) => setStructuralInputs({ wallCladding: e.target.value })}>
                {WALL_CLADDINGS.map((w) => <option key={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <Label>Glazing / openings</Label>
              <InputUnit value={si.glazing} onChange={(v) => setStructuralInputs({ glazing: v })} unit="%" />
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  )
}
