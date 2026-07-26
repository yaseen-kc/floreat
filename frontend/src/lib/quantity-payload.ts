import type {
  CreateQuantityPebRoofInput,
  CreateQuantityCladdingInput,
  CreateQuantityCanopyInput,
  CreateQuantityAccessoriesInput,
  CreateQuantityMezzanineInput,
  CreateQuantityStairInput,
  CreateQuantityAdditionalBoltsInput,
  CreateQuantityInput,
} from '@floreat/shared/schemas'

const toNum = (v: unknown): number | null => {
  if (v == null || v === '' || v === 'User Input' || v === 'NA') return null
  const n = Number(v)
  return isNaN(n) ? null : n
}

const toStr = (v: unknown): string | null => {
  if (v == null || v === '' || v === 'User Input' || v === 'NA') return null
  return String(v)
}

export function cleanSectionPayload<T extends Record<string, unknown>>(section: T | null | undefined): Record<string, unknown> | undefined {
  if (!section || typeof section !== 'object') return undefined
  const { id, quantityId, createdAt, updatedAt, ...rest } = section
  return Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== undefined)
  )
}

const PEB_ROOF_NUMERIC_FIELDS = new Set([
  'pebRoofQuantity', 'raftersAndColumnsQuantity', 'lengthOfBuilding', 'lengthOfBuildingQuantity', 'inclinedLengthInOneHalf',
  'roofArea', 'materialConsumption', 'roofPurlinsValue', 'roofPurlinsQuantity', 'lengthOfOnePurlin', 'lengthOfOnePurlinQuantity',
  'noOfPurlinsInOneFrame', 'totalNoOfPurlinBay', 'unitWeightOfPurlin', 'noOfExtendedFrame',
  'noOfExtendedPurlinBay', 'roofSheetQuantity', 'roofSheetPurchaseQuantity', 'extendedRoofWidth',
  'extendedRoofWidthAdditonal', 'extendedRoofWidthAdditional', 'extendedRoofLength', 'roofAreaDeductions', 'polyCarbonateAreaDeductions',
  'polyCarbonateSheetQuantity', 'polyCarbonateSheetPurchaseQuantity', 'lengthOfpolyCarbonateSheet',
  'lengthOfpolyCarbonateSheetAdditional', 'widthOfpolyCarbonateSheet', 'NosOfpolyCarbonateSheet', 'roofWindBracing',
  'lengthOfSinlgeWindBracing', 'lengthOfSinlgeWindBracingAdditional', 'totalNumberOfWindBracing',
  'unitWeightOfRoofWindBracing', 'roofSagRoadValue', 'roofSagRoadQuantity', 'roofSagRoadQuantityAdditional',
  'lengthOfSingleSagRoad', 'lengthOfSingleSagRoadAdditional', 'noOfSagRodInASingleFrame',
  'noOfBayInSagRodProvided', 'noOfSagRodInExtendedFrame', 'noOfExtendedSagRodBay', 'unitWeightOfSagRod',
  'roofFlangeBraceQuantity', 'lengthOfMidFrameFlangeBrace', 'lengthOfMidFrameFlangeBraceAdditional',
  'noOfFlangeBraceInMidFrame', 'noOfFlangeBraceInEndFrame', 'noOfMidFrame', 'noOfEndFrame',
  'noOfFlngBraceInExtendedFrame', 'noOfFlngBraceInExtendedFrame2', 'noOfExtendedMidFrame', 'noOfExtendedEndFrame',
  'lengthOfEndFrameFlangeBrace', 'numberOfPurlinBoltsQuantity', 'noOfPurlinJointInSingleFrame',
  'totalnoOfFrames', 'noOfPurlinnodeInExtendedFrame', 'noOfExtendedFrames', 'noOfBoltsInSinglePurlinJoint',
  'numberOfRoofJointBoltsQuantity', 'numberOfFoundationBoltsQuantity', 'numberOfAnchorBoltsQuantity',
])

