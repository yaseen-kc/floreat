import { useQuotationStore } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { InputUnit } from '@/components/quotation/shared/InputUnit'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle, Triangle } from 'lucide-react'

const ROOF_TYPES = [
  { value: 'gable', label: 'Gable (double-slope)' },
  { value: 'mono', label: 'Mono-pitch (single-slope)' },
  { value: 'multi', label: 'Multi-bay (saw-tooth)' },
  { value: 'flat', label: 'Low-slope / flat' },
] as const

const MATERIAL_GRADES = ['IS 2062 E250 (Fe 410)', 'IS 2062 E350', 'ASTM A572 Gr.50']

export function RoofConfig() {
  const { structuralInputs: si, setStructuralInputs } = useQuotationStore()
  const showPitch = si.roofType === 'gable' || si.roofType === 'mono'

  return (
    <SectionCard icon={<Triangle className="w-3.5 h-3.5" />} title="Roof configuration">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        <div>
          <Label>Roof type</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" value={si.roofType} onChange={(e) => setStructuralInputs({ roofType: e.target.value as typeof si.roofType })}>
            {ROOF_TYPES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div>
          <Label>Material grade</Label>
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" value={si.materialGrade} onChange={(e) => setStructuralInputs({ materialGrade: e.target.value })}>
            {MATERIAL_GRADES.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {showPitch && (
        <div className="mt-4 animate-in fade-in duration-200">
          <span className="text-xs text-primary font-mono flex items-center gap-1 mb-3">↓ {si.roofType === 'gable' ? 'Gable' : 'Mono-pitch'}-specific fields</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
            <div>
              <Label className="inline-flex items-center gap-1">
                Roof pitch
                <TooltipProvider><Tooltip><TooltipTrigger asChild><HelpCircle className="w-3 h-3 text-muted-foreground" /></TooltipTrigger><TooltipContent>Slope angle from horizontal. Typical 1:10 ≈ 5.7°.</TooltipContent></Tooltip></TooltipProvider>
              </Label>
              <InputUnit value={si.pitch} onChange={(v) => setStructuralInputs({ pitch: v })} unit="deg" step={0.5} />
            </div>
            <div>
              <Label>Ridge ventilation</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                <option>None</option>
                <option>Ridge vent — continuous</option>
                <option>Turbo ventilators</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  )
}
