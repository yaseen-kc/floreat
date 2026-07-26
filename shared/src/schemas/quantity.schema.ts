import { z } from 'zod'

export const quantityUnitEnum = z.enum([
  'KG', 'M', 'NOS', 'SQFT', 'SQM', 'KG_PER_SQFT', 'KG_PER_M', 'KG_PER_SQM',
])

const dec = z.number().nullish()
const str = z.string().nullish()

export const quantityPebRoofSchema = z.object({
  pebRoofValue: str,
  pebRoofQuantity: dec,
  raftersAndColumns: str,
  raftersAndColumnsQuantity: dec,
  lengthOfBuilding: dec,
  lengthOfBuildingQuantity: dec,
  inclinedLengthInOneHalf: dec,
  roofArea: dec,
  materialConsumption: dec,
  roofPurlinsValue: dec,
  roofPurlins: str,
  roofPurlinsQuantity: dec,
  lengthOfOnePurlin: dec,
  lengthOfOnePurlinQuantity: dec,
  noOfPurlinsInOneFrame: dec,
  totalNoOfPurlinBay: dec,
  unitWeightOfPurlin: dec,
  noOfExtendedFrame: dec,
  noOfExtendedPurlinBay: dec,
  roofSheet: str,
  roofSheetQuantity: dec,
  roofSheetPurchaseQuantity: dec,
  extendedRoofWidth: dec,
  extendedRoofWidthAdditonal: dec,
  extendedRoofLength: dec,
  roofAreaDeductions: dec,
  polyCarbonateAreaDeductions: dec,
  polyCarbonateSheetQuantity: dec,
  polyCarbonateSheetPurchaseQuantity: dec,
  lengthOfpolyCarbonateSheet: dec,
  lengthOfpolyCarbonateSheetAdditional: dec,
  widthOfpolyCarbonateSheet: dec,
  NosOfpolyCarbonateSheet: dec,
  roofWindBracing: dec,
  lengthOfSinlgeWindBracing: dec,
  lengthOfSinlgeWindBracingAdditional: dec,
  totalNumberOfWindBracing: dec,
  unitWeightOfRoofWindBracing: dec,
  roofSagRoadValue: dec,
  roofSagRoadQuantity: dec,
  roofSagRoadQuantityAdditional: dec,
  lengthOfSingleSagRoad: dec,
  lengthOfSingleSagRoadAdditional: dec,
  noOfSagRodInASingleFrame: dec,
  noOfBayInSagRodProvided: dec,
  noOfSagRodInExtendedFrame: dec,
  noOfExtendedSagRodBay: dec,
  unitWeightOfSagRod: dec,
  roofFlangeBraceQuantity: dec,
  lengthOfMidFrameFlangeBrace: dec,
  lengthOfMidFrameFlangeBraceAdditional: dec,
  noOfFlangeBraceInMidFrame: dec,
  noOfFlangeBraceInEndFrame: dec,
  noOfMidFrame: dec,
  noOfEndFrame: dec,
  noOfFlngBraceInExtendedFrame: dec,
  noOfFlngBraceInExtendedFrame2: dec,
  noOfExtendedMidFrame: dec,
  noOfExtendedEndFrame: dec,
  lengthOfEndFrameFlangeBrace: dec,
  numberOfPurlinBolts: str,
  numberOfPurlinBoltsQuantity: dec,
  noOfPurlinJointInSingleFrame: dec,
  totalnoOfFrames: dec,
  noOfPurlinnodeInExtendedFrame: dec,
  noOfExtendedFrames: dec,
  noOfBoltsInSinglePurlinJoint: dec,
  numberOfRoofJointBolts: str,
  numberOfRoofJointBoltsQuantity: dec,
  numberOfFoundationBolts: str,
  numberOfFoundationBoltsQuantity: dec,
  numberOfAnchorBolts: str,
  numberOfAnchorBoltsQuantity: dec,
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
  noOfSideCladdingPurlin: dec,
  noOfFaceCladdingPurlin: dec,
  totalLengthOfCladdingPurlin: dec,
  totalWeightofCladdingPurlin: dec,
  claddingAreaWithoutAnyDeductions: dec,
  averageMaterialConsumption: dec,
  totalCladdingOpenings: dec,
  fasciaOpening: dec,
  claddingSheetQuantity: dec,
  claddingSheetAdditional: dec,
  claddingSheetPurchase: dec,
  columnWindBracings: dec,
  columnWindBracingsAdditional: dec,
  claddingSagRod: dec,
  claddingSagRodAdditional: dec,
  claddingFlangeBrace: dec,
  claddingFlangeBraceAdditional: dec,
  numberOfCladdingPurlinBolts: dec,
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
  doors: str,
  doorsQuantity: dec,
  windows: str,
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
  rollingShutter: str,
  rollingShutterQuantity: dec,
  louvers: str,
  louversQuantity: dec,
  skyLight: str,
  skyLightQuantity: dec,
  wallLight: str,
  wallLightQuantity: dec,
  roofInsulation: str,
  roofInsulationQuantity: dec,
  wallInsulation: str,
  wallInsulationQuantity: dec,
  turboVentilators: str,
  turboVentilatorsQuantity: dec,
  handrail: str,
  handrailQuantity: dec,
})

export const quantityMezzanineSchema = z.object({
  mezzanineStructure: str,
  mezzanineStructureQuantity: dec,
  totalMezzanineArea: dec,
  totalMezzanineAreaQuantity: dec,
  materialConsumption: dec,
  deckSheetQuantity: dec,
  deckSheetPurchaseQuantity: dec,
  deckSheetQuantityAdditional: dec,
  shearStudsQuantity: dec,
  shearStudsPurchaseQuantity: dec,
  shearStudsQuantityAdditional: dec,
  concreteFlashing: dec,
  concreteFlashingAdditional: dec,
  jointBolts: str,
  jointBoltsQuantity: dec,
  foundationBoltsQuantity: dec,
})

export const quantityStairSchema = z.object({
  totalAreaOfStairQuantity: dec,
  totalWeightofStringerBeams: str,
  totalWeightofStringerBeamsQuantity: dec,
  totalWeightofStringerBeamsAdditional: dec,
  totalWeightofSteps: str,
  totalWeightofStepsQuantity: dec,
  totalWeightofStepsAdditional: dec,
})

export const quantityAdditionalBoltsSchema = z.object({
  jointBolt1: str,
  jointBolt1Quantity: dec,
  jointBolt2: str,
  jointBolt2Quantity: dec,
  jointBolt3: str,
  jointBolt3Quantity: dec,
  purlinBolt: str,
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