const CLADDING_NUMERIC_FIELDS = new Set([
  'claddingStructureQuantity', 'claddingEaveHeightFront', 'claddingEaveHeightFrontAdditional', 'claddingEaveHeightBack',
  'claddingEaveHeightRight', 'claddingEaveHeightLeft', 'extendedColumnHeight', 'widthOfExtendedFrame',
  'noOfSideCladdingPurlin', 'noOfFaceCladdingPurlin', 'totalLengthOfCladdingPurlin',
  'totalWeightofCladdingPurlin', 'claddingAreaWithoutAnyDeductions', 'averageMaterialConsumption',
  'totalCladdingOpenings', 'fasciaOpening', 'claddingSheetQuantity', 'claddingSheetAdditional', 'claddingSheetPurchase',
  'columnWindBracings', 'columnWindBracingsAdditional', 'claddingSagRod', 'claddingSagRodAdditional',
  'claddingFlangeBrace', 'claddingFlangeBraceAdditional', 'numberOfCladdingPurlinBolts', 'numberOfCladdingPurlinBoltsAdditional',
])

const CANOPY_NUMERIC_FIELDS = new Set([
  'canopyStructureQuantity', 'canopyArea', 'canopyPurlinQuantity', 'canopySheetQuantity',
  'canopySheetPurchaseQuantity', 'canopyGutterQuantity', 'canopyDownTakeQuantity',
  'canopySideCoveringQuantity', 'canopyFlashingQuantity', 'canopyPurlinBoltsQuantity',
  'canopyJointBoltsQuantity',
])

const ACCESSORIES_NUMERIC_FIELDS = new Set([
  'doorsQuantity', 'windowsQuantity', 'fasciaStructureQuantity', 'fasciaCoveringSheetBoardQuantity',
  'internalPartitionsQuantity', 'ridgeQuantity', 'gutterQuantity', 'downtakeQuantity', 'dripTrimQuantity',
  'gableEndFlashingQuantity', 'cornerFlashQuantity', 'rollingShutterQuantity', 'louversQuantity',
  'skyLightQuantity', 'wallLightQuantity', 'roofInsulationQuantity', 'wallInsulationQuantity',
  'turboVentilatorsQuantity', 'handrailQuantity',
])

const MEZZANINE_NUMERIC_FIELDS = new Set([
  'mezzanineStructureQuantity', 'totalMezzanineArea', 'totalMezzanineAreaQuantity', 'materialConsumption',
  'deckSheetQuantity', 'deckSheetPurchaseQuantity', 'deckSheetQuantityAdditional', 'shearStudsQuantity',
  'shearStudsPurchaseQuantity', 'shearStudsQuantityAdditional', 'concreteFlashing', 'concreteFlashingAdditional',
  'jointBoltsQuantity', 'foundationBoltsQuantity',
])

const STAIR_NUMERIC_FIELDS = new Set([
  'totalAreaOfStairQuantity', 'totalWeightofStringerBeamsQuantity', 'totalWeightofStringerBeamsAdditional',
  'totalWeightofStepsQuantity', 'totalWeightofStepsAdditional',
])

const ADDITIONAL_BOLTS_NUMERIC_FIELDS = new Set([
  'jointBolt1Quantity', 'jointBolt2Quantity', 'jointBolt3Quantity', 'purlinBoltQuantity',
  'anchorBoltQuantity', 'foundationBoltQuantity',
])

