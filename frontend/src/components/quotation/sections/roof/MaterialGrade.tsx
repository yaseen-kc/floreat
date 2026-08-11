import { useQuotationStore, ROOF_SECTION_FIELDS } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { SelectField, type SelectFieldOption } from '@/components/quotation/shared/SelectField'
import { Grid2x2 } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

/** Human-readable labels for the plate material grade enum. */
const GRADE_OPTIONS: SelectFieldOption[] = [
  { value: 'FE_250', label: 'FE 250' },
  { value: 'FE_345', label: 'FE 345' },
  { value: 'FE_400', label: 'FE 400' },
]

export function MaterialGrade() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.materialGrade,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof, enabled ? { requiredFields: ROOF_SECTION_FIELDS.materialGrade } : { optionalFields: ROOF_SECTION_FIELDS.materialGrade }) : {}
  const sectionError = ROOF_SECTION_FIELDS.materialGrade.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<Grid2x2 className="w-3.5 h-3.5" />}
      title="Material Grade"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('materialGrade', e)}
      error={sectionError}
    >
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
            <TableCell className="font-medium">Grade of Plate Material</TableCell>
            <TableCell className="min-w-48">
              <SelectField
                className="[&>label]:sr-only"
                label="Grade of Plate Material"
                options={GRADE_OPTIONS}
                required={isRequired('gradeOfPlateMaterial', enabled)}
                value={roof.gradeOfPlateMaterial}
                error={Boolean(errors.gradeOfPlateMaterial)}
                onChange={(v) => setRoof({ gradeOfPlateMaterial: v as RoofDraft['gradeOfPlateMaterial'] })}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CollapsibleSection>
  )
}
