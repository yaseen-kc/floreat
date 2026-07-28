import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField, type SelectFieldOption } from '@/components/quotation/shared/SelectField'
import { Columns3 } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { ROOF_SECTION_FIELDS } from '@/stores/quotation-store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

/** Human-readable labels for the purlin material-type enum. */
const PURLIN_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'Z_C', label: 'Z / C Section' },
  { value: 'TUBE', label: 'Tube' },
]

type PurlinTypeField = 'roofPurlinType' | 'claddingPurlinType'
export function Purlins() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.purlins,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof) : {}
  const sectionError = ROOF_SECTION_FIELDS.purlins.some((f) => Boolean(errors[f]))

  const setType = (name: PurlinTypeField) => (v: string) => {
    const patch: Partial<RoofDraft> = {}
    patch[name] = v as RoofDraft[PurlinTypeField]
    setRoof(patch)
  }

  return (
    <CollapsibleSection
      icon={<Columns3 className="w-3.5 h-3.5" />}
      title="Purlins"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('purlins', e)}
      error={sectionError}
    >
      <div className="overflow-x-auto">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Depth</TableHead>
              <TableHead>Unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell className="font-medium">Roof Purlin</TableCell>
              <TableCell className="min-w-48">
                <SelectField
                  label="Roof Purlin Type"
                  className="[&>label]:sr-only"
                  options={PURLIN_TYPE_OPTIONS}
                  required={isRequired('roofPurlinType')}
                  value={roof.roofPurlinType}
                  error={Boolean(errors.roofPurlinType)}
                  onChange={setType('roofPurlinType')}
                />
              </TableCell>
              <TableCell className="min-w-36">
                <NumberField
                  label="Roof Purlin Depth"
                  className="[&>label]:sr-only"
                  unit="mm"
                  required={isRequired('roofPurlinDepth')}
                  value={roof.roofPurlinDepth}
                  error={Boolean(errors.roofPurlinDepth)}
                  onChange={(v) => setRoof({ roofPurlinDepth: v })}
                />
              </TableCell>
              <TableCell className="min-w-36">
                <NumberField
                  label="Roof Purlin Unit Weight"
                  className="[&>label]:sr-only"
                  unit="kg/m"
                  required={isRequired('roofPurlinUnitWeight')}
                  value={roof.roofPurlinUnitWeight}
                  error={Boolean(errors.roofPurlinUnitWeight)}
                  onChange={(v) => setRoof({ roofPurlinUnitWeight: v })}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell className="font-medium">Cladding Purlin</TableCell>
              <TableCell className="min-w-48">
                <SelectField
                  label="Cladding Purlin Type"
                  className="[&>label]:sr-only"
                  options={PURLIN_TYPE_OPTIONS}
                  required={isRequired('claddingPurlinType')}
                  value={roof.claddingPurlinType}
                  error={Boolean(errors.claddingPurlinType)}
                  onChange={setType('claddingPurlinType')}
                />
              </TableCell>
              <TableCell className="min-w-36">
                <NumberField
                  label="Cladding Purlin Depth"
                  className="[&>label]:sr-only"
                  unit="mm"
                  required={isRequired('claddingPurlinDepth')}
                  value={roof.claddingPurlinDepth}
                  error={Boolean(errors.claddingPurlinDepth)}
                  onChange={(v) => setRoof({ claddingPurlinDepth: v })}
                />
              </TableCell>
              <TableCell className="min-w-36">
                <NumberField
                  label="Cladding Purlin Unit Weight"
                  className="[&>label]:sr-only"
                  unit="kg/m"
                  required={isRequired('claddingPurlinUnitWeight')}
                  value={roof.claddingPurlinUnitWeight}
                  error={Boolean(errors.claddingPurlinUnitWeight)}
                  onChange={(v) => setRoof({ claddingPurlinUnitWeight: v })}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </CollapsibleSection>
  )
}
