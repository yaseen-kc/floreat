import { useQuotationStore, ROOF_SECTION_FIELDS } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { PanelTop } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type PolycarbonateField =
  | 'polycarbonateRoofLength'
  | 'polycarbonateRoofWidth'
  | 'polycarbonateRoofCount'

const FIELDS: { name: PolycarbonateField; label: string; unit: string; step?: number }[] = [
  { name: 'polycarbonateRoofLength', label: 'Polycarbonate Roof Length', unit: 'm' },
  { name: 'polycarbonateRoofWidth', label: 'Polycarbonate Roof Width', unit: 'm' },
  { name: 'polycarbonateRoofCount', label: 'Polycarbonate Roof Count', unit: 'count', step: 1 },
]

export function Polycarbonate() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.polycarbonate,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof, enabled ? { requiredFields: ROOF_SECTION_FIELDS.polycarbonate } : { optionalFields: ROOF_SECTION_FIELDS.polycarbonate }) : {}
  const sectionError = ROOF_SECTION_FIELDS.polycarbonate.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<PanelTop className="w-3.5 h-3.5" />}
      title="Polycarbonate"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('polycarbonate', e)}
      error={sectionError}
    >
      <Table className="min-w-[720px]">
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-12">No</TableHead>
            <TableHead scope="col">Type</TableHead>
            <TableHead scope="col">Length</TableHead>
            <TableHead scope="col">Width</TableHead>
            <TableHead scope="col">Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell className="font-medium">Polycarbonate Roof</TableCell>
            {FIELDS.map(({ name, label, unit, step }) => (
              <TableCell key={name} className="min-w-36">
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
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </CollapsibleSection>
  )
}
