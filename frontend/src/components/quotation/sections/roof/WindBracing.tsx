import { useQuotationStore, ROOF_SECTION_FIELDS } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField, type SelectFieldOption } from '@/components/quotation/shared/SelectField'
import { Wind } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const WIND_BRACING_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'ROD', label: 'Rod' },
  { value: 'TUBE', label: 'Tube' },
]

type WindBracingNumberField =
  | 'roofWindBracingSegmentsInOneHalf'
  | 'columnWindBracingSegments'
  | 'roofWindBracingProvidedBays'
  | 'columnWindBracingProvidedBays'
  | 'windBracingColumnHeight'
  | 'windBracingUnitWeight'

const NUMBER_FIELDS: { name: WindBracingNumberField; label: string; unit: string; step?: number }[] = [
  { name: 'roofWindBracingSegmentsInOneHalf', label: 'Roof Wind Bracing Segments (One Half)', unit: 'count', step: 1 },
  { name: 'columnWindBracingSegments', label: 'Column Wind Bracing Segments', unit: 'count', step: 1 },
  { name: 'roofWindBracingProvidedBays', label: 'Roof Wind Bracing Provided Bays', unit: 'count', step: 1 },
  { name: 'columnWindBracingProvidedBays', label: 'Column Wind Bracing Provided Bays', unit: 'count', step: 1 },
  { name: 'windBracingColumnHeight', label: 'Wind Bracing Column Height', unit: 'm' },
  { name: 'windBracingUnitWeight', label: 'Wind Bracing Unit Weight', unit: 'kg/m' },
]

type DerivedField = 'roofWindBracingBaySpacing' | 'columnWindBracingBaySpacing' | 'roofWindBracingLength' | 'columnWindBracingLength'

const DERIVED_FIELDS: { name: DerivedField; label: string; unit: string }[] = [
  { name: 'roofWindBracingBaySpacing', label: 'Roof Wind Bracing Bay Spacing', unit: 'm' },
  { name: 'columnWindBracingBaySpacing', label: 'Column Wind Bracing Bay Spacing', unit: 'm' },
  { name: 'roofWindBracingLength', label: 'Roof Wind Bracing Length', unit: 'm' },
  { name: 'columnWindBracingLength', label: 'Column Wind Bracing Length', unit: 'm' },
]

export function WindBracing() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.windBracing,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof, enabled ? { requiredFields: ROOF_SECTION_FIELDS.windBracing } : { optionalFields: ROOF_SECTION_FIELDS.windBracing }) : {}
  const sectionError = ROOF_SECTION_FIELDS.windBracing.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<Wind className="w-3.5 h-3.5" />}
      title="Wind Bracing"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('windBracing', e)}
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
            <TableCell className="font-medium">Wind Bracing Type</TableCell>
            <TableCell className="min-w-48">
              <SelectField
                className="[&>label]:sr-only"
                label="Wind Bracing Type"
                options={WIND_BRACING_TYPE_OPTIONS}
                required={isRequired('windBracingType', enabled)}
                value={roof.windBracingType}
                error={Boolean(errors.windBracingType)}
                onChange={(v) => setRoof({ windBracingType: v as RoofDraft['windBracingType'] })}
              />
            </TableCell>
          </TableRow>
          {NUMBER_FIELDS.map(({ name, label, unit, step }, index) => (
            <TableRow key={name}>
              <TableCell>{index + 2}</TableCell>
              <TableCell className="font-medium">{label}</TableCell>
              <TableCell className="min-w-48">
                <NumberField
                  className="[&>label]:sr-only"
                  label={label}
                  unit={unit}
                  step={step}
                  required={isRequired(name, enabled)}
                  value={roof[name]}
                  error={Boolean(errors[name])}
                  onChange={(v) => {
                    const patch: Partial<RoofDraft> = {}
                    patch[name] = v
                    setRoof(patch)
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
          {DERIVED_FIELDS.map(({ name, label, unit }, index) => (
            <TableRow key={name}>
              <TableCell>{index + NUMBER_FIELDS.length + 2}</TableCell>
              <TableCell className="font-medium">{label}</TableCell>
              <TableCell className="min-w-48">
                <NumberField
                  className="[&>label]:sr-only"
                  label={label}
                  unit={unit}
                  readOnly
                  required={false}
                  value={roof[name]}
                  error={false}
                  onChange={() => {}}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CollapsibleSection>
  )
}
