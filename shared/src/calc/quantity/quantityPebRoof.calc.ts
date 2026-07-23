import { z } from 'zod'
import { quantityPebRoofSchema } from '../../schemas/quantity.schema'

export interface QuantityPebRoofInput {
  roof: {
    buildingOverallLength: number
    buildingOverallWidth: number
    roofSlope: number
    materialConsumptionExcludingPurlin: number
    mainRoofFrames: number
    endRoofFrames: number
    roofPurlinSpacing: number
    roofPurlinUnitWeight: number
    roofExtensionWidthHeight: number
    roofExtensionEndFrameCount: number
    roofExtensionMidFrameCount: number
    roofAreaDeduction: number
    polycarbonateRoofLength: number
    polycarbonateRoofWidth: number
    polycarbonateRoofCount: number
    gradeOfPlateMaterial: string
    roofPurlinType: string
    roofPurlinDepth: number
    roofCoveringThickness: number
    roofCoveringType: string
    roofWindBracingSegmentsInOneHalf: number
    roofWindBracingProvidedBays: number
    roofWindBracingLength: number
    windBracingUnitWeight: number
    diaOfRoofSagRod: number
    roofFlangeBraceAverageLength: number
    endFrameFlangeBraceAverageLength: number
  }
  joint: {
    purlinFlangeBraceBoltDiameter: number
    purlinFlangeBraceNumberOfBolts: number
  }
  jointBoltRoof: {
    A?: { numberOfBolts: number }
  }
  foundationBoltRoof: {
    boltDiameter11: number
  }
}

