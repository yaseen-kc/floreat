import { useQuotationStore, ROOF_SECTION_FIELDS } from '@/stores/quotation-store'
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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
  const disabledSectionFields = Object.values(ROOF_SECTION_FIELDS).flat()
  const errors = showValidation ? getFieldErrors(roof, { optionalFields: disabledSectionFields }) : {}

  return (
    <SectionCard icon={<Anchor className="w-3.5 h-3.5" />} title="Base Fixing">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-12">No</TableHead>
            <TableHead scope="col">Description</TableHead>
            <TableHead scope="col">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell className="font-medium">Roof Frame Base Fixing</TableCell>
            <TableCell className="min-w-48">
              <div>
                <Label className="sr-only">Roof Frame Base Fixing {isRequired('roofFrameBaseFixing') && <span className="text-destructive">*</span>}</Label>
                <Select
                  value={roof.roofFrameBaseFixing ?? ''}
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
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </SectionCard>
  )
}
