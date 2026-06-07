import { useQuotationStore } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { InputUnit } from '@/components/quotation/shared/InputUnit'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Home, HelpCircle } from 'lucide-react'

export function BuildingDimensions() {
  const { structuralInputs: si, setStructuralInputs } = useQuotationStore()

  return (
    <SectionCard icon={<Home className="w-3.5 h-3.5" />} title="Building dimensions">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        <div>
          <Label className="inline-flex items-center gap-1">
            Length
            <TooltipProvider><Tooltip><TooltipTrigger asChild><HelpCircle className="w-3 h-3 text-muted-foreground" /></TooltipTrigger><TooltipContent>Overall building length along the eave.</TooltipContent></Tooltip></TooltipProvider>
          </Label>
          <InputUnit value={si.length} onChange={(v) => setStructuralInputs({ length: v })} unit="m" />
        </div>
        <div>
          <Label>Width / clear span</Label>
          <InputUnit value={si.width} onChange={(v) => setStructuralInputs({ width: v })} unit="m" />
        </div>
        <div>
          <Label>Eave height</Label>
          <InputUnit value={si.eave} onChange={(v) => setStructuralInputs({ eave: v })} unit="m" step={0.1} />
        </div>
        <div>
          <Label className="inline-flex items-center gap-1">
            Bay spacing
            <TooltipProvider><Tooltip><TooltipTrigger asChild><HelpCircle className="w-3 h-3 text-muted-foreground" /></TooltipTrigger><TooltipContent>Centre-to-centre spacing of main frames.</TooltipContent></Tooltip></TooltipProvider>
          </Label>
          <InputUnit value={si.bay} onChange={(v) => setStructuralInputs({ bay: v })} unit="m" step={0.5} />
        </div>
      </div>
    </SectionCard>
  )
}
