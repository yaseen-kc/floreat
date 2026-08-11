import { useQuotationStore, ROOF_SECTION_FIELDS } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { Weight } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function MaterialConsumption() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.materialConsumption,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof, enabled ? { requiredFields: ROOF_SECTION_FIELDS.materialConsumption } : { optionalFields: ROOF_SECTION_FIELDS.materialConsumption }) : {}
  const sectionError = ROOF_SECTION_FIELDS.materialConsumption.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<Weight className="w-3.5 h-3.5" />}
      title="Material Consumption"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('materialConsumption', e)}
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
            <TableCell className="font-medium">Material Consumption (Excluding Purlin)</TableCell>
            <TableCell className="min-w-48">
              <NumberField
                className="[&>label]:sr-only"
                label="Material Consumption (Excluding Purlin)"
                unit="kg/m²"
                required={isRequired('materialConsumptionExcludingPurlin', enabled)}
                value={roof.materialConsumptionExcludingPurlin}
                error={Boolean(errors.materialConsumptionExcludingPurlin)}
                onChange={(v) => setRoof({ materialConsumptionExcludingPurlin: v })}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CollapsibleSection>
  )
}