export function flattenPebCalc(calc: any): Record<string, unknown> {
  if (!calc) return {}
  return {
    pebRoofValue: toStr(calc.pebRoof?.pebRoofValue),
    pebRoofQuantity: toNum(calc.pebRoof?.pebRoofQuantity),
    raftersAndColumns: toStr(calc.raftersAndColumns?.raftersAndColumns),
    raftersAndColumnsQuantity: toNum(calc.raftersAndColumns?.raftersAndColumnsQuantity),
    lengthOfBuilding: toNum(calc.raftersAndColumns?.lengthOfBuilding),
    lengthOfBuildingQuantity: toNum(calc.raftersAndColumns?.lengthOfBuildingQuantity),
    inclinedLengthInOneHalf: toNum(calc.raftersAndColumns?.inclinedLengthInOneHalf),
    roofArea: toNum(calc.raftersAndColumns?.roofArea),
    materialConsumption: toNum(calc.raftersAndColumns?.materialConsumption),
    roofPurlinsValue: toNum(calc.roofPurlins?.roofPurlinsValue),
    roofPurlins: toStr(calc.roofPurlins?.roofPurlins),
    roofPurlinsQuantity: toNum(calc.roofPurlins?.roofPurlinsQuantity),
    lengthOfOnePurlin: toNum(calc.roofPurlins?.lengthOfOnePurlin),
    lengthOfOnePurlinQuantity: toNum(calc.roofPurlins?.lengthOfOnePurlinQuantity),
    noOfPurlinsInOneFrame: toNum(calc.roofPurlins?.noOfPurlinsInOneFrame),
    totalNoOfPurlinBay: toNum(calc.roofPurlins?.totalNoOfPurlinBay),
    unitWeightOfPurlin: toNum(calc.roofPurlins?.unitWeightOfPurlin),
    noOfExtendedFrame: toNum(calc.roofPurlins?.noOfExtendedFrame),
    noOfExtendedPurlinBay: toNum(calc.roofPurlins?.noOfExtendedPurlinBay),
    roofSheet: toStr(calc.roofSheet?.roofSheet),
    roofSheetQuantity: toNum(calc.roofSheet?.roofSheetQuantity),
    roofSheetPurchaseQuantity: toNum(calc.roofSheet?.roofSheetPurchaseQuantity),
    extendedRoofWidth: toNum(calc.roofSheet?.extendedRoofWidth),
    extendedRoofWidthAdditonal: toNum(calc.roofSheet?.extendedRoofWidthAdditional),
    extendedRoofLength: toNum(calc.roofSheet?.extendedRoofLength),
    roofAreaDeductions: toNum(calc.roofSheet?.roofAreaDeductions),
    polyCarbonateAreaDeductions: toNum(calc.roofSheet?.polyCarbonateAreaDeductions),
    polyCarbonateSheetQuantity: toNum(calc.polyCarbonateSheet?.polyCarbonateSheetQuantity),
    polyCarbonateSheetPurchaseQuantity: toNum(calc.polyCarbonateSheet?.polyCarbonateSheetPurchaseQuantity),
    lengthOfpolyCarbonateSheet: toNum(calc.polyCarbonateSheet?.lengthOfpolyCarbonateSheet),
    lengthOfpolyCarbonateSheetAdditional: toNum(calc.polyCarbonateSheet?.lengthOfpolyCarbonateSheetAdditional),
    widthOfpolyCarbonateSheet: toNum(calc.polyCarbonateSheet?.widthOfpolyCarbonateSheet),
    NosOfpolyCarbonateSheet: toNum(calc.polyCarbonateSheet?.NosOfpolyCarbonateSheet),
    roofWindBracing: toNum(calc.roofWindBracing?.roofWindBracing),
    lengthOfSinlgeWindBracing: toNum(calc.roofWindBracing?.lengthOfSinlgeWindBracing),
    lengthOfSinlgeWindBracingAdditional: toNum(calc.roofWindBracing?.lengthOfSinlgeWindBracingAdditional),
    totalNumberOfWindBracing: toNum(calc.roofWindBracing?.totalNumberOfWindBracing),
    unitWeightOfRoofWindBracing: toNum(calc.roofWindBracing?.unitWeightOfRoofWindBracing),
    roofSagRoadValue: toNum(calc.roofSagRoad?.roofSagRoadValue),
    roofSagRoadQuantity: toNum(calc.roofSagRoad?.roofSagRoadQuantity),
    lengthOfSingleSagRoad: toNum(calc.roofSagRoad?.lengthOfSingleSagRoad),
    lengthOfSingleSagRoadAdditional: toNum(calc.roofSagRoad?.lengthOfSingleSagRoadAdditional),
    noOfSagRodInASingleFrame: toNum(calc.roofSagRoad?.noOfSagRodInASingleFrame),
    noOfBayInSagRodProvided: toNum(calc.roofSagRoad?.noOfBayInSagRodProvided),
    noOfSagRodInExtendedFrame: toNum(calc.roofSagRoad?.noOfSagRodInExtendedFrame),
    noOfExtendedSagRodBay: toNum(calc.roofSagRoad?.noOfExtendedSagRodBay),
    unitWeightOfSagRod: toNum(calc.roofSagRoad?.unitWeightOfSagRod),
    roofFlangeBraceQuantity: toNum(calc.roofFlangeBrace?.roofFlangeBraceQuantity),
    lengthOfMidFrameFlangeBrace: toNum(calc.roofFlangeBrace?.lengthOfMidFrameFlangeBrace),
    lengthOfMidFrameFlangeBraceAdditional: toNum(calc.roofFlangeBrace?.lengthOfMidFrameFlangeBraceAdditional),
    noOfFlangeBraceInMidFrame: toNum(calc.roofFlangeBrace?.noOfFlangeBraceInMidFrame),
    noOfFlangeBraceInEndFrame: toNum(calc.roofFlangeBrace?.noOfFlangeBraceInEndFrame),
    noOfMidFrame: toNum(calc.roofFlangeBrace?.noOfMidFrame),
    noOfEndFrame: toNum(calc.roofFlangeBrace?.noOfEndFrame),
    noOfFlngBraceInExtendedFrame: toNum(calc.roofFlangeBrace?.noOfFlngBraceInExtendedFrame),
    noOfFlngBraceInExtendedFrame2: toNum(calc.roofFlangeBrace?.noOfFlngBraceInExtendedFrame2),
    noOfExtendedMidFrame: toNum(calc.roofFlangeBrace?.noOfExtendedMidFrame),
    noOfExtendedEndFrame: toNum(calc.roofFlangeBrace?.noOfExtendedEndFrame),
    lengthOfEndFrameFlangeBrace: toNum(calc.roofFlangeBrace?.lengthOfEndFrameFlangeBrace),
    numberOfPurlinBolts: toStr(calc.bolts?.numberOfPurlinBolts),
    numberOfPurlinBoltsQuantity: toNum(calc.bolts?.numberOfPurlinBoltsQuantity),
    noOfPurlinJointInSingleFrame: toNum(calc.bolts?.noOfPurlinJointInSingleFrame),
    totalnoOfFrames: toNum(calc.bolts?.totalnoOfFrames),
    noOfPurlinnodeInExtendedFrame: toNum(calc.bolts?.noOfPurlinnodeInExtendedFrame),
    noOfExtendedFrames: toNum(calc.bolts?.noOfExtendedFrames),
    noOfBoltsInSinglePurlinJoint: toNum(calc.bolts?.noOfBoltsInSinglePurlinJoint),
    numberOfRoofJointBolts: toStr(calc.bolts?.numberOfRoofJointBolts),
    numberOfRoofJointBoltsQuantity: toNum(calc.bolts?.numberOfRoofJointBoltsQuantity),
    numberOfFoundationBolts: toStr(calc.bolts?.numberOfFoundationBolts),
    numberOfFoundationBoltsQuantity: toNum(calc.bolts?.numberOfFoundationBoltsQuantity),
    numberOfAnchorBolts: toStr(calc.bolts?.numberOfAnchorBolts),
    numberOfAnchorBoltsQuantity: toNum(calc.bolts?.numberOfAnchorBoltsQuantity),
  }
}

