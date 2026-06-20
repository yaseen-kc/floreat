import type { SelectFieldOption } from '@/components/quotation/shared/SelectField'

/** Human-readable labels for the mezzanine deck/slab type enum. */
export const MEZZANINE_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'DECK_SHEET', label: 'Deck Sheet' },
  { value: 'FOLDED_PLATE', label: 'Folded Plate' },
  { value: 'PANEL', label: 'Panel' },
  { value: 'BOARD', label: 'Board' },
  { value: 'RCC_SLAB', label: 'RCC Slab' },
]

/** Human-readable labels for the mezzanine floor-level enum (1st–10th). */
export const MEZZANINE_FLOOR_LEVEL_OPTIONS: SelectFieldOption[] = Array.from({ length: 10 }, (_, i) => ({
  value: `FLOOR_${i + 1}`,
  label: `Floor ${i + 1}`,
}))

/** Human-readable labels for the reference level a mezzanine height is measured from. */
export const MEZZANINE_HEIGHT_FROM_OPTIONS: SelectFieldOption[] = [
  { value: 'GROUND', label: 'Ground' },
  { value: 'FIRST_FLOOR', label: 'First Floor' },
  { value: 'FLOOR_2', label: 'Floor 2' },
  { value: 'FLOOR_3', label: 'Floor 3' },
  { value: 'FLOOR_4', label: 'Floor 4' },
  { value: 'FLOOR_5', label: 'Floor 5' },
]
