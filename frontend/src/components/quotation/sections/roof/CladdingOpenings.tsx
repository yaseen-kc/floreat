import { useQuotationStore, ROOF_SECTION_FIELDS } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { DoorOpen } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type CladdingOpeningField =
  | 'frontCladdingOpeningArea'
  | 'backCladdingOpeningArea'
  | 'rightCladdingOpeningArea'
  | 'leftCladdingOpeningArea'

const FIELDS: { name: CladdingOpeningField; label: string }[] = [
  { name: 'frontCladdingOpeningArea', label: 'Front Cladding Opening Area' },
  { name: 'backCladdingOpeningArea', label: 'Back Cladding Opening Area' },
  { name: 'rightCladdingOpeningArea', label: 'Right Cladding Opening Area' },
  { name: 'leftCladdingOpeningArea', label: 'Left Cladding Opening Area' },
]

export function CladdingOpenings() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.claddingOpenings,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof, enabled ? { requiredFields: ROOF_SECTION_FIELDS.claddingOpenings } : { optionalFields: ROOF_SECTION_FIELDS.claddingOpenings }) : {}
  const sectionError = ROOF_SECTION_FIELDS.claddingOpenings.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<DoorOpen className="w-3.5 h-3.5" />}
      title="Cladding Openings"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('claddingOpenings', e)}
      error={sectionError}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-12">No</TableHead>
            <TableHead scope="col">Side</TableHead>
            <TableHead scope="col">Area</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {FIELDS.map(({ name, label }, index) => (
            <TableRow key={name}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{label.replace(' Cladding Opening Area', '')}</TableCell>
              <TableCell className="min-w-48">
                <NumberField
                  className="[&>label]:sr-only"
                  label={label}
                  unit="m²"
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
        </TableBody>
      </Table>
    </CollapsibleSection>
  )
}
