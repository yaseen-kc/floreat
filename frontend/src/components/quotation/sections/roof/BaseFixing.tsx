import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { ErrMsg } from '@/components/quotation/shared/FormField'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Anchor } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { roofFrameBaseFixingEnum } from '@/schemas/roof.schema'

/** Human-readable labels for the roof frame base fixing enum. */
const BASE_FIXING_OPTIONS: { value: (typeof roofFrameBaseFixingEnum.options)[number]; label: string }[] = [
  { value: 'FOUNDATION_BOLT', label: 'Foundation Bolt' },
  { value: 'ANCHOR_BOLT', label: 'Anchor Bolt' },
  { value: 'JOINT_BOLT_ON_STEEL_COLUMN', label: 'Joint Bolt on Steel Column' },
]

export function BaseFixing() {
  const { roof, setRoof, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      showValidation: s.showValidation,
    })),
  )
  // Required markers and error states come from the schema (SSOT), matching the
  // Step 1 sections, so the form can never disagree with the backend contract.
  const errors = showValidation ? getFieldErrors(roof) : {}

  return (
    <SectionCard icon={<Anchor className="w-3.5 h-3.5" />} title="Base Fixing">
      <div>
        <Label>Roof Frame Base Fixing {isRequired('roofFrameBaseFixing') && <span className="text-destructive">*</span>}</Label>
        <Select
          value={roof.roofFrameBaseFixing || undefined}
          onValueChange={(v) => setRoof({ roofFrameBaseFixing: v as RoofDraft['roofFrameBaseFixing'] })}
        >
          <SelectTrigger className="w-full" aria-invalid={Boolean(errors.roofFrameBaseFixing)}>
            <SelectValue placeholder="Select a fixing" />
          </SelectTrigger>
          <SelectContent>
            {BASE_FIXING_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.roofFrameBaseFixing && <ErrMsg>Roof Frame Base Fixing is required</ErrMsg>}
      </div>
    </SectionCard>
  )
}
