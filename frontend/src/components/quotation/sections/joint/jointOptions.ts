import type { SelectFieldOption } from '@/components/quotation/shared/SelectField'
import {
  boltTypeEnum,
  roofJointIdEnum,
  mezzanineJointIdEnum,
  foundationBoltJointIdEnum,
} from '@/schemas/joint.schema'

/** Bolt type options (HSFG / ordinary) for the scalar bolt-group selects. */
export const BOLT_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'HSFG', label: 'HSFG' },
  { value: 'ORD', label: 'Ordinary' },
]

/**
 * The UI form of a joint-id enum member. Prisma enum member names carry an
 * underscore (`A_1`) or a compact foundation code (`FB4`); the drawings and
 * humans use the hyphenated form (`A-1`, `FB-4`). `SEC` is shown as-is.
 */
export function jointIdLabel(id: string): string {
  if (id.startsWith('FB')) return `FB-${id.slice(2)}`
  return id.replace('_', '-')
}

/** The closed roof / mezzanine / foundation joint-id sets, in enum order. */
export const ROOF_JOINT_IDS = roofJointIdEnum.options
export const MEZZANINE_JOINT_IDS = mezzanineJointIdEnum.options
export const FOUNDATION_JOINT_IDS = foundationBoltJointIdEnum.options

// Re-exported so consumers importing options don't also need the schema module.
export { boltTypeEnum }
