/**
 * Canonical Quantity request contract shared by the Floreat frontend and
 * backend. A Quantity is the calculated bill-of-quantities output for a job:
 * one container plus seven optional one-to-one section objects (pebRoof,
 * cladding, canopy, accessories, mezzanine, stair, additionalBolts). Every
 * field is optional/nullable so partial or draft saves are accepted.
 */
import { z } from 'zod'

/** Units a quantity leaf can be measured in (mirrors the Prisma QuantityUnit enum). */
export const quantityUnitEnum = z.enum([
  'KG', 'M', 'NOS', 'SQFT', 'SQM', 'KG_PER_SQFT', 'KG_PER_M', 'KG_PER_SQM',
])

/** A nullable unit field — sections leave it unset on partial saves. */
const unit = quantityUnitEnum.nullish()
/** A nullable decimal-valued field (quantities, lengths, areas, weights). */
const dec = z.number().nullish()
/** A nullable integer-count field. */
const count = z.number().int().nullish()
/** A nullable free-text field (specifications, sections, types). */
const text = z.string().nullish()

/** pebRoof section — main roof material plus every member breakdown. */
export const quantityPebRoofSchema = z.object({
  // materialWithPurlin
  quantityPebRoofValue: z.boolean().nullish(),
  materialWithPurlinUnit: unit,
  materialWithPurlinQuantity: dec,

  // raftersAndColumns
  raftersAndColumnsSpecification: text,
  raftersAndColumnsUnit: unit,
  raftersAndColumnsQuantity: dec,
  raftersAndColumnsAdditionalQuantity: dec,
  raftersAndColumnsBuildingLength: dec,
  raftersAndColumnsBuildingLengthUnit: unit,
  raftersAndColumnsInclinedLengthOneHalf: dec,
  raftersAndColumnsInclinedLengthUnit: unit,
  raftersAndColumnsRoofArea: dec,
  raftersAndColumnsRoofAreaUnit: unit,
  raftersAndColumnsMaterialConsumption: dec,
  raftersAndColumnsMaterialConsumptionUnit: unit,

  // roofPurlins
  roofPurlinesValue: dec,
  roofPurlinsSpecification: text,
  roofPurlinsUnit: unit,
  roofPurlinsQuantity: dec,
  roofPurlinsAdditionalQuantity: dec,
  roofPurlinsSinglePurlinLength: dec,
  roofPurlinsSinglePurlinLengthUnit: unit,
  roofPurlinsPurlinsPerFrame: count,
  roofPurlinsTotalPurlinBays: count,
  roofPurlinsPurlinUnitWeight: dec,
  roofPurlinsPurlinUnitWeightUnit: unit,
  roofPurlinsExtendedFramePurlins: count,
  roofPurlinsExtendedPurlinBays: count,
}).extend({
  // roofSheet
  roofSheetSpecification: text,
  roofSheetUnit: unit,
  roofSheetQuantity: dec,
  roofSheetPurchaseQuantity: dec,
  roofSheetAdditionalQuantity: dec,
  roofSheetExtendedRoofWidth: dec,
  roofSheetExtendedRoofWidthUnit: unit,
  roofSheetExtendedRoofLength: dec,
  roofSheetExtendedRoofLengthUnit: unit,
  roofSheetRoofAreaDeductions: dec,
  roofSheetRoofAreaDeductionsUnit: unit,
  roofSheetPolycarbonateAreaDeduction: dec,
  roofSheetPolycarbonateAreaDeductionUnit: unit,

  // polycarbonateSheet
  polycarbonateSheetUnit: unit,
  polycarbonateSheetQuantity: dec,
  polycarbonateSheetPurchaseQuantity: dec,
  polycarbonateSheetAdditionalQuantity: dec,
  polycarbonateSheetSheetLength: dec,
  polycarbonateSheetSheetLengthUnit: unit,
  polycarbonateSheetSheetWidth: dec,
  polycarbonateSheetSheetWidthUnit: unit,
  polycarbonateSheetNumberOfSheets: count,

  // roofWindBracings
  roofWindBracingsUnit: unit,
  roofWindBracingsQuantity: dec,
  roofWindBracingsAdditionalQuantity: dec,
  roofWindBracingsSingleBracingLength: dec,
  roofWindBracingsSingleBracingLengthUnit: unit,
  roofWindBracingsTotalBracings: count,
  roofWindBracingsUnitWeight: dec,
  roofWindBracingsUnitWeightUnit: unit,
}).extend({
  // roofSagRod
  roofSagRodValue: dec,
  roofSagRodUnit: unit,
  roofSagRodQuantity: dec,
  roofSagRodAdditionalQuantity: dec,
  roofSagRodSingleSagRodLength: dec,
  roofSagRodSingleSagRodLengthUnit: unit,
  roofSagRodSagRodsPerFrame: count,
  roofSagRodSagRodBays: count,
  roofSagRodExtendedFrameSagRods: count,
  roofSagRodExtendedSagRodBays: count,
  roofSagRodUnitWeight: dec,
  roofSagRodUnitWeightUnit: unit,

  // roofFlangeBrace
  roofFlangeBraceUnit: unit,
  roofFlangeBraceQuantity: dec,
  roofFlangeBraceAdditionalQuantity: dec,
  roofFlangeBraceMidFrameBraceLength: dec,
  roofFlangeBraceMidFrameBraceLengthUnit: unit,
  roofFlangeBraceMidFrameBraces: count,
  roofFlangeBraceEndFrameBraces: count,
  roofFlangeBraceMidFrames: count,
  roofFlangeBraceEndFrames: count,
  roofFlangeBraceExtendedFrameMidBraces: count,
  roofFlangeBraceExtendedFrameEndBraces: count,
  roofFlangeBraceExtendedMidFrames: count,
  roofFlangeBraceExtendedEndFrames: count,
  roofFlangeBraceEndFrameBraceLength: dec,
  roofFlangeBraceEndFrameBraceLengthUnit: unit,
}).extend({
  // purlinBolts
  purlinBoltsSpecification: text,
  purlinBoltsUnit: unit,
  purlinBoltsQuantity: dec,
  purlinBoltsPurlinJointsPerFrame: count,
  purlinBoltsTotalFrames: count,
  purlinBoltsExtendedFramePurlinNodes: count,
  purlinBoltsExtendedFrames: count,
  purlinBoltsBoltsPerPurlinJoint: count,

  // roofJointBolts
  roofJointBoltsSpecification: text,
  roofJointBoltsUnit: unit,
  roofJointBoltsQuantity: dec,

  // foundationBolts
  foundationBoltsSpecification: text,
  foundationBoltsUnit: unit,
  foundationBoltsQuantity: dec,

  // anchorBolts
  anchorBoltsSpecification: text,
  anchorBoltsUnit: unit,
  anchorBoltsQuantity: dec,
})

