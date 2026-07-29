import type { ReactNode } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useQuotationStore } from '@/stores/quotation-store'
import type {
  JointDraft,
  JointBoltRoofDraft,
  JointBoltMezzanineDraft,
  FoundationBoltRoofDraft,
} from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { jointIdLabel } from './jointOptions'
import { boltDiameterRule, boltCountRule, type BoltFieldGroup } from './boltFieldRules'

/** Which store array (and thus id field) a table edits. */
export type JointGroup = BoltFieldGroup

interface JointBoltTableProps {
  group: JointGroup
  title: string
  icon: ReactNode
  /** `count` shows a bolt-count field only (mezzanine); `diameterAndCount` adds a diameter field. */
  columns: 'count' | 'diameterAndCount'
  /** Optional muted helper line shown under the title. */
  hint?: string
}

/** The store array key + row id field for each group. */
const GROUP_CONFIG: Record<
  JointGroup,
  { arrayKey: keyof Pick<JointDraft, 'jointBoltRoof' | 'jointBoltMezzanine' | 'foundationBoltRoof'>; idKey: string }
> = {
  roof: { arrayKey: 'jointBoltRoof', idKey: 'roofJointId' },
  mezzanine: { arrayKey: 'jointBoltMezzanine', idKey: 'mezzanineJointId' },
  foundation: { arrayKey: 'foundationBoltRoof', idKey: 'foundationJointId' },
}

type AnyRow = JointBoltRoofDraft | JointBoltMezzanineDraft | FoundationBoltRoofDraft

/**
 * A fixed-row bolt table for one enum-keyed joint array. Renders one row per
 * joint code (the store seeds them all), so every code has a stable input row
 * addressable by `id="joint-{group}-{code}"` — which the frame diagrams focus on
 * click. Blank rows are dropped from the payload by `buildJointPayload`.
 */
export function JointBoltTable({ group, title, icon, columns, hint }: JointBoltTableProps) {
  const { arrayKey, idKey } = GROUP_CONFIG[group]
  const { rows, setJoint } = useQuotationStore(
    useShallow((s) => ({ rows: s.joint[arrayKey] as AnyRow[], setJoint: s.setJoint })),
  )

  const updateRow = (index: number, patch: Partial<AnyRow>) =>
    setJoint({ [arrayKey]: rows.map((row, i) => (i === index ? { ...row, ...patch } : row)) } as Partial<JointDraft>)

  return (
    <SectionCard icon={icon} title={title}>
      {hint && <p className="text-xs text-muted-foreground -mt-2 mb-4">{hint}</p>}
      <Table className="min-w-[680px] border-collapse text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50 border-b">
            <TableHead scope="col" className="w-12 text-center">SL</TableHead>
            <TableHead scope="col" className="min-w-36">Joint ID</TableHead>
            <TableHead scope="col" className="min-w-48">Dia Of Bolt</TableHead>
            <TableHead scope="col" className="min-w-48">No Of Bolt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => {
            const id = String((row as Record<string, unknown>)[idKey])
            const diaRule = boltDiameterRule(group, id)
            const countRule = boltCountRule(group, id)
            const numberOfBolts = (row as JointBoltRoofDraft).numberOfBolts ?? countRule.fixedValue

            return (
              <TableRow key={id} id={`joint-${group}-${id}`} className="scroll-mt-24 target:bg-muted/50">
                <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                <TableCell className="font-medium">{jointIdLabel(id)}</TableCell>
                <TableCell>
                  {columns === 'diameterAndCount' ? (
                    <NumberField
                      className="[&>label]:sr-only"
                      label={`${jointIdLabel(id)} diameter`}
                      unit="mm"
                      required={false}
                      error={false}
                      readOnly={diaRule.readOnly}
                      hint={diaRule.hint}
                      value={(row as JointBoltRoofDraft).boltDiameter}
                      onChange={(value) => updateRow(index, { boltDiameter: value } as Partial<AnyRow>)}
                    />
                  ) : <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell>
                  <NumberField
                    className="[&>label]:sr-only"
                    label={`${jointIdLabel(id)} number of bolts`}
                    unit="count"
                    step={1}
                    required={false}
                    error={false}
                    readOnly={countRule.readOnly}
                    hint={countRule.hint}
                    value={numberOfBolts}
                    onChange={(value) => updateRow(index, { numberOfBolts: value } as Partial<AnyRow>)}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </SectionCard>
  )
}
