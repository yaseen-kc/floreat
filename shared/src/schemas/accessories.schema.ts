/**
 * Canonical Accessories request contract shared by the Floreat frontend and
 * backend: the per-job Accessories container — many optional scalar/enum fields
 * (drainage, flashing, partition, insulation, paint & primer, feature toggles)
 * plus four inline line-item arrays (doors, windows, folded plates, openings),
 * all replaced entirely on upsert/update.
 *
 * Enum value keys mirror the Prisma enum members, not their @map DB strings.
 */
import { z } from 'zod'

/** Drainage material for gutters and down takes. */
export const drainageMaterialEnum = z.enum(['PPGL', 'UPVC', 'ALUMINIUM', 'GI', 'COPPER', 'TIN'])

/** Nominal drainage sizes (inches). */
export const drainageSizeEnum = z.enum(['IN_4', 'IN_6', 'IN_8', 'IN_10', 'IN_12', 'IN_18', 'IN_24'])

/** Flashing material used for drip trims, gable ends, corner flash and ridges. */
export const flashingTypeEnum = z.enum(['PPGL', 'NCGL', 'GI'])

/** Flashing sheet thickness (mm). */
export const flashingThicknessEnum = z.enum([
  'MM_0_30', 'MM_0_35', 'MM_0_40', 'MM_0_45', 'MM_0_47', 'MM_0_50', 'MM_0_55',
  'MM_0_80', 'MM_1_00', 'MM_1_20', 'MM_1_60', 'MM_1_80', 'MM_2_00',
])

/** Partition wall construction type. */
export const partitionTypeEnum = z.enum(['AEROCON_PANEL', 'CEMENT_BOARD', 'PPGL_SHEET', 'PUFF_SHEET', 'PLY_BOARD'])

/** Partition thickness (mm). */
export const partitionThicknessEnum = z.enum([
  'MM_0_40', 'MM_0_45', 'MM_0_47', 'MM_6', 'MM_8', 'MM_12',
  'MM_16', 'MM_18', 'MM_30', 'MM_40', 'MM_50', 'MM_75',
])

/** Roof/wall insulation material. */
export const insulationTypeEnum = z.enum(['XLPE', 'ROCK_WOOL', 'GLASS_WOOL', 'ALUMINIUM_BUBBLE', 'COOL_BOARD'])

/** Turbo ventilator diameter. */
export const turboVentilatorDiameterEnum = z.enum(['IN_6', 'FT_1', 'IN_18', 'FT_2'])


/** Paint/primer product type for frames. */
export const paintTypeEnum = z.enum(['EPOXY_PRIMER', 'EPOXY_PAINT'])

/** Purlins & girts protective finish. */
export const purlinsGirtsFinishEnum = z.enum(['PRE_GALVANISED'])

/** Whether purlins & girts are painted. */
export const purlinsGirtsPaintEnum = z.enum(['UNPAINTED', 'PAINTED'])

/** Foundation bolt finish. */
export const foundationBoltFinishEnum = z.enum(['BLACK_UNPAINTED'])