/** cladding section — cladding structure, sheet and bracing breakdowns. */
export const quantityCladdingSchema = z.object({
  // claddingStructure
  claddingStructureUnit: unit,
  claddingStructureQuantity: dec,
  claddingStructureAdditionalQuantity: dec,
  claddingStructureFrontEaveHeight: dec,
  claddingStructureBackEaveHeight: dec,
  claddingStructureRightEaveHeight: dec,
  claddingStructureLeftEaveHeight: dec,
  claddingStructureEaveHeightUnit: unit,
  claddingStructureExtendedColumnHeight: dec,
  claddingStructureExtendedColumnHeightUnit: unit,
  claddingStructureExtendedFrameWidth: dec,
  claddingStructureExtendedFrameWidthUnit: unit,
  claddingStructureSideCladdingPurlins: count,
  claddingStructureFaceCladdingPurlins: count,
  claddingStructureTotalCladdingPurlinLength: dec,
  claddingStructureTotalCladdingPurlinLengthUnit: unit,
  claddingStructureTotalCladdingPurlinWeight: dec,
  claddingStructureTotalCladdingPurlinWeightUnit: unit,
  claddingStructureCladdingArea: dec,
  claddingStructureCladdingAreaUnit: unit,
  claddingStructureAverageMaterialConsumption: dec,
  claddingStructureAverageMaterialConsumptionUnit: unit,
  claddingStructureTotalOpenings: dec,
  claddingStructureTotalOpeningsUnit: unit,
  claddingStructureFasciaOpening: dec,
  claddingStructureFasciaOpeningUnit: unit,
}).extend({
  // claddingSheet
  claddingSheetUnit: unit,
  claddingSheetQuantity: dec,
  claddingSheetPurchaseQuantity: dec,

  // columnWindBracings
  columnWindBracingsUnit: unit,
  columnWindBracingsQuantity: dec,

  // claddingSagRod
  claddingSagRodUnit: unit,
  claddingSagRodQuantity: dec,

  // claddingFlangeBrace
  claddingFlangeBraceUnit: unit,
  claddingFlangeBraceQuantity: dec,

  // claddingPurlinBolts
  claddingPurlinBoltsUnit: unit,
  claddingPurlinBoltsQuantity: dec,
})

