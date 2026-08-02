import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField, type SelectFieldOption } from '@/components/quotation/shared/SelectField'
import { Layers } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { ROOF_SECTION_FIELDS } from '@/stores/quotation-store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

/** Human-readable labels for the covering-type enum. */
const COVERING_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'BARE_GALVALUME', label: 'Bare Galvalume' },
  { value: 'PPGL', label: 'PPGL' },
  { value: 'PUFF_SHEET', label: 'Puff Sheet' },
  { value: 'OTHER', label: 'Other' },
]

type CoveringTypeField = 'roofCoveringType' | 'claddingCoveringType'

export function Coverings() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.coverings,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof) : {}
  const sectionError = ROOF_SECTION_FIELDS.coverings.some((f) => Boolean(errors[f]))

  const setType = (name: CoveringTypeField) => (v: string) => {
    const patch: Partial<RoofDraft> = {}
    patch[name] = v as RoofDraft[CoveringTypeField]
    setRoof(patch)
  }

  return (
    <CollapsibleSection
      icon={<Layers className="w-3.5 h-3.5" />}
      title="Coverings"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('coverings', e)}
      error={sectionError}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-12">No</TableHead>
            <TableHead scope="col">Type</TableHead>
            <TableHead scope="col">Thick</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell className="min-w-48">
              <SelectField
                className="[&>label]:sr-only"
                label="Roof Covering Type"
                options={COVERING_TYPE_OPTIONS}
                required={isRequired('roofCoveringType')}
                value={roof.roofCoveringType}
                error={Boolean(errors.roofCoveringType)}
                onChange={setType('roofCoveringType')}
              />
            </TableCell>
            <TableCell className="min-w-36">
              <NumberField
                className="[&>label]:sr-only"
                label="Roof Covering Thickness"
                unit="mm"
                required={isRequired('roofCoveringThickness')}
                value={roof.roofCoveringThickness}
                error={Boolean(errors.roofCoveringThickness)}
                onChange={(v) => setRoof({ roofCoveringThickness: v })}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell className="min-w-48">
              <SelectField
                className="[&>label]:sr-only"
                label="Cladding Covering Type"
                options={COVERING_TYPE_OPTIONS}
                required={isRequired('claddingCoveringType')}
                value={roof.claddingCoveringType}
                error={Boolean(errors.claddingCoveringType)}
                onChange={setType('claddingCoveringType')}
              />
            </TableCell>
            <TableCell className="min-w-36">
              <NumberField
                className="[&>label]:sr-only"
                label="Cladding Covering Thickness"
                unit="mm"
                required={isRequired('claddingCoveringThickness')}
                value={roof.claddingCoveringThickness}
                error={Boolean(errors.claddingCoveringThickness)}
                onChange={(v) => setRoof({ claddingCoveringThickness: v })}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3</TableCell>
            <TableCell className="font-medium">Roof Area Deduction</TableCell>
            <TableCell className="min-w-36">
              <NumberField
                className="[&>label]:sr-only"
                label="Roof Area Deduction"
                unit="m²"
                required={isRequired('roofAreaDeduction')}
                value={roof.roofAreaDeduction}
                error={Boolean(errors.roofAreaDeduction)}
                onChange={(v) => setRoof({ roofAreaDeduction: v })}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CollapsibleSection>
  )
}
