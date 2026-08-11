import { useQuotationStore, ROOF_SECTION_FIELDS } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { Spline } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type SagRodField = 'diaOfRoofSagRod' | 'diaOfCladdingSagRod'

const FIELDS: { name: SagRodField; label: string; unit: string }[] = [
  { name: 'diaOfRoofSagRod', label: 'Roof SAG Rod Diameter', unit: 'mm' },
  { name: 'diaOfCladdingSagRod', label: 'Cladding SAG Rod Diameter', unit: 'mm' },
]

export function SagRod() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.sagRod,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof, enabled ? { requiredFields: ROOF_SECTION_FIELDS.sagRod } : { optionalFields: ROOF_SECTION_FIELDS.sagRod }) : {}
  const sectionError = ROOF_SECTION_FIELDS.sagRod.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<Spline className="w-3.5 h-3.5" />}
      title="SAG Rod"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('sagRod', e)}
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
          {FIELDS.map(({ name, label, unit }, index) => (
            <TableRow key={name}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{label}</TableCell>
              <TableCell className="min-w-48">
                <NumberField
                  className="[&>label]:sr-only"
                  label={label}
                  unit={unit}
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