/** canopy section — canopy structure, purlin, sheet and trims. */
export const quantityCanopySchema = z.object({
  // structure
  structureUnit: unit,
  structureQuantity: dec,
  structureCanopyArea: dec,
  structureCanopyAreaUnit: unit,

  // purlin
  purlinUnit: unit,
  purlinQuantity: dec,

  // sheet
  sheetUnit: unit,
  sheetQuantity: dec,
  sheetPurchaseQuantity: dec,

  // gutter
  gutterUnit: unit,
  gutterQuantity: dec,

  // downTake
  downTakeUnit: unit,
  downTakeQuantity: dec,

  // sideCovering
  sideCoveringUnit: unit,
  sideCoveringQuantity: dec,

  // flashing
  flashingUnit: unit,
  flashingQuantity: dec,

  // purlinBolts
  purlinBoltsUnit: unit,
  purlinBoltsQuantity: dec,

  // jointBolts
  jointBoltsUnit: unit,
  jointBoltsQuantity: dec,
})

/** accessories section — openings, coverings, insulation and fittings. */
export const quantityAccessoriesSchema = z.object({
  // doors
  doorsCount: count,
  doorsCountUnit: unit,
  doorsArea: dec,
  doorsAreaUnit: unit,

  // windows
  windowsCount: count,
  windowsCountUnit: unit,
  windowsArea: dec,
  windowsAreaUnit: unit,

  // fasciaStructure
  fasciaStructureUnit: unit,
  fasciaStructureQuantity: dec,

  // fasciaCoveringSheet
  fasciaCoveringSheetUnit: unit,
  fasciaCoveringSheetQuantity: dec,

  // internalPartitions
  internalPartitionsUnit: unit,
  internalPartitionsQuantity: dec,

  // ridge
  ridgeUnit: unit,
  ridgeQuantity: dec,

  // gutter
  gutterUnit: unit,
  gutterQuantity: dec,

  // downTake
  downTakeUnit: unit,
  downTakeQuantity: dec,

  // dripTrim
  dripTrimUnit: unit,
  dripTrimQuantity: dec,

  // gableEndFlashing
  gableEndFlashingUnit: unit,
  gableEndFlashingQuantity: dec,
}).extend({
  // cornerFlash
  cornerFlashCount: count,
  cornerFlashCountUnit: unit,
  cornerFlashLength: dec,
  cornerFlashLengthUnit: unit,

  // rollingShutter
  rollingShutterCount: count,
  rollingShutterCountUnit: unit,
  rollingShutterArea: dec,
  rollingShutterAreaUnit: unit,

  // louvers
  louversCount: count,
  louversCountUnit: unit,
  louversArea: dec,
  louversAreaUnit: unit,

  // skyLight
  skyLightCount: count,
  skyLightCountUnit: unit,
  skyLightArea: dec,
  skyLightAreaUnit: unit,

  // wallLight
  wallLightCount: count,
  wallLightCountUnit: unit,
  wallLightArea: dec,
  wallLightAreaUnit: unit,
}).extend({
  // roofInsulation
  roofInsulationType: text,
  roofInsulationUnit: unit,
  roofInsulationQuantity: dec,

  // wallInsulation
  wallInsulationType: text,
  wallInsulationUnit: unit,
  wallInsulationQuantity: dec,

  // turboVentilators
  turboVentilatorsUnit: unit,
  turboVentilatorsQuantity: dec,

  // handrail
  handrailUnit: unit,
  handrailQuantity: dec,
})

