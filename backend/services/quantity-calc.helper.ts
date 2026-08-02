/**
 * Quantity Calc Helper — computes server-authoritative quantities for a job.
 * Loads canonical job input entities from PostgreSQL and applies pure equation
 * functions from @floreat/shared/calc.
 */
import { prisma } from '../lib/prisma.js'
import {
  calculatePebQuantities,
  calculateCladdingQuantities,
  calculateCanopyQuantities,
  calculateAccessoriesQuantities,
  calculateMezzanineQuantities,
  calculateStairQuantities,
  calculateAdditionalBoltsQuantities,
} from '@floreat/shared/calc'

const toNum = (v: unknown): number | null => {
  if (v == null || v === '' || v === 'User Input' || v === 'NA') return null
  const n = Number(v)
  return isNaN(n) ? null : n
}

const toStr = (v: unknown): string | null => {
  if (v == null || v === '' || v === 'User Input' || v === 'NA') return null
  return String(v)
}

/**
 * Computes authoritative baseline quantity objects for all 7 sections of a job
 * by running `@floreat/shared/calc` functions against PostgreSQL job inputs.
 */
export async function computeJobQuantities(jobId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      roof: { include: { sidewalls: { orderBy: [{ side: 'asc' }, { id: 'asc' }] } } },
      mezzanine: { include: { floors: { orderBy: [{ code: 'asc' }, { id: 'asc' }] }, extensions: { orderBy: [{ code: 'asc' }, { id: 'asc' }] } } },
      stair: { include: { stairs: { orderBy: [{ code: 'asc' }, { id: 'asc' }] }, areaDeductions: { orderBy: { id: 'asc' } } } },
      canopy: { include: { canopies: { orderBy: { id: 'asc' } } } },
      accessories: true,
      joint: {
        include: {
          jointBoltRoof: { orderBy: [{ roofJointId: 'asc' }, { id: 'asc' }] },
          jointBoltMezzanine: { orderBy: [{ mezzanineJointId: 'asc' }, { id: 'asc' }] },
          foundationBoltRoof: { orderBy: [{ foundationJointId: 'asc' }, { id: 'asc' }] },
        },
      },
    },
  })

  if (!job) return null

  const pebCalc = calculatePebQuantities({
    roof: job.roof,
    joint: job.joint,
    jointBoltRoofs: job.joint?.jointBoltRoof ?? [],
    foundationBoltRoof: job.joint?.foundationBoltRoof,
  })

  const claddingCalc = calculateCladdingQuantities({ roof: job.roof })
  const canopyCalc = calculateCanopyQuantities({ canopy: job.canopy, joint: job.joint })
  const accessoriesCalc = calculateAccessoriesQuantities({ accessories: job.accessories, roof: job.roof })
  const mezzanineCalc = calculateMezzanineQuantities({
    mezzanine: job.mezzanine,
    joint: job.joint,
    jointBoltMezzanines: job.joint?.jointBoltMezzanine ?? [],
    stair: job.stair,
  })
  const stairCalc = calculateStairQuantities({ stair: job.stair, mezzanine: job.mezzanine })
  const additionalBoltsCalc = calculateAdditionalBoltsQuantities({})

  return {
    pebRoof: {
      pebRoofValue: toStr(pebCalc.pebRoof?.pebRoofValue),
      pebRoofQuantity: toNum(pebCalc.pebRoof?.pebRoofQuantity),
      raftersAndColumns: toStr(pebCalc.raftersAndColumns?.raftersAndColumns),
      raftersAndColumnsQuantity: toNum(pebCalc.raftersAndColumns?.raftersAndColumnsQuantity),
      lengthOfBuilding: toNum(pebCalc.raftersAndColumns?.lengthOfBuilding),
      lengthOfBuildingQuantity: toNum(pebCalc.raftersAndColumns?.lengthOfBuildingQuantity),
      inclinedLengthInOneHalf: toNum(pebCalc.raftersAndColumns?.inclinedLengthInOneHalf),
      roofArea: toNum(pebCalc.raftersAndColumns?.roofArea),
      materialConsumption: toNum(pebCalc.raftersAndColumns?.materialConsumption),
      roofPurlinsValue: toNum(pebCalc.roofPurlins?.roofPurlinsValue),
      roofPurlins: toStr(pebCalc.roofPurlins?.roofPurlins),
      roofPurlinsQuantity: toNum(pebCalc.roofPurlins?.roofPurlinsQuantity),
      lengthOfOnePurlin: toNum(pebCalc.roofPurlins?.lengthOfOnePurlin),
      lengthOfOnePurlinQuantity: toNum(pebCalc.roofPurlins?.lengthOfOnePurlinQuantity),
      noOfPurlinsInOneFrame: toNum(pebCalc.roofPurlins?.noOfPurlinsInOneFrame),
      totalNoOfPurlinBay: toNum(pebCalc.roofPurlins?.totalNoOfPurlinBay),
      unitWeightOfPurlin: toNum(pebCalc.roofPurlins?.unitWeightOfPurlin),
      noOfExtendedFrame: toNum(pebCalc.roofPurlins?.noOfExtendedFrame),
      noOfExtendedPurlinBay: toNum(pebCalc.roofPurlins?.noOfExtendedPurlinBay),
      roofSheet: toStr(pebCalc.roofSheet?.roofSheet),
      roofSheetQuantity: toNum(pebCalc.roofSheet?.roofSheetQuantity),
      roofSheetPurchaseQuantity: toNum(pebCalc.roofSheet?.roofSheetPurchaseQuantity),
      extendedRoofWidth: toNum(pebCalc.roofSheet?.extendedRoofWidth),
      extendedRoofWidthAdditonal: toNum(pebCalc.roofSheet?.extendedRoofWidthAdditional),
      extendedRoofLength: toNum(pebCalc.roofSheet?.extendedRoofLength),
      roofAreaDeductions: toNum(pebCalc.roofSheet?.roofAreaDeductions),
      polyCarbonateAreaDeductions: toNum(pebCalc.roofSheet?.polyCarbonateAreaDeductions),
      polyCarbonateSheetQuantity: toNum(pebCalc.polyCarbonateSheet?.polyCarbonateSheetQuantity),
      polyCarbonateSheetPurchaseQuantity: toNum(pebCalc.polyCarbonateSheet?.polyCarbonateSheetPurchaseQuantity),
      lengthOfpolyCarbonateSheet: toNum(pebCalc.polyCarbonateSheet?.lengthOfpolyCarbonateSheet),
      lengthOfpolyCarbonateSheetAdditional: toNum(pebCalc.polyCarbonateSheet?.lengthOfpolyCarbonateSheetAdditional),
      widthOfpolyCarbonateSheet: toNum(pebCalc.polyCarbonateSheet?.widthOfpolyCarbonateSheet),
      NosOfpolyCarbonateSheet: toNum(pebCalc.polyCarbonateSheet?.NosOfpolyCarbonateSheet),
      roofWindBracing: toNum(pebCalc.roofWindBracing?.roofWindBracing),
      lengthOfSinlgeWindBracing: toNum(pebCalc.roofWindBracing?.lengthOfSinlgeWindBracing),
      lengthOfSinlgeWindBracingAdditional: toNum(pebCalc.roofWindBracing?.lengthOfSinlgeWindBracingAdditional),
      totalNumberOfWindBracing: toNum(pebCalc.roofWindBracing?.totalNumberOfWindBracing),
      unitWeightOfRoofWindBracing: toNum(pebCalc.roofWindBracing?.unitWeightOfRoofWindBracing),
      roofSagRoadValue: toNum(pebCalc.roofSagRoad?.roofSagRoadValue),
      roofSagRoadQuantity: toNum(pebCalc.roofSagRoad?.roofSagRoadQuantity),
      lengthOfSingleSagRoad: toNum(pebCalc.roofSagRoad?.lengthOfSingleSagRoad),
      lengthOfSingleSagRoadAdditional: toNum(pebCalc.roofSagRoad?.lengthOfSingleSagRoadAdditional),
      noOfSagRodInASingleFrame: toNum(pebCalc.roofSagRoad?.noOfSagRodInASingleFrame),
      noOfBayInSagRodProvided: toNum(pebCalc.roofSagRoad?.noOfBayInSagRodProvided),
      noOfSagRodInExtendedFrame: toNum(pebCalc.roofSagRoad?.noOfSagRodInExtendedFrame),
      noOfExtendedSagRodBay: toNum(pebCalc.roofSagRoad?.noOfExtendedSagRodBay),
      unitWeightOfSagRod: toNum(pebCalc.roofSagRoad?.unitWeightOfSagRod),
      roofFlangeBraceQuantity: toNum(pebCalc.roofFlangeBrace?.roofFlangeBraceQuantity),
      lengthOfMidFrameFlangeBrace: toNum(pebCalc.roofFlangeBrace?.lengthOfMidFrameFlangeBrace),
      lengthOfMidFrameFlangeBraceAdditional: toNum(pebCalc.roofFlangeBrace?.lengthOfMidFrameFlangeBraceAdditional),
      noOfFlangeBraceInMidFrame: toNum(pebCalc.roofFlangeBrace?.noOfFlangeBraceInMidFrame),
      noOfFlangeBraceInEndFrame: toNum(pebCalc.roofFlangeBrace?.noOfFlangeBraceInEndFrame),
      noOfMidFrame: toNum(pebCalc.roofFlangeBrace?.noOfMidFrame),
      noOfEndFrame: toNum(pebCalc.roofFlangeBrace?.noOfEndFrame),
      noOfFlngBraceInExtendedFrame: toNum(pebCalc.roofFlangeBrace?.noOfFlngBraceInExtendedFrame),
      noOfFlngBraceInExtendedFrame2: toNum(pebCalc.roofFlangeBrace?.noOfFlngBraceInExtendedFrame2),
      noOfExtendedMidFrame: toNum(pebCalc.roofFlangeBrace?.noOfExtendedMidFrame),
      noOfExtendedEndFrame: toNum(pebCalc.roofFlangeBrace?.noOfExtendedEndFrame),
      lengthOfEndFrameFlangeBrace: toNum(pebCalc.roofFlangeBrace?.lengthOfEndFrameFlangeBrace),
      numberOfPurlinBolts: toStr(pebCalc.bolts?.numberOfPurlinBolts),
      numberOfPurlinBoltsQuantity: toNum(pebCalc.bolts?.numberOfPurlinBoltsQuantity),
      noOfPurlinJointInSingleFrame: toNum(pebCalc.bolts?.noOfPurlinJointInSingleFrame),
      totalnoOfFrames: toNum(pebCalc.bolts?.totalnoOfFrames),
      noOfPurlinnodeInExtendedFrame: toNum(pebCalc.bolts?.noOfPurlinnodeInExtendedFrame),
      noOfExtendedFrames: toNum(pebCalc.bolts?.noOfExtendedFrames),
      noOfBoltsInSinglePurlinJoint: toNum(pebCalc.bolts?.noOfBoltsInSinglePurlinJoint),
      numberOfRoofJointBolts: toStr(pebCalc.bolts?.numberOfRoofJointBolts),
      numberOfRoofJointBoltsQuantity: toNum(pebCalc.bolts?.numberOfRoofJointBoltsQuantity),
      numberOfFoundationBolts: toStr(pebCalc.bolts?.numberOfFoundationBolts),
      numberOfFoundationBoltsQuantity: toNum(pebCalc.bolts?.numberOfFoundationBoltsQuantity),
      numberOfAnchorBolts: toStr(pebCalc.bolts?.numberOfAnchorBolts),
      numberOfAnchorBoltsQuantity: toNum(pebCalc.bolts?.numberOfAnchorBoltsQuantity),
    },
    cladding: {
      claddingStructureQuantity: toNum(claddingCalc.claddingStructure?.claddingStructureQuantity),
      claddingEaveHeightFront: toNum(claddingCalc.claddingStructure?.claddingEaveHeightFront),
      claddingEaveHeightFrontAdditional: toNum(claddingCalc.claddingStructure?.claddingEaveHeightFrontAdditional),
      claddingEaveHeightBack: toNum(claddingCalc.claddingStructure?.claddingEaveHeightBack),
      claddingEaveHeightRight: toNum(claddingCalc.claddingStructure?.claddingEaveHeightRight),
      claddingEaveHeightLeft: toNum(claddingCalc.claddingStructure?.claddingEaveHeightLeft),
      extendedColumnHeight: toNum(claddingCalc.claddingStructure?.extendedColumnHeight),
      widthOfExtendedFrame: toNum(claddingCalc.claddingStructure?.widthOfExtendedFrame),
      noOfSideCladdingPurlin: toNum(claddingCalc.claddingStructure?.noOfSideCladdingPurlin),
      noOfFaceCladdingPurlin: toNum(claddingCalc.claddingStructure?.noOfFaceCladdingPurlin),
      totalLengthOfCladdingPurlin: toNum(claddingCalc.claddingStructure?.totalLengthOfCladdingPurlin),
      totalWeightofCladdingPurlin: toNum(claddingCalc.claddingStructure?.totalWeightofCladdingPurlin),
      claddingAreaWithoutAnyDeductions: toNum(claddingCalc.claddingStructure?.claddingAreaWithoutAnyDeductions),
      averageMaterialConsumption: toNum(claddingCalc.claddingStructure?.averageMaterialConsumption),
      totalCladdingOpenings: toNum(claddingCalc.claddingStructure?.totalCladdingOpenings),
      fasciaOpening: toNum(claddingCalc.claddingStructure?.fasciaOpening),
      claddingSheetQuantity: toNum(claddingCalc.claddingSheet?.claddingSheetQuantity),
      claddingSheetAdditional: toNum(claddingCalc.claddingSheet?.claddingSheetAdditional),
      claddingSheetPurchase: toNum(claddingCalc.claddingSheet?.claddingSheetPurchase),
      columnWindBracings: toNum(claddingCalc.claddingSheet?.columnWindBracings),
      columnWindBracingsAdditional: toNum(claddingCalc.claddingSheet?.columnWindBracingsAdditional),
      claddingSagRod: toNum(claddingCalc.claddingSheet?.claddingSagRod),
      claddingSagRodAdditional: toNum(claddingCalc.claddingSheet?.claddingSagRodAdditional),
      claddingFlangeBrace: toNum(claddingCalc.claddingSheet?.claddingFlangeBrace),
      claddingFlangeBraceAdditional: toNum(claddingCalc.claddingSheet?.claddingFlangeBraceAdditional),
      numberOfCladdingPurlinBolts: toNum(claddingCalc.claddingSheet?.numberOfCladdingPurlinBolts),
      numberOfCladdingPurlinBoltsAdditional: toNum(claddingCalc.claddingSheet?.numberOfCladdingPurlinBoltsAdditional),
    },
    canopy: {
      canopyStructureQuantity: toNum(canopyCalc.canopyStructureQuantity),
      canopyArea: toNum(canopyCalc.canopyArea),
      canopyPurlinQuantity: toNum(canopyCalc.canopyPurlinQuantity),
      canopySheetQuantity: toNum(canopyCalc.canopySheetQuantity),
      canopySheetPurchaseQuantity: toNum(canopyCalc.canopySheetPurchaseQuantity),
      canopyGutterQuantity: toNum(canopyCalc.canopyGutterQuantity),
      canopyDownTakeQuantity: toNum(canopyCalc.canopyDownTakeQuantity),
      canopySideCoveringQuantity: toNum(canopyCalc.canopySideCoveringQuantity),
      canopyFlashingQuantity: toNum(canopyCalc.canopyFlashingQuantity),
      canopyPurlinBoltsQuantity: toNum(canopyCalc.canopyPurlinBoltsQuantity),
      canopyJointBoltsQuantity: toNum(canopyCalc.canopyJointBoltsQuantity),
    },
    accessories: {
      doors: toStr(accessoriesCalc.doors),
      doorsQuantity: toNum(accessoriesCalc.doorsQuantity),
      windows: toStr(accessoriesCalc.windows),
      windowsQuantity: toNum(accessoriesCalc.windowsQuantity),
      fasciaStructureQuantity: toNum(accessoriesCalc.fasciaStructureQuantity),
      fasciaCoveringSheetBoardQuantity: toNum(accessoriesCalc.fasciaCoveringSheetBoardQuantity),
      internalPartitionsQuantity: toNum(accessoriesCalc.internalPartitionsQuantity),
      ridgeQuantity: toNum(accessoriesCalc.ridgeQuantity),
      gutterQuantity: toNum(accessoriesCalc.gutterQuantity),
      downtakeQuantity: toNum(accessoriesCalc.downtakeQuantity),
      dripTrimQuantity: toNum(accessoriesCalc.dripTrimQuantity),
      gableEndFlashingQuantity: toNum(accessoriesCalc.gableEndFlashingQuantity),
      cornerFlashQuantity: toNum(accessoriesCalc.cornerFlashQuantity),
      rollingShutter: toStr(accessoriesCalc.rollingShutter),
      rollingShutterQuantity: toNum(accessoriesCalc.rollingShutterQuantity),
      louvers: toStr(accessoriesCalc.louvers),
      louversQuantity: toNum(accessoriesCalc.louversQuantity),
      skyLight: toStr(accessoriesCalc.skyLight),
      skyLightQuantity: toNum(accessoriesCalc.skyLightQuantity),
      wallLight: toStr(accessoriesCalc.wallLight),
      wallLightQuantity: toNum(accessoriesCalc.wallLightQuantity),
      roofInsulation: toStr(accessoriesCalc.roofInsulation),
      roofInsulationQuantity: toNum(accessoriesCalc.roofInsulationQuantity),
      wallInsulation: toStr(accessoriesCalc.wallInsulation),
      wallInsulationQuantity: toNum(accessoriesCalc.wallInsulationQuantity),
      turboVentilators: toStr(accessoriesCalc.turboVentilators),
      turboVentilatorsQuantity: toNum(accessoriesCalc.turboVentilatorsQuantity),
      handrail: toStr(accessoriesCalc.handrail),
      handrailQuantity: toNum(accessoriesCalc.handrailQuantity),
    },
    mezzanine: {
      mezzanineStructure: toStr(mezzanineCalc.mezzanineStructure),
      mezzanineStructureQuantity: toNum(mezzanineCalc.mezzanineStructureQuantity),
      totalMezzanineArea: toNum(mezzanineCalc.totalMezzanineArea),
      totalMezzanineAreaQuantity: toNum(mezzanineCalc.totalMezzanineAreaQuantity),
      materialConsumption: toNum(mezzanineCalc.materialConsumption),
      deckSheetQuantity: toNum(mezzanineCalc.deckSheetQuantity),
      deckSheetPurchaseQuantity: toNum(mezzanineCalc.deckSheetPurchaseQuantity),
      deckSheetQuantityAdditional: toNum(mezzanineCalc.deckSheetQuantityAdditional),
      shearStudsQuantity: toNum(mezzanineCalc.shearStudsQuantity),
      shearStudsPurchaseQuantity: toNum(mezzanineCalc.shearStudsPurchaseQuantity),
      shearStudsQuantityAdditional: toNum(mezzanineCalc.shearStudsQuantityAdditional),
      concreteFlashing: toNum(mezzanineCalc.concreteFlashing),
      concreteFlashingAdditional: toNum(mezzanineCalc.concreteFlashingAdditional),
      jointBolts: toStr(mezzanineCalc.jointBolts),
      jointBoltsQuantity: toNum(mezzanineCalc.jointBoltsQuantity),
      foundationBoltsQuantity: toNum(mezzanineCalc.foundationBoltsQuantity),
    },
    stair: {
      totalAreaOfStairQuantity: toNum(stairCalc.totalAreaOfStairQuantity),
      totalWeightofStringerBeams: toStr(stairCalc.totalWeightofStringerBeams),
      totalWeightofStringerBeamsQuantity: toNum(stairCalc.totalWeightofStringerBeamsQuantity),
      totalWeightofStringerBeamsAdditional: toNum(stairCalc.totalWeightofStringerBeamsAdditional),
      totalWeightofSteps: toStr(stairCalc.totalWeightofSteps),
      totalWeightofStepsQuantity: toNum(stairCalc.totalWeightofStepsQuantity),
      totalWeightofStepsAdditional: toNum(stairCalc.totalWeightofStepsAdditional),
    },
    additionalBolts: {
      jointBolt1: toStr(additionalBoltsCalc.jointBolt1),
      jointBolt1Quantity: toNum(additionalBoltsCalc.jointBolt1Quantity),
      jointBolt2: toStr(additionalBoltsCalc.jointBolt2),
      jointBolt2Quantity: toNum(additionalBoltsCalc.jointBolt2Quantity),
      jointBolt3: toStr(additionalBoltsCalc.jointBolt3),
      jointBolt3Quantity: toNum(additionalBoltsCalc.jointBolt3Quantity),
      purlinBolt: toStr(additionalBoltsCalc.purlinBolt),
      purlinBoltQuantity: toNum(additionalBoltsCalc.purlinBoltQuantity),
      anchorBoltQuantity: toNum(additionalBoltsCalc.anchorBoltQuantity),
      foundationBoltQuantity: toNum(additionalBoltsCalc.foundationBoltQuantity),
    },
  }
}