export function flattenCladdingCalc(calc: any): Record<string, unknown> {
  if (!calc) return {}
  return {
    claddingStructureQuantity: toNum(calc.claddingStructure?.claddingStructureQuantity),
    claddingEaveHeightFront: toNum(calc.claddingStructure?.claddingEaveHeightFront),
    claddingEaveHeightFrontAdditional: toNum(calc.claddingStructure?.claddingEaveHeightFrontAdditional),
    claddingEaveHeightBack: toNum(calc.claddingStructure?.claddingEaveHeightBack),
    claddingEaveHeightRight: toNum(calc.claddingStructure?.claddingEaveHeightRight),
    claddingEaveHeightLeft: toNum(calc.claddingStructure?.claddingEaveHeightLeft),
    extendedColumnHeight: toNum(calc.claddingStructure?.extendedColumnHeight),
    widthOfExtendedFrame: toNum(calc.claddingStructure?.widthOfExtendedFrame),
    noOfSideCladdingPurlin: toNum(calc.claddingStructure?.noOfSideCladdingPurlin),
    noOfFaceCladdingPurlin: toNum(calc.claddingStructure?.noOfFaceCladdingPurlin),
    totalLengthOfCladdingPurlin: toNum(calc.claddingStructure?.totalLengthOfCladdingPurlin),
    totalWeightofCladdingPurlin: toNum(calc.claddingStructure?.totalWeightofCladdingPurlin),
    claddingAreaWithoutAnyDeductions: toNum(calc.claddingStructure?.claddingAreaWithoutAnyDeductions),
    averageMaterialConsumption: toNum(calc.claddingStructure?.averageMaterialConsumption),
    totalCladdingOpenings: toNum(calc.claddingStructure?.totalCladdingOpenings),
    fasciaOpening: toNum(calc.claddingStructure?.fasciaOpening),
    claddingSheetQuantity: toNum(calc.claddingSheet?.claddingSheetQuantity),
    claddingSheetAdditional: toNum(calc.claddingSheet?.claddingSheetAdditional),
    claddingSheetPurchase: toNum(calc.claddingSheet?.claddingSheetPurchase),
    columnWindBracings: toNum(calc.claddingSheet?.columnWindBracings),
    columnWindBracingsAdditional: toNum(calc.claddingSheet?.columnWindBracingsAdditional),
    claddingSagRod: toNum(calc.claddingSheet?.claddingSagRod),
    claddingSagRodAdditional: toNum(calc.claddingSheet?.claddingSagRodAdditional),
    claddingFlangeBrace: toNum(calc.claddingSheet?.claddingFlangeBrace),
    claddingFlangeBraceAdditional: toNum(calc.claddingSheet?.claddingFlangeBraceAdditional),
    numberOfCladdingPurlinBolts: toNum(calc.claddingSheet?.numberOfCladdingPurlinBolts),
    numberOfCladdingPurlinBoltsAdditional: toNum(calc.claddingSheet?.numberOfCladdingPurlinBoltsAdditional),
  }
}

