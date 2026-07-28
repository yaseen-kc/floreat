import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { RectangleHorizontal } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type FasciaField = 'fasciaBoardArea' | 'fasciaMaterialWeightPerSqft'

const FIELDS: { name: FasciaField; label: string; unit: string }[] = [
  { name: 'fasciaBoardArea', label: 'Fascia Board Area', unit: 'm²' },
  { name: 'fasciaMaterialWeightPerSqft', label: 'Fascia Material Weight', unit: 'kg/ft²' },
]

export function FasciaBoard() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.fasciaBoard,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof) : {}

  return (
    <CollapsibleSection
      icon={<RectangleHorizontal className="w-3.5 h-3.5" />}
      title="Fascia Board"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('fasciaBoard', e)}
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
