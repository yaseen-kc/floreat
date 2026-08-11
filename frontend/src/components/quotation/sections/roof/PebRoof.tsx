import { useQuotationStore, ROOF_SECTION_FIELDS } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { Warehouse } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

/** The numeric core dimensions, in display order, with their labels and units. */
type NumericField =
  | 'buildingOverallLength'
  | 'buildingOverallWidth'
  | 'eaveHeight'
  | 'roofSlope'
  | 'mainRoofFrames'
  | 'endRoofFrames'
  | 'roofPurlinSpacing'
  | 'claddingPurlins'
  | 'internalColumnsForMainRoofFrames'
  | 'internalColumnsForEndRoofFrames'

interface NumericFieldConfig {
  name: NumericField
  label: string
  unit: string
  /** Integer step for count fields; defaults to a continuous (decimal) input. */
  step?: number
}

const NUMERIC_FIELDS: NumericFieldConfig[] = [
  { name: 'buildingOverallLength', label: 'Building Overall Length', unit: 'm' },
  { name: 'buildingOverallWidth', label: 'Building Overall Width', unit: 'm' },
  { name: 'eaveHeight', label: 'Eave Height', unit: 'm' },
  { name: 'roofSlope', label: 'Roof Slope', unit: '°' },
  { name: 'mainRoofFrames', label: 'Main Roof Frames', unit: 'count', step: 1 },
  { name: 'endRoofFrames', label: 'End Roof Frames', unit: 'count', step: 1 },
  { name: 'roofPurlinSpacing', label: 'Roof Purlin Spacing', unit: 'm' },
  { name: 'claddingPurlins', label: 'Cladding Purlins', unit: 'count', step: 1 },
  { name: 'internalColumnsForMainRoofFrames', label: 'Internal Columns (Main Frames)', unit: 'count', step: 1 },
  { name: 'internalColumnsForEndRoofFrames', label: 'Internal Columns (End Frames)', unit: 'count', step: 1 },
]

export function PebRoof() {
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

  const fieldProps = ({ name, label, unit, step }: NumericFieldConfig) => ({
    label,
    unit,
    step,
    required: isRequired(name),
    value: roof[name] === 0 ? undefined : roof[name],
    error: Boolean(errors[name]),
    onChange: (v: number | undefined) => {
      // Core dimensions are required: a cleared input collapses to 0, which the
      // schema's `.positive()` still rejects, so the field stays flagged.
      const patch: Partial<RoofDraft> = {}
      patch[name] = v ?? 0
      setRoof(patch)
    },
  })

  return (
    <SectionCard icon={<Warehouse className="w-3.5 h-3.5" />} title="Pre-Engineered Building Roof">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-12">No</TableHead>
            <TableHead scope="col">Description</TableHead>
            <TableHead scope="col">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {NUMERIC_FIELDS.map((field, index) => (
            <TableRow key={field.name}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{field.label}</TableCell>
              <TableCell className="min-w-48">
                <NumberField className="[&>label]:sr-only" {...fieldProps(field)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SectionCard>
  )
}