export function calculateQuantityPebRoof(input: QuantityPebRoofInput): z.infer<typeof quantityPebRoofSchema> {
  const { roof, joint, jointBoltRoof, foundationBoltRoof } = input
  const slopeRad = (roof.roofSlope * Math.PI) / 180
  const cosSlope = Math.cos(slopeRad)

  // Common reused terms
  const inclinedLengthInOneHalf = roof.buildingOverallWidth / cosSlope / 2 + 0.14
  const roofArea = roof.buildingOverallLength * inclinedLengthInOneHalf * 2 * 10.76
  const totalNoOfPurlinBay = roof.mainRoofFrames + roof.endRoofFrames - 1
  const lengthOfOnePurlin = (roof.buildingOverallLength / totalNoOfPurlinBay) + 0.4
  const noOfPurlinsInOneFrame = (inclinedLengthInOneHalf / roof.roofPurlinSpacing + 1) * 2
  const noOfExtendedFrame = roof.roofExtensionWidthHeight / cosSlope / roof.roofPurlinSpacing
  const noOfExtendedPurlinBay = roof.roofExtensionEndFrameCount + roof.roofExtensionMidFrameCount - 1
  const polyCarbonateAreaDeductions = roof.polycarbonateRoofLength * roof.polycarbonateRoofWidth * roof.polycarbonateRoofCount
  const extendedRoofWidth = roof.roofExtensionWidthHeight / cosSlope
  const extendedRoofLength = (roof.buildingOverallLength / totalNoOfPurlinBay) * noOfExtendedPurlinBay
  
  // Section: raftersAndColumns
  const raftersAndColumnsQuantity = roofArea * roof.materialConsumptionExcludingPurlin

  // Section: roofPurlins
  const roofPurlinsQuantity = 
    lengthOfOnePurlin * noOfPurlinsInOneFrame * totalNoOfPurlinBay * roof.roofPurlinUnitWeight + 
    lengthOfOnePurlin * roof.roofPurlinUnitWeight * noOfExtendedFrame * noOfExtendedPurlinBay

  // Section: roofSheet
  const roofSheetQuantity = roofArea / 10.76 + extendedRoofWidth * extendedRoofLength - roof.roofAreaDeduction - polyCarbonateAreaDeductions
  const roofSheetPurchaseQuantity = roofSheetQuantity * 1.1

  // Section: pebRoof (root value)
  const pebRoofQuantity = (raftersAndColumnsQuantity + roofPurlinsQuantity) / (roofSheetQuantity * 10.76)

  // Section: roofWindBracing
  const totalNumberOfWindBracing = roof.roofWindBracingSegmentsInOneHalf * 2 * 2 * roof.roofWindBracingProvidedBays
  const segW = (roof.buildingOverallWidth / 2 / cosSlope / roof.roofWindBracingSegmentsInOneHalf)
  const segL = roof.buildingOverallLength / totalNoOfPurlinBay
  const roofWindBracing = Math.sqrt(segW * segW + segL * segL) * totalNumberOfWindBracing * roof.windBracingUnitWeight

  // Section: roofSagRoad
  const noOfSagRodInASingleFrame = (inclinedLengthInOneHalf / roof.roofPurlinSpacing) * 2
  const noOfSagRodInExtendedFrame = (roof.roofExtensionWidthHeight / cosSlope / roof.roofPurlinSpacing) - 1
  const noOfExtendedSagRodBay = Math.max(noOfExtendedPurlinBay, 0)
  const unitWeightOfSagRod = roof.diaOfRoofSagRod * roof.diaOfRoofSagRod / 162
  const roofSagRoadQuantity = (noOfSagRodInASingleFrame * totalNoOfPurlinBay + noOfSagRodInExtendedFrame * noOfExtendedSagRodBay) * unitWeightOfSagRod

  // Section: roofFlangeBrace
  const flBraceFactor = inclinedLengthInOneHalf / roof.roofPurlinSpacing + 1
  const noOfFlngBraceInExtendedFrame2 = roof.roofExtensionWidthHeight / cosSlope / roof.roofPurlinSpacing
  const roofFlangeBraceQuantity = (
    roof.roofFlangeBraceAverageLength * flBraceFactor * 4 * roof.mainRoofFrames +
    roof.endFrameFlangeBraceAverageLength * flBraceFactor * 2 * roof.endRoofFrames +
    roof.roofFlangeBraceAverageLength * noOfFlngBraceInExtendedFrame2 * 2 * roof.roofExtensionMidFrameCount +
    roof.roofFlangeBraceAverageLength * noOfFlngBraceInExtendedFrame2 * roof.roofExtensionEndFrameCount
  ) * 1.57

  // Section: bolts
  const noOfPurlinJointInSingleFrame = flBraceFactor * 2
  const totalnoOfFrames = roof.mainRoofFrames + roof.endRoofFrames
  const noOfPurlinnodeInExtendedFrame = noOfFlngBraceInExtendedFrame2
  const noOfExtendedFrames = roof.roofExtensionMidFrameCount + roof.roofExtensionEndFrameCount
  const numberOfPurlinBoltsQuantity = (
    noOfPurlinJointInSingleFrame * totalnoOfFrames * joint.purlinFlangeBraceNumberOfBolts +
    noOfPurlinnodeInExtendedFrame * noOfExtendedFrames * joint.purlinFlangeBraceNumberOfBolts
  )

  return {
    pebRoofValue: "ROOF!AY28",
    pebRoofQuantity,
    raftersAndColumns: roof.gradeOfPlateMaterial,
    raftersAndColumnsQuantity,
    lengthOfBuilding: roof.buildingOverallLength,
    lengthOfBuildingQuantity: "User Input",
    inclinedLengthInOneHalf,
    roofArea,
    materialConsumption: roof.materialConsumptionExcludingPurlin,
    
    roofPurlinsValue: noOfExtendedPurlinBay,
    roofPurlins: `${roof.roofPurlinType} PURLIN ${roof.roofPurlinDepth} MM DEPTH`,
    roofPurlinsQuantity,
    lengthOfOnePurlin,
    lengthOfOnePurlinQuantity: "User Input",
    noOfPurlinsInOneFrame,
    totalNoOfPurlinBay,
    unitWeightOfPurlin: roof.roofPurlinUnitWeight,
    noOfExtendedFrame,
    noOfExtendedPurlinBay,
    
    roofSheet: `${roof.roofCoveringThickness}MM THICK ${roof.roofCoveringType}`,
    roofSheetQuantity,
    roofSheetPurchaseQuantity,
    extendedRoofWidth,
    extendedRoofLength,
    roofAreaDeductions: roof.roofAreaDeduction,
    polyCarbonateAreaDeductions,
    
    polyCarbonateSheetQuantity: polyCarbonateAreaDeductions,
    polyCarbonateSheetPurchaseQuantity: 0,
    lengthOfpolyCarbonateSheet: roof.polycarbonateRoofLength,
    lengthOfpolyCarbonateSheetAdditional: "User Input",
    widthOfpolyCarbonateSheet: roof.polycarbonateRoofWidth,
    NosOfpolyCarbonateSheet: roof.polycarbonateRoofCount,
    
    roofWindBracing,
    lengthOfSinlgeWindBracing: roof.roofWindBracingLength,
    lengthOfSinlgeWindBracingAdditional: "User Input",
    totalNumberOfWindBracing,
    unitWeightOfRoofWindBracing: roof.windBracingUnitWeight,
    
    roofSagRoadValue: noOfSagRodInExtendedFrame,
    roofSagRoadQuantity,
    lengthOfSingleSagRoad: roof.roofPurlinSpacing + 0.2,
    lengthOfSingleSagRoadAdditional: "User Input",
    noOfSagRodInASingleFrame,
    noOfBayInSagRodProvided: totalNoOfPurlinBay,
    noOfSagRodInExtendedFrame,
    noOfExtendedSagRodBay,
    unitWeightOfSagRod,
    
    roofFlangeBraceQuantity,
    lengthOfMidFrameFlangeBrace: roof.roofFlangeBraceAverageLength,
    lengthOfMidFrameFlangeBraceAdditional: "User Input",
    noOfFlangeBraceInMidFrame: flBraceFactor * 4,
    noOfFlangeBraceInEndFrame: flBraceFactor * 2,
    noOfMidFrame: roof.mainRoofFrames,
    noOfEndFrame: roof.endRoofFrames,
    noOfFlngBraceInExtendedFrame: noOfFlngBraceInExtendedFrame2 * 2,
    noOfExtendedMidFrame: roof.roofExtensionMidFrameCount,
    noOfExtendedEndFrame: roof.roofExtensionEndFrameCount,
    lengthOfEndFrameFlangeBrace: roof.endFrameFlangeBraceAverageLength,
    
    numberOfPurlinBolts: `${joint.purlinFlangeBraceBoltDiameter} MM DIA ORDINARY BOLTS`,
    numberOfPurlinBoltsQuantity,
    noOfPurlinJointInSingleFrame,
    totalnoOfFrames,
    noOfPurlinnodeInExtendedFrame,
    noOfExtendedFrames,
    noOfBoltsInSinglePurlinJoint: joint.purlinFlangeBraceNumberOfBolts,
    
    numberOfRoofJointBolts: `${jointBoltRoof.A?.numberOfBolts ?? 0} MM DIA HSFG BOLTS`,
    numberOfFoundationBolts: `${foundationBoltRoof.boltDiameter11} MM DIA FOUNDATION BOLTS`,
    numberOfAnchorBolts: `${foundationBoltRoof.boltDiameter11} MM DIA ANCHOR BOLTS`,
  }
}
