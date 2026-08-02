import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { StretchHorizontal } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { ROOF_SECTION_FIELDS } from '@/stores/quotation-store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type SideExtensionField =
  | 'roofExtensionWidthHeight'
  | 'roofExtensionMidFrameCount'
  | 'roofExtensionEndFrameCount'
  | 'claddingExtensionWidthHeight'
  | 'claddingExtensionMidFrameCount'
  | 'claddingExtensionEndFrameCount'
  | 'sideColumnsWidthHeight'
  | 'sideColumnsMidFrameCount'
  | 'sideColumnsEndFrameCount'

const ROWS: {
  label: string
  widthHeight: { name: SideExtensionField; label: string; unit: string; step?: number }
  midFrame: { name: SideExtensionField; label: string; unit: string; step?: number }
  endFrame: { name: SideExtensionField; label: string; unit: string; step?: number }
}[] = [
  {
    label: 'Roof Extension',
    widthHeight: { name: 'roofExtensionWidthHeight', label: 'Roof Extension Width / Height', unit: 'm' },
    midFrame: { name: 'roofExtensionMidFrameCount', label: 'Roof Extension Mid Frame Count', unit: 'count', step: 1 },
    endFrame: { name: 'roofExtensionEndFrameCount', label: 'Roof Extension End Frame Count', unit: 'count', step: 1 },
  },
  {
    label: 'Cladding Extension',
    widthHeight: { name: 'claddingExtensionWidthHeight', label: 'Cladding Extension Width / Height', unit: 'm' },
    midFrame: { name: 'claddingExtensionMidFrameCount', label: 'Cladding Extension Mid Frame Count', unit: 'count', step: 1 },
    endFrame: { name: 'claddingExtensionEndFrameCount', label: 'Cladding Extension End Frame Count', unit: 'count', step: 1 },
  },
  {
    label: 'Side Columns',
    widthHeight: { name: 'sideColumnsWidthHeight', label: 'Side Columns Width / Height', unit: 'm' },
    midFrame: { name: 'sideColumnsMidFrameCount', label: 'Side Columns Mid Frame Count', unit: 'count', step: 1 },
    endFrame: { name: 'sideColumnsEndFrameCount', label: 'Side Columns End Frame Count', unit: 'count', step: 1 },
  },
]

export function SideExtension() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.sideExtension,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof) : {}
  const sectionError = ROOF_SECTION_FIELDS.sideExtension.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<StretchHorizontal className="w-3.5 h-3.5" />}
      title="Side Extension"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('sideExtension', e)}
      error={sectionError}
    >
      <Table className="min-w-[720px]">
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-12">SL</TableHead>
            <TableHead scope="col">Item</TableHead>
            <TableHead scope="col">W/H (M)</TableHead>
            <TableHead scope="col">Mid Frame</TableHead>
            <TableHead scope="col">End Frame</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map(({ label, widthHeight, midFrame, endFrame }, index) => (
            <TableRow key={label}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{label}</TableCell>
              {[widthHeight, midFrame, endFrame].map((field) => {
                const readOnly = field.name.startsWith('sideColumns')
                return (
                  <TableCell key={field.name} className="min-w-36">
                    <NumberField
                      className="[&>label]:sr-only"
                      label={field.label}
                      unit={field.unit}
                      step={field.step}
                      readOnly={readOnly}
                      required={!readOnly && isRequired(field.name)}
                      value={roof[field.name]}
                      error={!readOnly && Boolean(errors[field.name])}
                      onChange={(v) => {
                        if (!readOnly) {
                          const patch: Partial<RoofDraft> = {}
                          patch[field.name] = v
                          setRoof(patch)
                        }
                      }}
                    />
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CollapsibleSection>
  )
}
