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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rows.map((row, index) => {
          const id = String((row as Record<string, unknown>)[idKey])
          const diaRule = boltDiameterRule(group, id)
          const countRule = boltCountRule(group, id)
          const numberOfBolts = (row as JointBoltRoofDraft).numberOfBolts ?? countRule.fixedValue
          return (
            <div
              key={id}
              id={`joint-${group}-${id}`}
              className="flex items-center gap-3 rounded-[10px] border border-border p-3 scroll-mt-24 target:border-primary"
            >
              <span className="font-mono text-sm font-semibold w-14 shrink-0 text-foreground">{jointIdLabel(id)}</span>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {columns === 'diameterAndCount' && (
                  <NumberField
                    label="Diameter"
                    unit="mm"
                    required={false}
                    error={false}
                    readOnly={diaRule.readOnly}
                    hint={diaRule.hint}
                    value={(row as JointBoltRoofDraft).boltDiameter}
                    onChange={(v) => updateRow(index, { boltDiameter: v } as Partial<AnyRow>)}
                  />
                )}
                <NumberField
                  label="No. of Bolts"
                  unit="count"
                  step={1}
                  required={false}
                  error={false}
                  readOnly={countRule.readOnly}
                  hint={countRule.hint}
                  value={numberOfBolts}
                  onChange={(v) => updateRow(index, { numberOfBolts: v } as Partial<AnyRow>)}
                />
              </div>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}
