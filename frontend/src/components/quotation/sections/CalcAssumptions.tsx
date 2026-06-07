import { useQuotationStore } from '@/stores/quotation-store'
import { InputUnit } from '@/components/quotation/shared/InputUnit'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle, RotateCcw } from 'lucide-react'

export function CalcAssumptions({ hasError }: { hasError: boolean }) {
  const { assumptions, setAssumptions, resetAssumptions } = useQuotationStore()

  return (
    <div className="p-[22px] border-r border-border">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Editable assumptions</span>
        <Badge variant={hasError ? 'destructive' : 'default'} className="gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${hasError ? 'bg-destructive' : 'bg-emerald-500'}`} />
          {hasError ? 'Error' : 'Live'}
        </Badge>
      </div>

      <div className="flex flex-col gap-3.5">
        <div>
          <Label className="inline-flex items-center gap-1 text-xs">
            Steel intensity
            <TooltipProvider><Tooltip><TooltipTrigger asChild><HelpCircle className="w-3 h-3 text-muted-foreground" /></TooltipTrigger><TooltipContent>Estimated structural steel weight per m² of plan area. Tune from past projects.</TooltipContent></Tooltip></TooltipProvider>
          </Label>
          <InputUnit value={assumptions.intensity} onChange={(v) => setAssumptions({ intensity: v })} unit="kg/m²" />
        </div>
        <div>
          <Label className="text-xs">Connection / wastage allowance</Label>
          <InputUnit value={assumptions.waste} onChange={(v) => setAssumptions({ waste: v })} unit="%" step={0.5} />
        </div>
        <div>
          <Label className="text-xs">Cladding overlap factor</Label>
          <InputUnit value={assumptions.overlap} onChange={(v) => setAssumptions({ overlap: v })} unit="×" step={0.01} />
        </div>
        <div>
          <Label className="text-xs">Importance / risk factor (k₁)</Label>
          <InputUnit value={assumptions.k1} onChange={(v) => setAssumptions({ k1: v })} unit="—" step={0.05} />
        </div>

        <hr className="border-border" />
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Geometry source</span>
          <Badge variant="secondary" className="gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Step 2 inputs</Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">Change a value above and the dependent outputs on the right re-compute instantly and flash.</p>
        <Button variant="secondary" size="sm" onClick={resetAssumptions} className="self-start">
          <RotateCcw className="w-3.5 h-3.5" /> Reset assumptions
        </Button>
      </div>
    </div>
  )
}
