import { z } from 'zod'

export const quantityUnitEnum = z.enum([
  'KG', 'M', 'NOS', 'SQFT', 'SQM', 'KG_PER_SQFT', 'KG_PER_M', 'KG_PER_SQM',
])

const dec = z.number().nullish()
const count = z.number().int().nullish()
const str = z.string().nullish()

export const quantityPebRoofSchema = z.object({
  pebRoofValue: str,
  pebRoofQuantity: dec,
  raftersAndColumns: str,
  raftersAndColumnsQuantity: dec,
  lengthOfBuilding: dec,
  lengthOfBuildingQuantity: str,
  inclinedLengthInOneHalf: dec,
  roofArea: dec,
  materialConsumption: dec,
  roofPurlinsValue: dec,
  roofPurlins: str,
  roofPurlinsQuantity: dec,
  lengthOfOnePurlin: dec,
  lengthOfOnePurlinQuantity: str,
  noOfPurlinsInOneFrame: count,
  totalNoOfPurlinBay: count,
  unitWeightOfPurlin: dec,
  noOfExtendedFrame: count,
  noOfExtendedPurlinBay: count,
  roofSheet: str,
  roofSheetQuantity: dec,
  roofSheetPurchaseQuantity: dec,
  extendedRoofWidth: dec,
  extendedRoofLength: dec,
  roofAreaDeductions: dec,
  polyCarbonateAreaDeductions: dec,
  polyCarbonateSheetQuantity: dec,
  polyCarbonateSheetPurchaseQuantity: dec,
  lengthOfpolyCarbonateSheet: dec,
  lengthOfpolyCarbonateSheetAdditional: str,
  widthOfpolyCarbonateSheet: dec,
  NosOfpolyCarbonateSheet: count,
  roofWindBracing: dec,
  lengthOfSinlgeWindBracing: dec,
  lengthOfSinlgeWindBracingAdditional: str,
  totalNumberOfWindBracing: count,
  unitWeightOfRoofWindBracing: dec,
  roofSagRoadValue: dec,
  roofSagRoadQuantity: dec,
  roofSagRoadQuantityAdditional: dec,
  lengthOfSingleSagRoad: dec,
  lengthOfSingleSagRoadAdditional: str,
  noOfSagRodInASingleFrame: count,
  noOfBayInSagRodProvided: count,
  noOfSagRodInExtendedFrame: count,
  noOfExtendedSagRodBay: count,
  unitWeightOfSagRod: dec,
  roofFlangeBraceQuantity: dec,
  lengthOfMidFrameFlangeBrace: dec,
  lengthOfMidFrameFlangeBraceAdditional: str,
  noOfFlangeBraceInMidFrame: count,
  noOfFlangeBraceInEndFrame: count,
  noOfMidFrame: count,
  noOfEndFrame: count,
  noOfFlngBraceInExtendedFrame: count,
  noOfExtendedMidFrame: count,
  noOfExtendedEndFrame: count,
  lengthOfEndFrameFlangeBrace: dec,
  numberOfPurlinBolts: str,
  numberOfPurlinBoltsQuantity: dec,
  noOfPurlinJointInSingleFrame: count,
  totalnoOfFrames: count,
  noOfPurlinnodeInExtendedFrame: count,
  noOfExtendedFrames: count,
  noOfBoltsInSinglePurlinJoint: count,
  numberOfRoofJointBolts: str,
  numberOfFoundationBolts: str,
  numberOfAnchorBolts: str,
})

export const quantityCladdingSchema = z.object({
  claddingStructureQuantity: dec,
  claddingEaveHeightFront: dec,
  claddingEaveHeightFrontAdditional: dec,
  claddingEaveHeightBack: dec,
  claddingEaveHeightRight: dec,
  claddingEaveHeightLeft: dec,
  extendedColumnHeight: dec,
  widthOfExtendedFrame: dec,
  noOfSideCladdingPurlin: count,
  noOfFaceCladdingPurlin: count,
  totalLengthOfCladdingPurlin: dec,
  totalWeightofCladdingPurlin: dec,
  claddingAreaWithoutAnyDeductions: dec,
  averageMaterialConsumption: dec,
  totalCladdingOpenings: dec,
  fasciaOpening: dec,
  claddingSheetQuantity: dec,
  claddingSheetAdditional: dec,
  claddingSheetPurchase: dec,
  columnWindBracingsAdditional: dec,
  claddingSagRodAdditional: dec,
  claddingFlangeBraceAdditional: dec,
  numberOfCladdingPurlinBoltsAdditional: dec,
})

export const quantityCanopySchema = z.object({
  canopyStructureQuantity: dec,
  canopyArea: dec,
  canopyPurlinQuantity: dec,
  canopySheetQuantity: dec,
  canopySheetPurchaseQuantity: dec,
  canopyGutterQuantity: dec,
  canopyDownTakeQuantity: dec,
  canopySideCoveringQuantity: dec,
  canopyFlashingQuantity: dec,
  canopyPurlinBoltsQuantity: dec,
  canopyJointBoltsQuantity: dec,
})