export function flattenCanopyCalc(calc: any): Record<string, unknown> {
  if (!calc) return {}
  return {
    canopyStructureQuantity: toNum(calc.canopyStructureQuantity),
    canopyArea: toNum(calc.canopyArea),
    canopyPurlinQuantity: toNum(calc.canopyPurlinQuantity),
    canopySheetQuantity: toNum(calc.canopySheetQuantity),
    canopySheetPurchaseQuantity: toNum(calc.canopySheetPurchaseQuantity),
    canopyGutterQuantity: toNum(calc.canopyGutterQuantity),
    canopyDownTakeQuantity: toNum(calc.canopyDownTakeQuantity),
    canopySideCoveringQuantity: toNum(calc.canopySideCoveringQuantity),
    canopyFlashingQuantity: toNum(calc.canopyFlashingQuantity),
    canopyPurlinBoltsQuantity: toNum(calc.canopyPurlinBoltsQuantity),
    canopyJointBoltsQuantity: toNum(calc.canopyJointBoltsQuantity),
  }
}

export function flattenAccessoriesCalc(calc: any): Record<string, unknown> {
  if (!calc) return {}
  return {
    doors: toStr(calc.doors),
    doorsQuantity: toNum(calc.doorsQuantity),
    windows: toStr(calc.windows),
    windowsQuantity: toNum(calc.windowsQuantity),
    fasciaStructureQuantity: toNum(calc.fasciaStructureQuantity),
    fasciaCoveringSheetBoardQuantity: toNum(calc.fasciaCoveringSheetBoardQuantity),
    internalPartitionsQuantity: toNum(calc.internalPartitionsQuantity),
    ridgeQuantity: toNum(calc.ridgeQuantity),
    gutterQuantity: toNum(calc.gutterQuantity),
    downtakeQuantity: toNum(calc.downtakeQuantity),
    dripTrimQuantity: toNum(calc.dripTrimQuantity),
    gableEndFlashingQuantity: toNum(calc.gableEndFlashingQuantity),
    cornerFlashQuantity: toNum(calc.cornerFlashQuantity),
    rollingShutter: toStr(calc.rollingShutter),
    rollingShutterQuantity: toNum(calc.rollingShutterQuantity),
    louvers: toStr(calc.louvers),
    louversQuantity: toNum(calc.louversQuantity),
    skyLight: toStr(calc.skyLight),
    skyLightQuantity: toNum(calc.skyLightQuantity),
    wallLight: toStr(calc.wallLight),
    wallLightQuantity: toNum(calc.wallLightQuantity),
    roofInsulation: toStr(calc.roofInsulation),
    roofInsulationQuantity: toNum(calc.roofInsulationQuantity),
    wallInsulation: toStr(calc.wallInsulation),
    wallInsulationQuantity: toNum(calc.wallInsulationQuantity),
    turboVentilators: toStr(calc.turboVentilators),
    turboVentilatorsQuantity: toNum(calc.turboVentilatorsQuantity),
    handrail: toStr(calc.handrail),
    handrailQuantity: toNum(calc.handrailQuantity),
  }
}

