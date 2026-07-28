import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { Spline } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { ROOF_SECTION_FIELDS } from '@/stores/quotation-store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type FlangeBraceField =
  | 'roofFlangeBraceAverageLength'
  | 'claddingFlangeBraceAverageLength'
  | 'endFrameFlangeBraceAverageLength'

const FIELDS: { name: FlangeBraceField; label: string }[] = [
  { name: 'roofFlangeBraceAverageLength', label: 'Roof Flange Brace Average Length' },
  { name: 'claddingFlangeBraceAverageLength', label: 'Cladding Flange Brace Average Length' },
  { name: 'endFrameFlangeBraceAverageLength', label: 'End Frame Flange Brace Average Length' },
]

export function FlangeBrace() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.flangeBrace,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof) : {}
  const sectionError = ROOF_SECTION_FIELDS.flangeBrace.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<Spline className="w-3.5 h-3.5" />}
      title="Flange Brace"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('flangeBrace', e)}
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
          {FIELDS.map(({ name, label }, index) => (
            <TableRow key={name}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{label}</TableCell>
              <TableCell className="min-w-48">
                <NumberField
                  className="[&>label]:sr-only"
                  label={label}
                  unit="m"
                  required={isRequired(name)}
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
        </TableBody>
      </Table>
    </CollapsibleSection>
  )
}
