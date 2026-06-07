import { useQuotationStore } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { InputUnit } from '@/components/quotation/shared/InputUnit'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Activity, HelpCircle } from 'lucide-react'

const ZONES = ['Zone II — 39 m/s', 'Zone III — 44 m/s', 'Zone IV — 47 m/s', 'Zone V — 50 m/s']
const TERRAINS = ['Category 1 — open', 'Category 2', 'Category 3 — suburban']

export function LoadingConditions() {
  const { structuralInputs: si, setStructuralInputs } = useQuotationStore()

  return (
    <SectionCard icon={<Activity className="w-3.5 h-3.5" />} title="Loading conditions">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        <div>
          <Label className="inline-flex items-center gap-1">
            Basic wind speed
            <TooltipProvider><Tooltip><TooltipTrigger asChild><HelpCircle className="w-3 h-3 text-muted-foreground" /></TooltipTrigger><TooltipContent>Vb per IS 875 Part 3 wind zone map.</TooltipContent></Tooltip></TooltipProvider>
          </Label>
          <InputUnit value={si.wind} onChange={(v) => setStructuralInputs({ wind: v })} unit="m/s" />
        </div>
        <div>
          <Label>Wind zone</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" value={si.zone} onChange={(e) => setStructuralInputs({ zone: e.target.value })}>
            {ZONES.map((z) => <option key={z}>{z}</option>)}
          </select>
        </div>
        <div>
          <Label>Live load (roof)</Label>
          <InputUnit value={si.liveLoad} onChange={(v) => setStructuralInputs({ liveLoad: v })} unit="kN/m²" step={0.05} />
        </div>
        <div>
          <Label>Terrain category</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" value={si.terrain} onChange={(e) => setStructuralInputs({ terrain: e.target.value })}>
            {TERRAINS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
    </SectionCard>
  )
}
