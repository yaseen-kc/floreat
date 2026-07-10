import type { SelectFieldOption } from '@/components/quotation/shared/SelectField'

export const CANOPY_HEIGHT_FROM_OPTIONS: SelectFieldOption[] = [
  { value: 'GROUND', label: 'Ground' },
  { value: 'FF', label: 'First Floor' },
  { value: 'SF', label: 'Second Floor' },
  { value: 'FLOOR_3', label: 'Floor 3' },
  { value: 'FLOOR_4', label: 'Floor 4' },
  { value: 'FLOOR_5', label: 'Floor 5' },
]

export const CANOPY_SHEET_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'NCGL', label: 'NCGL' },
  { value: 'PPGL', label: 'PPGL' },
  { value: 'PUFF', label: 'PUFF' },
  { value: 'OTHER', label: 'Other' },
]
