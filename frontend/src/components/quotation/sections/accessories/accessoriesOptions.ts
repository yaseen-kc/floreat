import type { SelectFieldOption } from '@/components/quotation/shared/SelectField'

/** Drainage material for gutters and down takes. */
export const DRAINAGE_MATERIAL_OPTIONS: SelectFieldOption[] = [
  { value: 'PPGL', label: 'PPGL' },
  { value: 'UPVC', label: 'UPVC' },
  { value: 'ALUMINIUM', label: 'Aluminium' },
  { value: 'GI', label: 'GI' },
  { value: 'COPPER', label: 'Copper' },
  { value: 'TIN', label: 'Tin' },
]

/** Nominal drainage sizes (inches). */
export const DRAINAGE_SIZE_OPTIONS: SelectFieldOption[] = [
  { value: 'IN_4', label: '4"' },
  { value: 'IN_6', label: '6"' },
  { value: 'IN_8', label: '8"' },
  { value: 'IN_10', label: '10"' },
  { value: 'IN_12', label: '12"' },
  { value: 'IN_18', label: '18"' },
  { value: 'IN_24', label: '24"' },
]

/** Flashing material (drip trim, gable end, corner flash, ridge). */
export const FLASHING_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'PPGL', label: 'PPGL' },
  { value: 'NCGL', label: 'NCGL' },
  { value: 'GI', label: 'GI' },
]

/** Flashing sheet thickness (mm). */
export const FLASHING_THICKNESS_OPTIONS: SelectFieldOption[] = [
  { value: 'MM_0_30', label: '0.30 mm' },
  { value: 'MM_0_35', label: '0.35 mm' },
  { value: 'MM_0_40', label: '0.40 mm' },
  { value: 'MM_0_45', label: '0.45 mm' },
  { value: 'MM_0_47', label: '0.47 mm' },
  { value: 'MM_0_50', label: '0.50 mm' },
  { value: 'MM_0_55', label: '0.55 mm' },
  { value: 'MM_0_80', label: '0.80 mm' },
  { value: 'MM_1_00', label: '1.00 mm' },
  { value: 'MM_1_20', label: '1.20 mm' },
  { value: 'MM_1_60', label: '1.60 mm' },
  { value: 'MM_1_80', label: '1.80 mm' },
  { value: 'MM_2_00', label: '2.00 mm' },
]

/** Partition wall construction type. */
export const PARTITION_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'AEROCON_PANEL', label: 'Aerocon Panel' },
  { value: 'CEMENT_BOARD', label: 'Cement Board' },
  { value: 'PPGL_SHEET', label: 'PPGL Sheet' },
  { value: 'PUFF_SHEET', label: 'PUFF Sheet' },
  { value: 'PLY_BOARD', label: 'Ply Board' },
]

/** Partition thickness (mm). */
export const PARTITION_THICKNESS_OPTIONS: SelectFieldOption[] = [
  { value: 'MM_0_40', label: '0.40 mm' },
  { value: 'MM_0_45', label: '0.45 mm' },
  { value: 'MM_0_47', label: '0.47 mm' },
  { value: 'MM_6', label: '6 mm' },
  { value: 'MM_8', label: '8 mm' },
  { value: 'MM_12', label: '12 mm' },
  { value: 'MM_16', label: '16 mm' },
  { value: 'MM_18', label: '18 mm' },
  { value: 'MM_30', label: '30 mm' },
  { value: 'MM_40', label: '40 mm' },
  { value: 'MM_50', label: '50 mm' },
  { value: 'MM_75', label: '75 mm' },
]

/** Roof/wall insulation material. */
export const INSULATION_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'XLPE', label: 'XLPE' },
  { value: 'ROCK_WOOL', label: 'Rock Wool' },
  { value: 'GLASS_WOOL', label: 'Glass Wool' },
  { value: 'ALUMINIUM_BUBBLE', label: 'Aluminium Bubble' },
  { value: 'COOL_BOARD', label: 'Cool Board' },
]

/** Turbo ventilator diameter. */
export const TURBO_VENTILATOR_DIAMETER_OPTIONS: SelectFieldOption[] = [
  { value: 'IN_6', label: '6"' },
  { value: 'FT_1', label: '1 ft' },
  { value: 'IN_18', label: '18"' },
  { value: 'FT_2', label: '2 ft' },
]

/** Paint/primer product type for frames. */
export const PAINT_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'EPOXY_PRIMER', label: 'Epoxy Primer' },
  { value: 'EPOXY_PAINT', label: 'Epoxy Paint' },
]

/** Purlins & girts protective finish. */
export const PURLINS_GIRTS_FINISH_OPTIONS: SelectFieldOption[] = [
  { value: 'PRE_GALVANISED', label: 'Pre-Galvanised' },
]

/** Whether purlins & girts are painted. */
export const PURLINS_GIRTS_PAINT_OPTIONS: SelectFieldOption[] = [
  { value: 'UNPAINTED', label: 'Unpainted' },
  { value: 'PAINTED', label: 'Painted' },
]

/** Foundation bolt finish. */
export const FOUNDATION_BOLT_FINISH_OPTIONS: SelectFieldOption[] = [
  { value: 'BLACK_UNPAINTED', label: 'Black (Unpainted)' },
]