export function flattenMezzanineCalc(calc: any): Record<string, unknown> {
  if (!calc) return {}
  return {
    mezzanineStructure: toStr(calc.mezzanineStructure),
    mezzanineStructureQuantity: toNum(calc.mezzanineStructureQuantity),
    totalMezzanineArea: toNum(calc.totalMezzanineArea),
    totalMezzanineAreaQuantity: toNum(calc.totalMezzanineAreaQuantity),
    materialConsumption: toNum(calc.materialConsumption),
    deckSheetQuantity: toNum(calc.deckSheetQuantity),
    deckSheetPurchaseQuantity: toNum(calc.deckSheetPurchaseQuantity),
    deckSheetQuantityAdditional: toNum(calc.deckSheetQuantityAdditional),
    shearStudsQuantity: toNum(calc.shearStudsQuantity),
    shearStudsPurchaseQuantity: toNum(calc.shearStudsPurchaseQuantity),
    shearStudsQuantityAdditional: toNum(calc.shearStudsQuantityAdditional),
    concreteFlashing: toNum(calc.concreteFlashing),
    concreteFlashingAdditional: toNum(calc.concreteFlashingAdditional),
    jointBolts: toStr(calc.jointBolts),
    jointBoltsQuantity: toNum(calc.jointBoltsQuantity),
    foundationBoltsQuantity: toNum(calc.foundationBoltsQuantity),
  }
}

export function flattenStairCalc(calc: any): Record<string, unknown> {
  if (!calc) return {}
  return {
    totalAreaOfStairQuantity: toNum(calc.totalAreaOfStairQuantity),
    totalWeightofStringerBeams: toStr(calc.totalWeightofStringerBeams),
    totalWeightofStringerBeamsQuantity: toNum(calc.totalWeightofStringerBeamsQuantity),
    totalWeightofStringerBeamsAdditional: toNum(calc.totalWeightofStringerBeamsAdditional),
    totalWeightofSteps: toStr(calc.totalWeightofSteps),
    totalWeightofStepsQuantity: toNum(calc.totalWeightofStepsQuantity),
    totalWeightofStepsAdditional: toNum(calc.totalWeightofStepsAdditional),
  }
}

export function flattenAdditionalBoltsCalc(calc: any): Record<string, unknown> {
  if (!calc) return {}
  return {
    jointBolt1: toStr(calc.jointBolt1),
    jointBolt1Quantity: toNum(calc.jointBolt1Quantity),
    jointBolt2: toStr(calc.jointBolt2),
    jointBolt2Quantity: toNum(calc.jointBolt2Quantity),
    jointBolt3: toStr(calc.jointBolt3),
    jointBolt3Quantity: toNum(calc.jointBolt3Quantity),
    purlinBolt: toStr(calc.purlinBolt),
    purlinBoltQuantity: toNum(calc.purlinBoltQuantity),
    anchorBoltQuantity: toNum(calc.anchorBoltQuantity),
    foundationBoltQuantity: toNum(calc.foundationBoltQuantity),
  }
}

function processDraft(draft: Record<string, string>, numericFields: Set<string>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(draft)) {
    if (val !== undefined && val !== '') {
      if (numericFields.has(key)) {
        result[key] = toNum(val)
      } else {
        result[key] = toStr(val)
      }
    }
  }
  return result
}

function mergeSectionPayload(
  flattened: Record<string, unknown>,
  initialData: Record<string, unknown> | null | undefined,
  processedDraft: Record<string, unknown>,
  numericFields: Set<string>
): Record<string, unknown> {
  const cleanedInitial = cleanSectionPayload(initialData) ?? {}
  const merged: Record<string, unknown> = {}

  for (const [key, val] of Object.entries(cleanedInitial)) {
    if (val !== null && val !== undefined && val !== '') {
      if (numericFields.has(key)) {
        merged[key] = toNum(val)
      } else {
        merged[key] = toStr(val)
      }
    }
  }

  for (const [key, val] of Object.entries(flattened)) {
    if (val !== null && val !== undefined) {
      merged[key] = val
    }
  }

  for (const [key, val] of Object.entries(processedDraft)) {
    if (val !== undefined) {
      merged[key] = val
    }
  }

  return cleanSectionPayload(merged) ?? {}
}

