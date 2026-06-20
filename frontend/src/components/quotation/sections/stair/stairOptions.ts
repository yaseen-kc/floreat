import type { SelectFieldOption } from '@/components/quotation/shared/SelectField'
import type { MezzanineDraft } from '@/stores/quotation-store'

/** Human-readable labels for the stair step-material type enum. */
export const STAIR_STEP_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'CHQ_PLATE_6MM', label: 'CHQ Plate 6mm' },
  { value: 'CHQ_PLATE_4MM', label: 'CHQ Plate 4mm' },
  { value: 'TUBE', label: 'Tube' },
]

/** Human-readable labels for the stair floor-level enum (shared by start/end). */
export const STAIR_FLOOR_LEVEL_OPTIONS: SelectFieldOption[] = [
  { value: 'GROUND', label: 'Ground' },
  { value: 'FIRST_FLOOR', label: 'First Floor' },
  { value: 'SECOND_FLOOR', label: 'Second Floor' },
  { value: 'THIRD_FLOOR', label: 'Third Floor' },
  { value: 'FOURTH_FLOOR', label: 'Fourth Floor' },
  { value: 'FIFTH_FLOOR', label: 'Fifth Floor' },
  { value: 'SIXTH_FLOOR', label: 'Sixth Floor' },
]

/** Human-readable labels for the stair stringer-type enum. */
export const STAIR_STRINGER_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'HR_SECTION', label: 'HR Section' },
  { value: 'FAB_SECTION', label: 'Fabricated Section' },
]

/** Human-readable labels for the area-deduction type enum. */
export const AREA_DEDUCTION_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'LIFT', label: 'Lift' },
  { value: 'DUCT', label: 'Duct' },
  { value: 'CUT_OUT', label: 'Cut Out' },
]

/** Human-readable labels for what an area deduction applies to. */
export const AREA_DEDUCTION_FOR_OPTIONS: SelectFieldOption[] = [
  { value: 'STRUCTURE_DEDUCTION', label: 'Structure Deduction' },
  { value: 'COVERING_DEDUCTION', label: 'Covering Deduction' },
  { value: 'BOTH', label: 'Both' },
]

/**
 * Derives the valid stair/area-deduction `location` options from the current
 * mezzanine draft: `MEZ-1..` for each floor and `EXT-1..` for each extension
 * (by position, matching the codes assigned in the mezzanine sections). The
 * value equals the label since these are the schema-validated location codes.
 */
export function buildLocationOptions(mezzanine: MezzanineDraft): SelectFieldOption[] {
  const floors = mezzanine.floors.map((_, i) => ({ value: `MEZ-${i + 1}`, label: `MEZ-${i + 1}` }))
  const extensions = mezzanine.extensions.map((_, i) => ({ value: `EXT-${i + 1}`, label: `EXT-${i + 1}` }))
  return [...floors, ...extensions]
}
