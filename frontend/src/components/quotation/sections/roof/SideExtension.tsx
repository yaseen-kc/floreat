import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { StretchHorizontal } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'

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

const FIELDS: { name: SideExtensionField; label: string; unit: string; step?: number }[] = [
  { name: 'roofExtensionWidthHeight', label: 'Roof Extension Width / Height', unit: 'm' },
  { name: 'roofExtensionMidFrameCount', label: 'Roof Extension Mid Frame Count', unit: 'count', step: 1 },
  { name: 'roofExtensionEndFrameCount', label: 'Roof Extension End Frame Count', unit: 'count', step: 1 },
  { name: 'claddingExtensionWidthHeight', label: 'Cladding Extension Width / Height', unit: 'm' },
  { name: 'claddingExtensionMidFrameCount', label: 'Cladding Extension Mid Frame Count', unit: 'count', step: 1 },
  { name: 'claddingExtensionEndFrameCount', label: 'Cladding Extension End Frame Count', unit: 'count', step: 1 },
  { name: 'sideColumnsWidthHeight', label: 'Side Columns Width / Height', unit: 'm' },
  { name: 'sideColumnsMidFrameCount', label: 'Side Columns Mid Frame Count', unit: 'count', step: 1 },
  { name: 'sideColumnsEndFrameCount', label: 'Side Columns End Frame Count', unit: 'count', step: 1 },
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

  return (
    <CollapsibleSection
      icon={<StretchHorizontal className="w-3.5 h-3.5" />}
      title="Side Extension"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('sideExtension', e)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        {FIELDS.map(({ name, label, unit, step }) => (
          <NumberField
            key={name}
            label={label}
            unit={unit}
            step={step}
            required={isRequired(name)}
            value={roof[name]}
            error={Boolean(errors[name])}
            onChange={(v) => {
              const patch: Partial<RoofDraft> = {}
              patch[name] = v
              setRoof(patch)
            }}
          />
        ))}
      </div>
    </CollapsibleSection>
  )
}