/** Schema for creating/upserting accessories — all scalar/enum fields optional, plus inline arrays. */
export const createAccessoriesSchema = z.object({
  // ── Gutter ──
  gutterType: drainageMaterialEnum.optional(),
  gutterSize: drainageSizeEnum.optional(),
  // Each of the six `*Quantity` fields below is SERVER-DERIVED BY DEFAULT: the
  // backend recomputes it from the job's Roof via `deriveAccessoryQuantities`
  // (@floreat/shared/calc) and ignores the client value — UNLESS the companion
  // `*Manual` flag is `true`, in which case the client's value is trusted and
  // persisted as-is and the roof-driven recompute leaves it untouched. Values
  // accept a `number` here, but the HTTP response serialises the Decimal column
  // as a `string` (DecimalString) — see @floreat/shared/types.
  gutterQuantity: z.number().nonnegative().optional(),
  gutterQuantityManual: z.boolean().optional(),

  // ── Down Take ──
  downTakeType: drainageMaterialEnum.optional(),
  downTakeSize: drainageSizeEnum.optional(),
  downTakeQuantity: z.number().nonnegative().optional(),
  downTakeQuantityManual: z.boolean().optional(),

  // ── Drip Trim ──
  dripTrimType: flashingTypeEnum.optional(),
  dripTrimThickness: flashingThicknessEnum.optional(),
  dripTrimQuantity: z.number().nonnegative().optional(),
  dripTrimQuantityManual: z.boolean().optional(),

  // ── Gable End Flashing ──
  gableEndFlashingType: flashingTypeEnum.optional(),
  gableEndFlashingThickness: flashingThicknessEnum.optional(),
  gableEndFlashingQuantity: z.number().nonnegative().optional(),
  gableEndFlashingQuantityManual: z.boolean().optional(),

  // ── Corner Flash ──
  cornerFlashType: flashingTypeEnum.optional(),
  cornerFlashThickness: flashingThicknessEnum.optional(),
  cornerFlashQuantity: z.number().nonnegative().optional(),
  cornerFlashQuantityManual: z.boolean().optional(),

  // ── Ridge ──
  ridgeType: flashingTypeEnum.optional(),
  ridgeThickness: flashingThicknessEnum.optional(),
  ridgeQuantity: z.number().nonnegative().optional(),
  ridgeQuantityManual: z.boolean().optional(),

  // ── Partition ──
  partitionType: partitionTypeEnum.optional(),
  partitionThickness: partitionThicknessEnum.optional(),
  partitionQuantity: z.number().int().nonnegative().optional(),

  // ── Openings ──
  rollingShutterLength: z.number().positive().optional(),
  rollingShutterWidth: z.number().positive().optional(),
  rollingShutterNos: z.number().int().nonnegative().optional(),
  rollingShutterQuantity: z.number().nonnegative().optional(),

  louverLength: z.number().positive().optional(),
  louverWidth: z.number().positive().optional(),
  louverNos: z.number().int().nonnegative().optional(),
  louverQuantity: z.number().nonnegative().optional(),

  skyLightLength: z.number().positive().optional(),
  skyLightWidth: z.number().positive().optional(),
  skyLightNos: z.number().int().nonnegative().optional(),
  skyLightQuantity: z.number().nonnegative().optional(),

  wallLightLength: z.number().positive().optional(),
  wallLightWidth: z.number().positive().optional(),
  wallLightNos: z.number().int().nonnegative().optional(),
  wallLightQuantity: z.number().nonnegative().optional(),

  // ── Insulation ──
  roofInsulationType: insulationTypeEnum.optional(),
  wallInsulationType: insulationTypeEnum.optional(),

  // ── Turbo Ventilator ──
  turboVentilatorDiameter: turboVentilatorDiameterEnum.optional(),
  turboVentilatorNos: z.number().int().nonnegative().optional(),

  // ── Handrail ──
  handrailWeightKg: z.number().positive().optional(),

  // ── Feature toggles ──
  deckSheetFlashingEnabled: z.boolean().optional(),
  gantryGirderEnabled: z.boolean().optional(),
  liftStructureEnabled: z.boolean().optional(),

  // ── Paint & Primer: Frames ──
  framesPrimerCoats: z.number().int().nonnegative().optional(),
  framesPrimerType: paintTypeEnum.optional(),
  framesPaintCoats: z.number().int().nonnegative().optional(),
  framesPaintType: paintTypeEnum.optional(),

  // ── Paint & Primer: Purlins & Girts ──
  purlinsGirtsFinish: purlinsGirtsFinishEnum.optional(),
  purlinsGirtsGsm: z.number().int().nonnegative().optional(),
  purlinsGirtsPaint: purlinsGirtsPaintEnum.optional(),

  // ── Paint & Primer: Foundation Bolt ──
  foundationBoltFinish: foundationBoltFinishEnum.optional(),

  // ── Doors, Windows, Folded Plates ──
  doorHeight: z.number().positive().optional(),
  doorWidth: z.number().positive().optional(),
  doorNos: z.number().int().nonnegative().optional(),
  doorQuantity: z.number().nonnegative().optional(),

  windowHeight: z.number().positive().optional(),
  windowWidth: z.number().positive().optional(),
  windowNos: z.number().int().nonnegative().optional(),
  windowQuantity: z.number().nonnegative().optional(),

  foldedPlateLength: z.number().positive().optional(),
  foldedPlateWidth: z.number().positive().optional(),
  foldedPlateNos: z.number().int().nonnegative().optional(),
  foldedPlateQuantity: z.number().nonnegative().optional(),
})

/** Schema for updating accessories — all fields optional (partial update). */
export const updateAccessoriesSchema = createAccessoriesSchema.partial()

/** Validated payload for creating/upserting accessories. */
export type CreateAccessoriesInput = z.infer<typeof createAccessoriesSchema>

/** Validated payload for updating accessories (all fields optional). */
export type UpdateAccessoriesInput = z.infer<typeof updateAccessoriesSchema>
