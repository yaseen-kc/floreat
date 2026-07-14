import { useQuotationStore } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { Frame } from 'lucide-react'
import { isRequired, getFieldErrors } from '@/schemas/roof.schema'
import { ROOF_SECTION_FIELDS } from '@/stores/quotation-store'

/** The integer member-count fields owned by this section, in display order. */
type MemberField =
  | 'columnSegmentsInMainFrame'
  | 'raftersInOneHalfOfMainFrame'
  | 'columnSegmentsInEndFrame'
  | 'raftersInOneHalfOfEndFrame'
  | 'endFrameHorizontalTieBeam'

const FIELDS: { name: MemberField; label: string }[] = [
  { name: 'columnSegmentsInMainFrame', label: 'Column Segments (Main Frame)' },
  { name: 'raftersInOneHalfOfMainFrame', label: 'Rafters in One Half (Main Frame)' },
  { name: 'columnSegmentsInEndFrame', label: 'Column Segments (End Frame)' },
  { name: 'raftersInOneHalfOfEndFrame', label: 'Rafters in One Half (End Frame)' },
  { name: 'endFrameHorizontalTieBeam', label: 'End Frame Horizontal Tie Beam' },
]

export function FrameMembers() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.members,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const errors = showValidation ? getFieldErrors(roof) : {}
  const sectionError = ROOF_SECTION_FIELDS.members.some((f) => Boolean(errors[f]))

  return (
    <CollapsibleSection
      icon={<Frame className="w-3.5 h-3.5" />}
      title="Members"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('members', e)}
      error={sectionError}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] desktop:gap-6">
        {FIELDS.map(({ name, label }) => (
          <NumberField
            key={name}
            label={label}
            unit="count"
            step={1}
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