export function buildPebRoofPayload(calc: any, initialData: any, draft: Record<string, string> = {}): CreateQuantityPebRoofInput {
  const flattened = flattenPebCalc(calc)
  const processedDraft = processDraft(draft, PEB_ROOF_NUMERIC_FIELDS)
  return mergeSectionPayload(flattened, initialData, processedDraft, PEB_ROOF_NUMERIC_FIELDS) as CreateQuantityPebRoofInput
}

export function buildCladdingPayload(calc: any, initialData: any, draft: Record<string, string> = {}): CreateQuantityCladdingInput {
  const flattened = flattenCladdingCalc(calc)
  const processedDraft = processDraft(draft, CLADDING_NUMERIC_FIELDS)
  return mergeSectionPayload(flattened, initialData, processedDraft, CLADDING_NUMERIC_FIELDS) as CreateQuantityCladdingInput
}

export function buildCanopyPayload(calc: any, initialData: any, draft: Record<string, string> = {}): CreateQuantityCanopyInput {
  const flattened = flattenCanopyCalc(calc)
  const processedDraft = processDraft(draft, CANOPY_NUMERIC_FIELDS)
  return mergeSectionPayload(flattened, initialData, processedDraft, CANOPY_NUMERIC_FIELDS) as CreateQuantityCanopyInput
}

export function buildAccessoriesPayload(calc: any, initialData: any, draft: Record<string, string> = {}): CreateQuantityAccessoriesInput {
  const flattened = flattenAccessoriesCalc(calc)
  const processedDraft = processDraft(draft, ACCESSORIES_NUMERIC_FIELDS)
  return mergeSectionPayload(flattened, initialData, processedDraft, ACCESSORIES_NUMERIC_FIELDS) as CreateQuantityAccessoriesInput
}

export function buildMezzaninePayload(calc: any, initialData: any, draft: Record<string, string> = {}): CreateQuantityMezzanineInput {
  const flattened = flattenMezzanineCalc(calc)
  const processedDraft = processDraft(draft, MEZZANINE_NUMERIC_FIELDS)
  return mergeSectionPayload(flattened, initialData, processedDraft, MEZZANINE_NUMERIC_FIELDS) as CreateQuantityMezzanineInput
}

export function buildStairPayload(calc: any, initialData: any, draft: Record<string, string> = {}): CreateQuantityStairInput {
  const flattened = flattenStairCalc(calc)
  const processedDraft = processDraft(draft, STAIR_NUMERIC_FIELDS)
  return mergeSectionPayload(flattened, initialData, processedDraft, STAIR_NUMERIC_FIELDS) as CreateQuantityStairInput
}

export function buildAdditionalBoltsPayload(calc: any, initialData: any, draft: Record<string, string> = {}): CreateQuantityAdditionalBoltsInput {
  const flattened = flattenAdditionalBoltsCalc(calc)
  const processedDraft = processDraft(draft, ADDITIONAL_BOLTS_NUMERIC_FIELDS)
  return mergeSectionPayload(flattened, initialData, processedDraft, ADDITIONAL_BOLTS_NUMERIC_FIELDS) as CreateQuantityAdditionalBoltsInput
}

export function buildFullQuantityPayload(
  calcs: {
    pebRoof?: any
    cladding?: any
    canopy?: any
    accessories?: any
    mezzanine?: any
    stair?: any
    additionalBolts?: any
  },
  quantityStoreState: any,
  sectionDrafts: Record<string, Record<string, string>> = {}
): CreateQuantityInput {
  return {
    pebRoof: buildPebRoofPayload(calcs.pebRoof, quantityStoreState?.pebRoof, sectionDrafts.pebRoof),
    cladding: buildCladdingPayload(calcs.cladding, quantityStoreState?.cladding, sectionDrafts.cladding),
    canopy: buildCanopyPayload(calcs.canopy, quantityStoreState?.canopy, sectionDrafts.canopy),
    accessories: buildAccessoriesPayload(calcs.accessories, quantityStoreState?.accessories, sectionDrafts.accessories),
    mezzanine: buildMezzaninePayload(calcs.mezzanine, quantityStoreState?.mezzanine, sectionDrafts.mezzanine),
    stair: buildStairPayload(calcs.stair, quantityStoreState?.stair, sectionDrafts.stair),
    additionalBolts: buildAdditionalBoltsPayload(calcs.additionalBolts, quantityStoreState?.additionalBolts, sectionDrafts.additionalBolts),
  }
}