/** mezzanine section — structure, deck sheet, studs and bolts. */
export const quantityMezzanineSchema = z.object({
  // structure
  structureUnit: unit,
  structureQuantity: dec,
  structureAdditionalQuantity: dec,
  structureTotalArea: dec,
  structureTotalAreaUnit: unit,
  structureMaterialConsumption: dec,
  structureMaterialConsumptionUnit: unit,

  // deckSheet
  deckSheetUnit: unit,
  deckSheetQuantity: dec,
  deckSheetPurchaseQuantity: dec,
  deckSheetAdditionalQuantity: dec,

  // shearStuds
  shearStudsUnit: unit,
  shearStudsQuantity: dec,

  // concreteFlashing
  concreteFlashingUnit: unit,
  concreteFlashingQuantity: dec,

  // jointBolts
  jointBoltsSpecification: text,
  jointBoltsQuantity: dec,

  // foundationBolts — source may be "NA"; stored as null when not applicable.
  foundationBoltsQuantity: dec,
})

/** stair section — total area, stringer beams and steps. */
export const quantityStairSchema = z.object({
  // totalArea
  totalAreaUnit: unit,
  totalAreaQuantity: dec,

  // stringerBeams
  stringerBeamsSection: text,
  stringerBeamsUnit: unit,
  stringerBeamsQuantity: dec,
  stringerBeamsAdditionalQuantity: dec,

  // steps
  stepsSpecification: text,
  stepsUnit: unit,
  stepsQuantity: dec,
  stepsAdditionalQuantity: dec,
})

/** additionalBolts section — HSFG joint bolts and ordinary/anchor bolts. */
export const quantityAdditionalBoltsSchema = z.object({
  jointBolt24mmHsfgUnit: unit,
  jointBolt24mmHsfgQuantity: dec,
  jointBolt20mmHsfgUnit: unit,
  jointBolt20mmHsfgQuantity: dec,
  jointBolt16mmHsfgUnit: unit,
  jointBolt16mmHsfgQuantity: dec,
  purlinBolt12mmOrdinaryUnit: unit,
  purlinBolt12mmOrdinaryQuantity: dec,
  anchorBoltUnit: unit,
  anchorBoltQuantity: dec,
  foundationBoltUnit: unit,
  foundationBoltQuantity: dec,
})

/** Schema for creating/upserting a Quantity — every section is optional. */
export const createQuantitySchema = z.object({
  pebRoof: quantityPebRoofSchema.optional(),
  cladding: quantityCladdingSchema.optional(),
  canopy: quantityCanopySchema.optional(),
  accessories: quantityAccessoriesSchema.optional(),
  mezzanine: quantityMezzanineSchema.optional(),
  stair: quantityStairSchema.optional(),
  additionalBolts: quantityAdditionalBoltsSchema.optional(),
})

/** Schema for updating a Quantity — all sections optional (partial update). */
export const updateQuantitySchema = createQuantitySchema.partial()

/** Validated payload for creating/upserting a Quantity. */
export type CreateQuantityInput = z.infer<typeof createQuantitySchema>

/** Validated payload for updating a Quantity (all sections optional). */
export type UpdateQuantityInput = z.infer<typeof updateQuantitySchema>
