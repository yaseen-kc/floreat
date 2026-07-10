/**
 * Zod validation schemas for Accessories API request payloads.
 * Captures the per-job Accessories container: many optional scalar/enum fields
 * (drainage, flashing, partition, insulation, paint & primer, feature toggles)
 * plus four inline line-item arrays (doors, windows, folded plates, openings),
 * all replaced entirely on upsert/update.
 */
import { z } from 'zod'

// ── Enums (value keys mirror the Prisma enum members, not their @map DB strings) ──

/** Drainage material for gutters and down takes. */
const drainageMaterialEnum = z.enum(['PPGL', 'UPVC', 'ALUMINIUM', 'GI', 'COPPER', 'TIN'])

/** Nominal drainage sizes (inches). */
const drainageSizeEnum = z.enum(['IN_4', 'IN_6', 'IN_8', 'IN_10', 'IN_12', 'IN_18', 'IN_24'])

/** Flashing material used for drip trims, gable ends, corner flash and ridges. */
const flashingTypeEnum = z.enum(['PPGL', 'NCGL', 'GI'])

/** Flashing sheet thickness (mm). */
const flashingThicknessEnum = z.enum([
  'MM_0_30', 'MM_0_35', 'MM_0_40', 'MM_0_45', 'MM_0_47', 'MM_0_50', 'MM_0_55',
  'MM_0_80', 'MM_1_00', 'MM_1_20', 'MM_1_60', 'MM_1_80', 'MM_2_00',
])

/** Partition wall construction type. */
const partitionTypeEnum = z.enum(['AEROCON_PANEL', 'CEMENT_BOARD', 'PPGL_SHEET', 'PUFF_SHEET', 'PLY_BOARD'])

/** Partition thickness (mm). */
const partitionThicknessEnum = z.enum([
  'MM_0_40', 'MM_0_45', 'MM_0_47', 'MM_6', 'MM_8', 'MM_12',
  'MM_16', 'MM_18', 'MM_30', 'MM_40', 'MM_50', 'MM_75',
])

/** Roof/wall insulation material. */
const insulationTypeEnum = z.enum(['XLPE', 'ROCK_WOOL', 'GLASS_WOOL', 'ALUMINIUM_BUBBLE', 'COOL_BOARD'])

/** Turbo ventilator diameter. */
const turboVentilatorDiameterEnum = z.enum(['IN_6', 'FT_1', 'IN_18', 'FT_2'])

/** Kind of a wall/roof opening line item. */
const accessoryOpeningKindEnum = z.enum(['ROLLING_SHUTTER', 'LOUVER', 'SKY_LIGHT', 'WALL_LIGHT'])

/** Paint/primer product type for frames. */
const paintTypeEnum = z.enum(['EPOXY_PRIMER', 'EPOXY_PAINT'])

/** Purlins & girts protective finish. */
const purlinsGirtsFinishEnum = z.enum(['PRE_GALVANISED'])

/** Whether purlins & girts are painted. */
const purlinsGirtsPaintEnum = z.enum(['UNPAINTED', 'PAINTED'])

/** Foundation bolt finish. */
const foundationBoltFinishEnum = z.enum(['BLACK_UNPAINTED'])

// ── Child line-item schemas (plain optional-field arrays; no code/unique) ──

/** A door line item — dimensions and counts, all optional. */
export const accessoryDoorSchema = z.object({
  height: z.number().positive().optional(),
  width: z.number().positive().optional(),
  nos: z.number().int().nonnegative().optional(),
  quantity: z.number().int().nonnegative().optional(),
})

/** A window line item — dimensions and counts, all optional. */
export const accessoryWindowSchema = z.object({
  height: z.number().positive().optional(),
  width: z.number().positive().optional(),
  nos: z.number().int().nonnegative().optional(),
  quantity: z.number().int().nonnegative().optional(),
})

/** A folded-plate line item — dimensions and counts, all optional. */
export const accessoryFoldedPlateSchema = z.object({
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  nos: z.number().int().nonnegative().optional(),
  quantity: z.number().int().nonnegative().optional(),
})

/** An opening line item — `kind` is required (matches the non-null DB column). */
export const accessoryOpeningSchema = z.object({
  kind: accessoryOpeningKindEnum,
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  nos: z.number().int().nonnegative().optional(),
  quantity: z.number().int().nonnegative().optional(),
})

/** Schema for creating/upserting accessories — all scalar/enum fields optional, plus inline arrays. */
export const createAccessoriesSchema = z.object({
  // ── Gutter ──
  gutterType: drainageMaterialEnum.optional(),
  gutterSize: drainageSizeEnum.optional(),
  gutterQuantity: z.number().int().nonnegative().optional(),

  // ── Down Take ──
  downTakeType: drainageMaterialEnum.optional(),
  downTakeSize: drainageSizeEnum.optional(),
  downTakeQuantity: z.number().int().nonnegative().optional(),

  // ── Drip Trim ──
  dripTrimType: flashingTypeEnum.optional(),
  dripTrimThickness: flashingThicknessEnum.optional(),
  dripTrimQuantity: z.number().int().nonnegative().optional(),

  // ── Gable End Flashing ──
  gableEndFlashingType: flashingTypeEnum.optional(),
  gableEndFlashingThickness: flashingThicknessEnum.optional(),
  gableEndFlashingQuantity: z.number().int().nonnegative().optional(),

  // ── Corner Flash ──
  cornerFlashType: flashingTypeEnum.optional(),
  cornerFlashThickness: flashingThicknessEnum.optional(),
  cornerFlashQuantity: z.number().int().nonnegative().optional(),

  // ── Ridge ──
  ridgeType: flashingTypeEnum.optional(),
  ridgeThickness: flashingThicknessEnum.optional(),
  ridgeQuantity: z.number().int().nonnegative().optional(),

  // ── Partition ──
  partitionType: partitionTypeEnum.optional(),
  partitionThickness: partitionThicknessEnum.optional(),
  partitionQuantity: z.number().int().nonnegative().optional(),

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

  // ── Inline line-item arrays ──
  doors: z.array(accessoryDoorSchema).optional(),
  windows: z.array(accessoryWindowSchema).optional(),
  foldedPlates: z.array(accessoryFoldedPlateSchema).optional(),
  openings: z.array(accessoryOpeningSchema).optional(),
})

/** Schema for updating accessories — all fields optional (partial update). */
export const updateAccessoriesSchema = createAccessoriesSchema.partial()

/** Validated payload for creating/upserting accessories. */
export type CreateAccessoriesInput = z.infer<typeof createAccessoriesSchema>

/** Validated payload for updating accessories (all fields optional). */
export type UpdateAccessoriesInput = z.infer<typeof updateAccessoriesSchema>

/** Schema for pagination query params with sensible defaults. */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
})