export const quantityAccessoriesSchema = z.object({
  doors: dec,
  doorsQuantity: dec,
  windows: dec,
  windowsQuantity: dec,
  fasciaStructureQuantity: dec,
  fasciaCoveringSheetBoardQuantity: dec,
  internalPartitionsQuantity: dec,
  ridgeQuantity: dec,
  gutterQuantity: dec,
  downtakeQuantity: dec,
  dripTrimQuantity: dec,
  gableEndFlashingQuantity: dec,
  cornerFlashQuantity: dec,
  rollingShutter: dec,
  rollingShutterQuantity: dec,
  louvers: dec,
  louversQuantity: dec,
  skyLight: dec,
  skyLightQuantity: dec,
  wallLight: dec,
  wallLightQuantity: dec,
  roofInsulation: dec,
  roofInsulationQuantity: dec,
  wallInsulation: dec,
  wallInsulationQuantity: dec,
  turboVentilators: dec,
  turboVentilatorsQuantity: dec,
  handrail: dec,
  handrailQuantity: dec,
})

export const quantityMezzanineSchema = z.object({
  mezzanineStructure: dec,
  mezzanineStructureQuantity: dec,
  totalMezzanineArea: dec,
  totalMezzanineAreaQuantity: dec,
  materialConsumption: dec,
  deckSheetQuantity: dec,
  shearStudsQuantity: dec,
  shearStudsPurchaseQuantity: dec,
  shearStudsQuantityAdditional: dec,
  concreteFlashing: dec,
  jointBolts: dec,
  jointBoltsQuantity: dec,
  foundationBoltsQuantity: dec,
})

export const quantityStairSchema = z.object({
  totalAreaOfStairQuantity: dec,
  totalWeightofStringerBeamsQuantity: dec,
  totalWeightofStringerBeamsAdditional: dec,
  totalWeightofSteps: dec,
  totalWeightofStepsQuantity: dec,
  totalWeightofStepsAdditional: dec,
})

export const quantityAdditionalBoltsSchema = z.object({
  jointBolt1: dec,
  jointBolt1Quantity: dec,
  jointBolt2: dec,
  jointBolt2Quantity: dec,
  jointBolt3: dec,
  jointBolt3Quantity: dec,
  purlinBolt: dec,
  purlinBoltQuantity: dec,
  anchorBoltQuantity: dec,
  foundationBoltQuantity: dec,
})

export const createQuantityPebRoofSchema = quantityPebRoofSchema
export const updateQuantityPebRoofSchema = quantityPebRoofSchema.partial()
export type CreateQuantityPebRoofInput = z.infer<typeof createQuantityPebRoofSchema>
export type UpdateQuantityPebRoofInput = z.infer<typeof updateQuantityPebRoofSchema>

export const createQuantityCladdingSchema = quantityCladdingSchema
export const updateQuantityCladdingSchema = quantityCladdingSchema.partial()
export type CreateQuantityCladdingInput = z.infer<typeof createQuantityCladdingSchema>
export type UpdateQuantityCladdingInput = z.infer<typeof updateQuantityCladdingSchema>

export const createQuantityCanopySchema = quantityCanopySchema
export const updateQuantityCanopySchema = quantityCanopySchema.partial()
export type CreateQuantityCanopyInput = z.infer<typeof createQuantityCanopySchema>
export type UpdateQuantityCanopyInput = z.infer<typeof updateQuantityCanopySchema>

export const createQuantityAccessoriesSchema = quantityAccessoriesSchema
export const updateQuantityAccessoriesSchema = quantityAccessoriesSchema.partial()
export type CreateQuantityAccessoriesInput = z.infer<typeof createQuantityAccessoriesSchema>
export type UpdateQuantityAccessoriesInput = z.infer<typeof updateQuantityAccessoriesSchema>

export const createQuantityMezzanineSchema = quantityMezzanineSchema
export const updateQuantityMezzanineSchema = quantityMezzanineSchema.partial()
export type CreateQuantityMezzanineInput = z.infer<typeof createQuantityMezzanineSchema>
export type UpdateQuantityMezzanineInput = z.infer<typeof updateQuantityMezzanineSchema>

export const createQuantityStairSchema = quantityStairSchema
export const updateQuantityStairSchema = quantityStairSchema.partial()
export type CreateQuantityStairInput = z.infer<typeof createQuantityStairSchema>
export type UpdateQuantityStairInput = z.infer<typeof updateQuantityStairSchema>

export const createQuantityAdditionalBoltsSchema = quantityAdditionalBoltsSchema
export const updateQuantityAdditionalBoltsSchema = quantityAdditionalBoltsSchema.partial()
export type CreateQuantityAdditionalBoltsInput = z.infer<typeof createQuantityAdditionalBoltsSchema>
export type UpdateQuantityAdditionalBoltsInput = z.infer<typeof updateQuantityAdditionalBoltsSchema>

export const createQuantitySchema = z.object({
  pebRoof: quantityPebRoofSchema.optional(),
  cladding: quantityCladdingSchema.optional(),
  canopy: quantityCanopySchema.optional(),
  accessories: quantityAccessoriesSchema.optional(),
  mezzanine: quantityMezzanineSchema.optional(),
  stair: quantityStairSchema.optional(),
  additionalBolts: quantityAdditionalBoltsSchema.optional(),
})

export const updateQuantitySchema = createQuantitySchema.partial()

export type CreateQuantityInput = z.infer<typeof createQuantitySchema>
export type UpdateQuantityInput = z.infer<typeof updateQuantitySchema>
