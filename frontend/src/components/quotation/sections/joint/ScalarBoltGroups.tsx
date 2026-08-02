import { useShallow } from 'zustand/react/shallow'
import { useQuotationStore } from '@/stores/quotation-store'
import type { JointDraft } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField } from '@/components/quotation/shared/SelectField'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
    title: 'Joint Bolt For Secondary Beams',
    icon: <Layers className="w-3.5 h-3.5" />,
    typeKey: 'secondaryBeamsBoltType',
    diameterKey: 'secondaryBeamsBoltDiameter',
    countKey: 'secondaryBeamsNumberOfBolts',
  },
  {
    title: 'Bolt For Purlins + Flange Brace',
    icon: <PanelTop className="w-3.5 h-3.5" />,
    typeKey: 'purlinFlangeBraceBoltType',
    diameterKey: 'purlinFlangeBraceBoltDiameter',
    countKey: 'purlinFlangeBraceNumberOfBolts',
  },
  {
    title: 'Bolt For Cladding Purlins',
    icon: <Grid3x3 className="w-3.5 h-3.5" />,
    typeKey: 'claddingPurlinsBoltType',
    diameterKey: 'claddingPurlinsBoltDiameter',
    countKey: 'claddingPurlinsNumberOfBolts',
  },
  {
    title: 'Joint Bolt For Canopy',
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
          <Table className="min-w-[680px] border-collapse text-sm">
            <TableHeader>
              <TableRow className="bg-muted/50 border-b">
                <TableHead scope="col" className="w-12 text-center">SL</TableHead>
                <TableHead scope="col" className="min-w-48">Type</TableHead>
                <TableHead scope="col" className="min-w-48">Dia Of Bolt</TableHead>
                <TableHead scope="col" className="min-w-48">No Of Bolt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center text-muted-foreground">1</TableCell>
                <TableCell>
                  <SelectField
                    className="[&>label]:sr-only"
                    label={`${g.title} bolt type`}
                    options={BOLT_TYPE_OPTIONS}
                    required={false}
                    error={false}
                    value={joint[g.typeKey] as string | undefined}
                    onChange={(value) => setJoint({ [g.typeKey]: value || undefined } as Partial<JointDraft>)}
                  />
                </TableCell>
                <TableCell>
                  <NumberField
                    className="[&>label]:sr-only"
                    label={`${g.title} bolt diameter`}
                    unit="mm"
                    required={false}
                    error={false}
                    value={joint[g.diameterKey] as number | undefined}
                    onChange={(value) => setJoint({ [g.diameterKey]: value } as Partial<JointDraft>)}
                  />
                </TableCell>
                <TableCell>
                  <NumberField
                    className="[&>label]:sr-only"
                    label={`${g.title} number of bolts`}
                    unit="count"
                    step={1}
                    required={false}
                    error={false}
                    value={joint[g.countKey] as number | undefined}
                    onChange={(value) => setJoint({ [g.countKey]: value } as Partial<JointDraft>)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </SectionCard>
      ))}
    </>
  )
}
