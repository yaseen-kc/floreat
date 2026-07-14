/**
 * Read-only rules for the joint bolt fields, derived from the single source of
 * truth in `@floreat/shared/calc`. The store computes the derived *values*
 * (`deriveJointBolts`); these helpers decide, per group + joint id + field,
 * whether the input is a derived/fixed value the user cannot edit, plus a short
 * hint explaining where the value comes from.
 */
import {
  BOLT_DIAMETER_SOURCE,
  FIXED_ROOF_BOLT_COUNTS,
  ROOF_COUNT_MIRRORS,
  MEZZ_COUNT_MIRRORS,
} from '@floreat/shared/calc'

/** Which bolt table a field belongs to. */
export type BoltFieldGroup = 'roof' | 'mezzanine' | 'foundation'

/** Whether a field is read-only, an optional hint, and a fixed fallback value to display. */
export interface BoltFieldRule {
  readOnly: boolean
  hint?: string
  /** Fixed value shown even when the stored row is still blank (F/J). */
  fixedValue?: number
}

/** Diameter follows Roof Joint A everywhere except A's own roof row. */
export function boltDiameterRule(group: BoltFieldGroup, id: string): BoltFieldRule {
  if (group === 'foundation') return { readOnly: false }
  if (group === 'roof' && id === BOLT_DIAMETER_SOURCE) return { readOnly: false }
  return { readOnly: true, hint: `Follows Joint ${BOLT_DIAMETER_SOURCE}` }
}

/** Count is fixed (F/J) or mirrors another joint (roof E←D; mezz N←M, R←Q). */
export function boltCountRule(group: BoltFieldGroup, id: string): BoltFieldRule {
  if (group === 'roof') {
    if (id in FIXED_ROOF_BOLT_COUNTS) {
      const fixedValue = FIXED_ROOF_BOLT_COUNTS[id]
      return { readOnly: true, hint: `Fixed at ${fixedValue}`, fixedValue }
    }
    if (id in ROOF_COUNT_MIRRORS) return { readOnly: true, hint: `Follows ${ROOF_COUNT_MIRRORS[id]}` }
  }
  if (group === 'mezzanine' && id in MEZZ_COUNT_MIRRORS) {
    return { readOnly: true, hint: `Follows ${MEZZ_COUNT_MIRRORS[id]}` }
  }
  return { readOnly: false }
}
