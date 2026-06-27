import type { SelectFieldOption } from '@/components/quotation/shared/SelectField'

/** Time units for the approval-drawings completion period (mirrors the Prisma enum). */
export const APPROVAL_DRAWINGS_UNIT_OPTIONS: SelectFieldOption[] = [
  { value: 'DAYS', label: 'Days' },
  { value: 'WEEKS', label: 'Weeks' },
  { value: 'MONTHS', label: 'Months' },
]
