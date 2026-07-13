import { useShallow } from 'zustand/react/shallow'
import { useQuotationStore } from '@/stores/quotation-store'
import type { JointDraft } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField } from '@/components/quotation/shared/SelectField'
import { Layers, PanelTop, Grid3x3, Tent } from 'lucide-react'
import { BOLT_TYPE_OPTIONS } from './jointOptions'

/** One scalar bolt group: a bolt type, diameter and count triple in the draft. */
interface ScalarGroup {
  title: string
  icon: React.ReactNode
  typeKey: keyof JointDraft
  diameterKey: keyof JointDraft
  countKey: keyof JointDraft
}

const SCALAR_GROUPS: ScalarGroup[] = [
  {
    title: 'Secondary Beams',
    icon: <Layers className="w-3.5 h-3.5" />,
    typeKey: 'secondaryBeamsBoltType',
    diameterKey: 'secondaryBeamsBoltDiameter',
    countKey: 'secondaryBeamsNumberOfBolts',
  },
  {
    title: 'Purlins & Flange Brace',
    icon: <PanelTop className="w-3.5 h-3.5" />,
    typeKey: 'purlinFlangeBraceBoltType',
    diameterKey: 'purlinFlangeBraceBoltDiameter',
    countKey: 'purlinFlangeBraceNumberOfBolts',
  },
  {
    title: 'Cladding Purlins',
    icon: <Grid3x3 className="w-3.5 h-3.5" />,
    typeKey: 'claddingPurlinsBoltType',
    diameterKey: 'claddingPurlinsBoltDiameter',
    countKey: 'claddingPurlinsNumberOfBolts',
  },
  {
    title: 'Canopy',
    icon: <Tent className="w-3.5 h-3.5" />,
    typeKey: 'canopyBoltType',
    diameterKey: 'canopyBoltDiameter',
    countKey: 'canopyNumberOfBolts',
  },
]

/**
 * The scalar (non-array) joint bolt specs: four fixed bolt groups (secondary
 * beams, purlins & flange brace, cladding purlins, canopy), each a bolt type +
 * diameter + count. Every field is optional and dropped from the payload when
 * left blank.
 */
export function ScalarBoltGroups() {
  const { joint, setJoint } = useQuotationStore(
    useShallow((s) => ({ joint: s.joint, setJoint: s.setJoint })),
  )

  return (
    <>
      {SCALAR_GROUPS.map((g) => (
        <SectionCard key={g.title} icon={g.icon} title={g.title}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
            <SelectField
              label="Bolt Type"
              options={BOLT_TYPE_OPTIONS}
              required={false}
              error={false}
              value={joint[g.typeKey] as string | undefined}
              onChange={(v) => setJoint({ [g.typeKey]: v || undefined } as Partial<JointDraft>)}
            />
            <NumberField
              label="Bolt Diameter"
              unit="mm"
              required={false}
              error={false}
              value={joint[g.diameterKey] as number | undefined}
              onChange={(v) => setJoint({ [g.diameterKey]: v } as Partial<JointDraft>)}
            />
            <NumberField
              label="No. of Bolts"
              unit="count"
              step={1}
              required={false}
              error={false}
              value={joint[g.countKey] as number | undefined}
              onChange={(v) => setJoint({ [g.countKey]: v } as Partial<JointDraft>)}
            />
          </div>
        </SectionCard>
      ))}
    </>
  )
}
