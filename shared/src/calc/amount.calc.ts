/**
 * Amount (bill-of-quantities) business-math. Authoritative implementations
 * used by the backend on write; the frontend may reuse them for live preview
 * only (never trusted server-side).
 *
 * Each `qtyN*` function is a faithful translation of the Excel `AMOUNT!Nx`
 * equation for one canonical line item — see
 * docs/AMOUNT_QUANTITY_IMPLEMENTATION_PROMPT.md and amount.md for the full spec.
 * Blank inputs are treated as 0, matching Excel's blank-cell behaviour.
 */

/** Coerce a possibly-undefined field to a number, treating blanks as 0. */
const n = (v?: number): number => v ?? 0

/** Helper for division guarded against divide-by-zero. */
const safeDiv = (num: number, den: number): number => (den === 0 ? 0 : num / den)

/** Complete input parameters required across all 36 AMOUNT quantity equations. */
export interface AmountCalcInput {
  // Roof fields
  buildingOverallLength?: number
  buildingOverallWidth?: number
  roofSlope?: number
  materialConsumptionExcludingPurlin?: number
  mainRoofFrames?: number
  endRoofFrames?: number
  roofWindBracingSegmentsInOneHalf?: number
  roofWindBracingProvidedBays?: number
  windBracingUnitWeight?: number
  columnWindBracingSegments?: number
  columnWindBracingProvidedBays?: number
  windBracingColumnHeight?: number
  roofPurlinSpacing?: number
  roofExtensionWidthHeight?: number
  roofExtensionEndFrameCount?: number
  roofExtensionMidFrameCount?: number
  diaOfRoofSagRod?: number
  eaveHeight?: number
  claddingExtensionWidthHeight?: number
  frontCladdingOpeningArea?: number
  backCladdingOpeningArea?: number
  rightCladdingOpeningArea?: number
  leftCladdingOpeningArea?: number
  fasciaBoardArea?: number
  claddingPurlins?: number
  internalColumnsForEndRoofFrames?: number
  diaOfCladdingSagRod?: number
  roofFlangeBraceAverageLength?: number
  endFrameFlangeBraceAverageLength?: number
  claddingFlangeBraceAverageLength?: number
  roofPurlinUnitWeight?: number
  claddingPurlinUnitWeight?: number
  roofAreaDeduction?: number
  polycarbonateRoofLength?: number
  polycarbonateRoofWidth?: number
  polycarbonateRoofCount?: number
  raftersInOneHalfOfMainFrame?: number
  raftersInOneHalfOfEndFrame?: number
  fasciaMaterialWeightPerSqft?: number

  // Sidewall Heights
  sidewallFrontHeight?: number
  sidewallBackHeight?: number
  sidewallLeftHeight?: number
  sidewallRightHeight?: number

  // QuantityPebRoof fields
  pebLengthOfBuildingQuantity?: number
  pebLengthOfSinlgeWindBracingAdditional?: number
  pebLengthOfSingleSagRoadAdditional?: number
  pebLengthOfMidFrameFlangeBraceAdditional?: number
  pebLengthOfOnePurlinQuantity?: number
  pebExtendedRoofWidthAdditonal?: number
  pebLengthOfpolyCarbonateSheetAdditional?: number

  // QuantityCladding fields
  claddingColumnWindBracingsAdditional?: number
  claddingSagRodAdditional?: number
  claddingFlangeBraceAdditional?: number
  claddingEaveHeightFrontAdditional?: number
  claddingSheetAdditional?: number
  claddingNumberOfCladdingPurlinBoltsAdditional?: number

  // QuantityMezzanine fields
  mezzanineTotalMezzanineAreaQuantity?: number
  mezzanineConcreteFlashingAdditional?: number
  mezzanineDeckSheetQuantityAdditional?: number
  mezzanineShearStudsQuantityAdditional?: number
  mezzanineMaterialConsumptionKgPerSqft?: number

  // QuantityStair fields
  stairTotalWeightofStringerBeamsAdditional?: number
  stairTotalWeightofStepsAdditional?: number

  // QuantityAdditionalBolts fields
  additionalPurlinBoltQuantity?: number
  additionalJointBolt1Quantity?: number
  additionalJointBolt2Quantity?: number
  additionalJointBolt3Quantity?: number
  additionalFoundationBoltQuantity?: number
  additionalAnchorBoltQuantity?: number

  // CanopyItem fields
  canopy0Length?: number
  canopy0Width?: number
  canopy0MaterialConsumptionKgPerSqft?: number
  canopy0NumberOfPurlins?: number
  canopy0NumberOfBeams?: number
  canopy0Height?: number
  canopy0CanopySideCoveringHeight?: number

  // MezzanineFloor fields (MEZ_1)
  mez0LengthM?: number
  mez0WidthM?: number
  mez0BeamsMidPrimary?: number
  mez0JointsMidPrimary?: number
  mez0BeamsEndPrimary?: number
  mez0JointsEndPrimary?: number
  mez0InternalColumnsMidPrimary?: number
  mez0InternalColumnsEndPrimary?: number
  mez0BeamsSecondary?: number

  /** Backward-compatibility alias for mezExt0LengthM */
  mez1LengthM?: number
  /** Backward-compatibility alias for mezExt0WidthM */
  mez1WidthM?: number

  // MezzanineFloorExt fields (EXT_1)
  mezExt0LengthM?: number
  mezExt0WidthM?: number
  mezExt0BeamsMidPrimary?: number
  mezExt0JointsMidPrimary?: number
  mezExt0BeamsEndPrimary?: number
  mezExt0JointsEndPrimary?: number
  mezExt0ExtendedColumnsMidPrimary?: number
  mezExt0ExtendedColumnsEndPrimary?: number
  mezExt0BeamsSecondary?: number

  // AreaDeduction
  areaDeduction0AreaM2?: number
  areaDeduction0Numbers?: number

  // StairItem fields (STAIR_1)
  stair0Length?: number
  stair0Width?: number
  stair0Height?: number
  stair0NumberOfMidLanding?: number
  stair0UnitWeightOfStringer?: number

  // BoltType fields
  boltTypePurlinFlangeBraceNumberOfBolts?: number
  boltTypeCladdingPurlinsNumberOfBolts?: number
  boltTypeCanopyNumberOfBolts?: number
  boltTypeSecondaryBeamsNumberOfBolts?: number

  // JointBoltRoof fields
  jointHNumberOfBolts?: number
  jointLNumberOfBolts?: number
  jointH1NumberOfBolts?: number
  jointINumberOfBolts?: number
  jointI1NumberOfBolts?: number
  jointBNumberOfBolts?: number
  jointB1NumberOfBolts?: number
  jointB2NumberOfBolts?: number
  jointANumberOfBolts?: number
  jointA1NumberOfBolts?: number
  jointCNumberOfBolts?: number
  jointC1NumberOfBolts?: number
  jointMNumberOfBolts?: number
  jointONumberOfBolts?: number

  // FoundationBoltRoof fields
  foundationFB4NumberOfBolts?: number
  foundationFB5NumberOfBolts?: number
  foundationFB6NumberOfBolts?: number

  // Accessories fields
  ridgeQuantityManual?: number
  gutterQuantityManual?: number
  downTakeQuantityManual?: number
  dripTrimQuantityManual?: number
  gableEndFlashingQuantityManual?: number
  cornerFlashQuantityManual?: number
  rollingShutterLength?: number
  rollingShutterWidth?: number
  rollingShutterNos?: number
  louverLength?: number
  louverWidth?: number
  louverNos?: number
  skyLightLength?: number
  skyLightWidth?: number
  skyLightNos?: number
  wallLightLength?: number
  wallLightWidth?: number
  wallLightNos?: number
  turboVentilatorNos?: number
  handrailWeightKg?: number
  doorHeight?: number
  doorWidth?: number
  doorNos?: number
  windowHeight?: number
  windowWidth?: number
  windowNos?: number
  partitionQuantityX11?: number
  partitionQuantity?: number
}

/** Backward-compatible interface for STEEL STRUCTURES quantity input. */
export type SteelStructuresInput = AmountCalcInput

/**
 * Calculates wall area before deductions across all sidewalls and gables.
 */
export function calcWallArea(input: AmountCalcInput): number {
  const eaveH = n(input.eaveHeight)
  const frontH = n(input.sidewallFrontHeight)
  const backH = n(input.sidewallBackHeight)
  const leftH = n(input.sidewallLeftHeight)
  const rightH = n(input.sidewallRightHeight)
  const W = n(input.buildingOverallWidth)
  const L = n(input.buildingOverallLength)
  const slopeRad = (n(input.roofSlope) * Math.PI) / 180
  const tanSlope = Math.tan(slopeRad)
  const cladExtWH = n(input.claddingExtensionWidthHeight)

  const frontTerm = ((eaveH - frontH + (W / 2) * tanSlope + eaveH - frontH) / 2) * W
  const leftExtTerm1 = ((eaveH - leftH + eaveH - cladExtWH * tanSlope - leftH) / 2) * cladExtWH
  const backTerm = ((eaveH - backH + (W / 2) * tanSlope + eaveH - backH) / 2) * W
  const leftExtTerm2 = ((eaveH - leftH + eaveH - cladExtWH * tanSlope - leftH) / 2) * cladExtWH
  const leftLengthTerm = (eaveH - leftH) * L
  const rightLengthTerm = (eaveH - rightH) * L

  return frontTerm + leftExtTerm1 + backTerm + leftExtTerm2 + leftLengthTerm + rightLengthTerm
}

/**
 * Calculates net wall area after subtracting opening and fascia deductions.
 */
export function calcNetWallArea(input: AmountCalcInput): number {
  const wallArea = calcWallArea(input)
  const deductions =
    n(input.frontCladdingOpeningArea) +
    n(input.backCladdingOpeningArea) +
    n(input.rightCladdingOpeningArea) +
    n(input.leftCladdingOpeningArea) +
    n(input.fasciaBoardArea)
  return wallArea - deductions
}

/** Derives STEEL STRUCTURES quantity (AMOUNT!N5, unit KG). */
export function qtyN5SteelStructures(input: AmountCalcInput): number {
  const L = n(input.buildingOverallLength)
  const W = n(input.buildingOverallWidth)
  const mcPurlin = n(input.materialConsumptionExcludingPurlin)
  const cosS = Math.cos((n(input.roofSlope) * Math.PI) / 180)
  const roofTerm = L * (safeDiv(W, cosS) / 2 + 0.14) * 2 * 10.76 * mcPurlin + n(input.pebLengthOfBuildingQuantity)

  const canopyTerm =
    n(input.canopy0Length) * n(input.canopy0Width) * n(input.canopy0MaterialConsumptionKgPerSqft) * 10.76

  const mez0L = n(input.mez0LengthM)
  const mez0W = n(input.mez0WidthM)
  const mezExt0L = n(input.mezExt0LengthM) || n(input.mez1LengthM)
  const mezExt0W = n(input.mezExt0WidthM) || n(input.mez1WidthM)
  const stair0L = n(input.stair0Length)
  const stair0W = n(input.stair0Width)
  const mezMc = n(input.mezzanineMaterialConsumptionKgPerSqft)

  const mezzTerm =
    (mez0L * mez0W -
      n(input.areaDeduction0AreaM2) * n(input.areaDeduction0Numbers) -
      stair0L * stair0W +
      mezExt0L * mezExt0W) *
      mezMc *
      10.76 +
    n(input.mezzanineTotalMezzanineAreaQuantity)

  const stair0H = n(input.stair0Height)
  const nml = n(input.stair0NumberOfMidLanding)
  const landingRun = safeDiv(stair0H, nml + 1)
  const landingRun2 = stair0L - 2
  const stairStringerTerm =
    (Math.sqrt(landingRun * landingRun + landingRun2 * landingRun2) + 2 + nml) *
      (2 + nml * 2) *
      n(input.stair0UnitWeightOfStringer) +
    n(input.stairTotalWeightofStringerBeamsAdditional)

  const stairStepTerm =
    safeDiv(stair0H, 0.15) * (stair0W / 2) * 0.006 * 0.45 * 7850 + n(input.stairTotalWeightofStepsAdditional)

  return roofTerm + canopyTerm + mezzTerm + stairStringerTerm + stairStepTerm
}

/** Derives WIND BRACINGS quantity (AMOUNT!N6, unit KG). */
export function qtyN6WindBracings(input: AmountCalcInput): number {
  const W = n(input.buildingOverallWidth)
  const L = n(input.buildingOverallLength)
  const cosS = Math.cos((n(input.roofSlope) * Math.PI) / 180)
  const segHalf = n(input.roofWindBracingSegmentsInOneHalf)
  const mainFrames = n(input.mainRoofFrames)
  const endFrames = n(input.endRoofFrames)
  const bayCount = mainFrames + endFrames - 1
  const bayLength = safeDiv(L, bayCount)
  const roofBays = n(input.roofWindBracingProvidedBays)
  const unitW = n(input.windBracingUnitWeight)

  const halfWidthPurlin = safeDiv(safeDiv(W / 2, cosS), segHalf)
  const roofTerm =
    Math.sqrt(halfWidthPurlin ** 2 + bayLength * bayLength) *
    segHalf *
    2 *
    2 *
    roofBays *
    unitW

  const colSeg = n(input.columnWindBracingSegments)
  const colBays = n(input.columnWindBracingProvidedBays)
  const colHeight = n(input.windBracingColumnHeight)
  const colSegHeight = safeDiv(colHeight, colSeg)
  const colTerm =
    colSeg *
    2 *
    2 *
    colBays *
    Math.sqrt(colSegHeight ** 2 + bayLength * bayLength) *
    unitW

  const totalWeight =
    n(input.pebLengthOfSinlgeWindBracingAdditional) +
    roofTerm +
    n(input.claddingColumnWindBracingsAdditional) +
    colTerm

  return safeDiv(totalWeight, unitW)
}

/** Derives SAG ROD quantity (AMOUNT!N7, unit KG). */
export function qtyN7SagRod(input: AmountCalcInput): number {
  const W = n(input.buildingOverallWidth)
  const cosS = Math.cos((n(input.roofSlope) * Math.PI) / 180)
  const purlinSpacing = n(input.roofPurlinSpacing)
  const mainFrames = n(input.mainRoofFrames)
  const endFrames = n(input.endRoofFrames)
  const extWH = n(input.roofExtensionWidthHeight)
  const extEndCount = n(input.roofExtensionEndFrameCount)
  const extMidCount = n(input.roofExtensionMidFrameCount)
  const diaRoofSagRod = n(input.diaOfRoofSagRod)

  const purlinTerm1 = safeDiv(safeDiv(W, cosS) / 2 + 0.14, purlinSpacing) * 2 * (mainFrames + endFrames - 1)
  const purlinTerm2 = (safeDiv(safeDiv(extWH, cosS), purlinSpacing) - 1) * (extEndCount + extMidCount - 1)
  const termA = (purlinTerm1 + purlinTerm2) * ((diaRoofSagRod * diaRoofSagRod) / 162)

  const cladPurlins = n(input.claddingPurlins)
  const internalCols = n(input.internalColumnsForEndRoofFrames)
  const cladSagRodDia = n(input.diaOfCladdingSagRod)

  const wallArea = calcWallArea(input)
  const netWallArea = calcNetWallArea(input)

  const purlinCountTerm = cladPurlins * (mainFrames + endFrames - 1) * 2 + (cladPurlins + 1) * (internalCols + 1) * 2 + (cladPurlins + 1) * 1 * 2
  const termB = netWallArea * 10.76 * purlinCountTerm * 1.7 * ((cladSagRodDia * cladSagRodDia) / 162)
  const termBNormalized = safeDiv(termB, wallArea * 10.76)

  const totalNumerator = termA + n(input.pebLengthOfSingleSagRoadAdditional) + n(input.claddingSagRodAdditional) + termBNormalized
  const denominator = (diaRoofSagRod * diaRoofSagRod) / 162

  return safeDiv(totalNumerator, denominator)
}

/** Derives FLANGE BRACE quantity (AMOUNT!N8, unit KG). */
export function qtyN8FlangeBrace(input: AmountCalcInput): number {
  const W = n(input.buildingOverallWidth)
  const cosS = Math.cos((n(input.roofSlope) * Math.PI) / 180)
  const purlinSpacing = n(input.roofPurlinSpacing)
  const mainFrames = n(input.mainRoofFrames)
  const endFrames = n(input.endRoofFrames)
  const roofFlangeAvgL = n(input.roofFlangeBraceAverageLength)
  const endFrameFlangeAvgL = n(input.endFrameFlangeBraceAverageLength)
  const extWH = n(input.roofExtensionWidthHeight)
  const extMidCount = n(input.roofExtensionMidFrameCount)
  const extEndCount = n(input.roofExtensionEndFrameCount)

  const purlinRows = safeDiv(safeDiv(W, cosS) / 2 + 0.14, purlinSpacing) + 1
  const t1 = roofFlangeAvgL * purlinRows * 4 * mainFrames
  const t2 = endFrameFlangeAvgL * purlinRows * 2 * endFrames
  const extPurlinRows = safeDiv(safeDiv(extWH, cosS), purlinSpacing)
  const t3 = roofFlangeAvgL * extPurlinRows * 2 * extMidCount
  const t4 = roofFlangeAvgL * extPurlinRows * extEndCount
  const roofTotal = (t1 + t2 + t3 + t4) * 1.57

  const cladPurlins = n(input.claddingPurlins)
  const internalCols = n(input.internalColumnsForEndRoofFrames)
  const cladFlangeAvgL = n(input.claddingFlangeBraceAverageLength)
  const cladTotal = ((mainFrames + endFrames) * cladPurlins * 2 + (internalCols + 2) * (cladPurlins + 1) * 2 + cladPurlins * 1 * 2) * cladFlangeAvgL * 1.57 * 2

  return roofTotal + n(input.pebLengthOfMidFrameFlangeBraceAdditional) + n(input.claddingFlangeBraceAdditional) + cladTotal
}

/** Derives Z/C PURLINS quantity (AMOUNT!N9, unit KG). */
export function qtyN9ZCPurlins(input: AmountCalcInput): number {
  const L = n(input.buildingOverallLength)
  const W = n(input.buildingOverallWidth)
  const cosS = Math.cos((n(input.roofSlope) * Math.PI) / 180)
  const mainFrames = n(input.mainRoofFrames)
  const endFrames = n(input.endRoofFrames)
  const bayCount = mainFrames + endFrames - 1
  const bayLengthPlusMargin = safeDiv(L, bayCount) + 0.4
  const purlinSpacing = n(input.roofPurlinSpacing)
  const purlinRows = safeDiv(safeDiv(W, cosS) / 2 + 0.14, purlinSpacing) + 1
  const roofPurlinUnitW = n(input.roofPurlinUnitWeight)
  const extWH = n(input.roofExtensionWidthHeight)
  const extEndCount = n(input.roofExtensionEndFrameCount)
  const extMidCount = n(input.roofExtensionMidFrameCount)

  const roofPurlinWeight = bayLengthPlusMargin * purlinRows * 2 * bayCount * roofPurlinUnitW
  const extPurlinWeight = bayLengthPlusMargin * roofPurlinUnitW * safeDiv(safeDiv(extWH, cosS), purlinSpacing) * (extEndCount + extMidCount - 1)

  const wallArea = calcWallArea(input)
  const netWallArea = calcNetWallArea(input)
  const cladPurlins = n(input.claddingPurlins)
  const cladExtWH = n(input.claddingExtensionWidthHeight)
  const cladPurlinUnitW = n(input.claddingPurlinUnitWeight)

  const cladLengthSum = L * cladPurlins * 2 + cladPurlins * W * 2 + cladExtWH * cladPurlins * 2 + 2 * W * 0.45
  const cladWeight = netWallArea * 10.76 * cladLengthSum * cladPurlinUnitW
  const cladNormalizedWeight = safeDiv(cladWeight, wallArea * 10.76)

  return roofPurlinWeight + extPurlinWeight + n(input.pebLengthOfOnePurlinQuantity) + cladNormalizedWeight + n(input.claddingEaveHeightFrontAdditional)
}

/** Derives ROOF SHEET quantity (AMOUNT!N10, unit SQM). */
export function qtyN10RoofSheet(input: AmountCalcInput): number {
  const L = n(input.buildingOverallLength)
  const W = n(input.buildingOverallWidth)
  const cosS = Math.cos((n(input.roofSlope) * Math.PI) / 180)
  const mainFrames = n(input.mainRoofFrames)
  const endFrames = n(input.endRoofFrames)
  const bayCount = mainFrames + endFrames - 1
  const extWH = n(input.roofExtensionWidthHeight)
  const extEndCount = n(input.roofExtensionEndFrameCount)
  const extMidCount = n(input.roofExtensionMidFrameCount)

  const mainArea = L * (safeDiv(W, cosS) / 2 + 0.14) * 2
  const extArea = safeDiv(extWH, cosS) * safeDiv(L, bayCount) * (extEndCount + extMidCount - 1)
  const deduction = n(input.roofAreaDeduction) + n(input.polycarbonateRoofLength) * n(input.polycarbonateRoofWidth) * n(input.polycarbonateRoofCount)

  const netArea = (mainArea + extArea - deduction) * 1.1
  return netArea + n(input.pebExtendedRoofWidthAdditonal)
}

/** Derives CLADDING SHEET quantity (AMOUNT!N11, unit SQM). */
export function qtyN11CladdingSheet(input: AmountCalcInput): number {
  const netWallArea = calcNetWallArea(input)
  return netWallArea * 1.1 + n(input.claddingSheetAdditional)
}

/** Derives CANOPY SHEET quantity (AMOUNT!N12, unit SQM). */
export function qtyN12CanopySheet(input: AmountCalcInput): number {
  return n(input.canopy0Length) * n(input.canopy0Width)
}

/** Derives PURLIN BOLTS quantity (AMOUNT!N13, unit NOS). */
export function qtyN13PurlinBolts(input: AmountCalcInput): number {
  const W = n(input.buildingOverallWidth)
  const cosS = Math.cos((n(input.roofSlope) * Math.PI) / 180)
  const purlinSpacing = n(input.roofPurlinSpacing)
  const mainFrames = n(input.mainRoofFrames)
  const endFrames = n(input.endRoofFrames)
  const purlinRows = safeDiv(safeDiv(W, cosS) / 2 + 0.14, purlinSpacing) + 1
  const purlinFlangeBraceBolts = n(input.boltTypePurlinFlangeBraceNumberOfBolts)

  const term1 = purlinRows * 2 * (mainFrames + endFrames) * purlinFlangeBraceBolts

  const extWH = n(input.roofExtensionWidthHeight)
  const extMidCount = n(input.roofExtensionMidFrameCount)
  const extEndCount = n(input.roofExtensionEndFrameCount)
  const extPurlinRows = safeDiv(safeDiv(extWH, cosS), purlinSpacing)
  const term2 = extPurlinRows * (extMidCount + extEndCount) * purlinFlangeBraceBolts

  const cladPurlins = n(input.claddingPurlins)
  const internalCols = n(input.internalColumnsForEndRoofFrames)
  const term3 = ((mainFrames + endFrames) * cladPurlins * 2 + (internalCols + 2) * (cladPurlins + 1) * 2 + cladPurlins * 1 * 2) * 4

  const canopyPurlins = n(input.canopy0NumberOfPurlins)
  const canopyBeams = n(input.canopy0NumberOfBeams)
  const cladPurlinsBolts = n(input.boltTypeCladdingPurlinsNumberOfBolts)
  const term4 = canopyPurlins * canopyBeams * cladPurlinsBolts

  return term1 + term2 + term3 + n(input.claddingNumberOfCladdingPurlinBoltsAdditional) + term4 + n(input.additionalPurlinBoltQuantity)
}

/**
 * Derives JOINT BOLTS quantity (AMOUNT!N14, unit NOS).
 * Note: Preserves faithful bug from Excel where mezzanine extension secondary beams term
 * uses canopyNumberOfBolts instead of secondaryBeamsNumberOfBolts.
 */
export function qtyN14JointBolts(input: AmountCalcInput): number {
  const extMidCount = n(input.roofExtensionMidFrameCount)
  const extEndCount = n(input.roofExtensionEndFrameCount)
  const mainFrames = n(input.mainRoofFrames)
  const endFrames = n(input.endRoofFrames)
  const internalCols = n(input.internalColumnsForEndRoofFrames)
  const mainRaftersHalf = n(input.raftersInOneHalfOfMainFrame)
  const endRaftersHalf = n(input.raftersInOneHalfOfEndFrame)

  const roofTerm =
    n(input.jointHNumberOfBolts) * extMidCount * 1 * 1 +
    n(input.jointLNumberOfBolts) * mainFrames * internalCols * 1 +
    n(input.jointH1NumberOfBolts) * extEndCount * 1 * 1 +
    n(input.jointINumberOfBolts) * extMidCount * 1 * 1 +
    n(input.jointI1NumberOfBolts) * extEndCount * 1 * 1 +
    n(input.jointBNumberOfBolts) * mainFrames * (mainRaftersHalf - 1) * 2 * 1 +
    n(input.jointB1NumberOfBolts) * mainFrames * (mainRaftersHalf - 1) * 2 * 1 +
    n(input.jointB2NumberOfBolts) * endFrames * (endRaftersHalf - 1) * 2 * 1 +
    n(input.jointANumberOfBolts) * mainFrames * 1 * 1 +
    n(input.jointA1NumberOfBolts) * endFrames * 1 * 1 +
    n(input.jointCNumberOfBolts) * mainFrames * 2 * 1 +
    n(input.jointC1NumberOfBolts) * endFrames * 2 * 1

  const canopyBeams = n(input.canopy0NumberOfBeams)
  const canopyBolts = n(input.boltTypeCanopyNumberOfBolts)
  const canopyTerm = canopyBeams * canopyBolts

  const mezMidPri = n(input.mez0BeamsMidPrimary)
  const mezJointsMidPri = n(input.mez0JointsMidPrimary)
  const mezEndPri = n(input.mez0BeamsEndPrimary)
  const mezJointsEndPri = n(input.mez0JointsEndPrimary)
  const mezColsMidPri = n(input.mez0InternalColumnsMidPrimary)
  const mezColsEndPri = n(input.mez0InternalColumnsEndPrimary)
  const mezMJointBolts = n(input.jointMNumberOfBolts)
  const mezOJointBolts = n(input.jointONumberOfBolts)
  const mezSecBeams = n(input.mez0BeamsSecondary)
  const secBeamsBolts = n(input.boltTypeSecondaryBeamsNumberOfBolts)

  const mez1Term =
    mezMidPri * mezJointsMidPri * mezMJointBolts +
    mezEndPri * mezJointsEndPri * mezMJointBolts +
    (mezMidPri + mezEndPri) * 2 * mezOJointBolts +
    mezMidPri * mezColsMidPri * mezOJointBolts +
    mezEndPri * mezColsEndPri * mezOJointBolts

  const mezExtMidPri = n(input.mezExt0BeamsMidPrimary)
  const mezExtJointsMidPri = n(input.mezExt0JointsMidPrimary)
  const mezExtEndPri = n(input.mezExt0BeamsEndPrimary)
  const mezExtJointsEndPri = n(input.mezExt0JointsEndPrimary)
  const mezExtColsMidPri = n(input.mezExt0ExtendedColumnsMidPrimary)
  const mezExtColsEndPri = n(input.mezExt0ExtendedColumnsEndPrimary)
  const mezExtSecBeams = n(input.mezExt0BeamsSecondary)

  const mez2Term =
    mezExtMidPri * mezExtJointsMidPri * mezMJointBolts +
    mezExtEndPri * mezExtJointsEndPri * mezMJointBolts +
    (mezExtMidPri + mezExtEndPri) * 2 * mezOJointBolts +
    mezExtMidPri * mezExtColsMidPri * mezOJointBolts +
    mezExtEndPri * mezExtColsEndPri * mezOJointBolts

  const secondaryBeamsTerm1 = (mezMidPri + mezEndPri - 1) * mezSecBeams * secBeamsBolts
  // Faithful bug preservation: uses canopyBolts instead of secBeamsBolts for extension secondary beams
  const secondaryBeamsTerm2 = (mezExtMidPri + mezExtEndPri - 1) * mezExtSecBeams * canopyBolts

  const additionalBolts =
    n(input.additionalJointBolt1Quantity) +
    n(input.additionalJointBolt2Quantity) +
    n(input.additionalJointBolt3Quantity)

  return (
    roofTerm +
    canopyTerm +
    mez1Term +
    mez2Term +
    secondaryBeamsTerm1 +
    secondaryBeamsTerm2 +
    additionalBolts
  )
}

/** Derives FOUNDATION BOLTS quantity (AMOUNT!N15, unit NOS). */
export function qtyN15FoundationBolts(input: AmountCalcInput): number {
  const fb4 = n(input.foundationFB4NumberOfBolts)
  const fb5 = n(input.foundationFB5NumberOfBolts)
  const fb6 = n(input.foundationFB6NumberOfBolts)
  const mainFrames = n(input.mainRoofFrames)
  const endFrames = n(input.endRoofFrames)
  const extMidCount = n(input.roofExtensionMidFrameCount)
  const extEndCount = n(input.roofExtensionEndFrameCount)
  const internalCols = n(input.internalColumnsForEndRoofFrames)

  const term1 = fb4 * mainFrames * 1 * 1
  const term2 = fb4 * endFrames * 2 * 1
  const term3 = fb5 * (extMidCount + extEndCount) * 1 * 1
  const term4 = fb6 * mainFrames * internalCols * 1
  const term5 = fb6 * endFrames * internalCols * 1

  return term1 + term2 + term3 + term4 + term5 + n(input.additionalFoundationBoltQuantity)
}

/** Derives ANCHOR BOLTS quantity (AMOUNT!N16, unit NOS). */
export function qtyN16AnchorBolts(input: AmountCalcInput): number {
  return n(input.additionalAnchorBoltQuantity)
}

/** Derives RIDGE quantity (AMOUNT!N17, unit RM). */
export function qtyN17Ridge(input: AmountCalcInput): number {
  return n(input.buildingOverallLength) + n(input.ridgeQuantityManual)
}

/** Derives GUTTER quantity (AMOUNT!N18, unit RM). */
export function qtyN18Gutter(input: AmountCalcInput): number {
  return n(input.buildingOverallLength) * 2 + n(input.gutterQuantityManual) + n(input.canopy0Length)
}

/** Derives DOWNTAKE quantity (AMOUNT!N19, unit RM). */
export function qtyN19Downtake(input: AmountCalcInput): number {
  const mainFrames = n(input.mainRoofFrames)
  const endFrames = n(input.endRoofFrames)
  const eaveH = n(input.eaveHeight)
  const canopyBeams = n(input.canopy0NumberOfBeams)
  const canopyH = n(input.canopy0Height)

  return (mainFrames + endFrames) * eaveH + n(input.downTakeQuantityManual) + canopyBeams * canopyH
}

/** Derives DRIP TRIM quantity (AMOUNT!N20, unit RM). */
export function qtyN20DripTrim(input: AmountCalcInput): number {
  return n(input.buildingOverallLength) * 2 + n(input.buildingOverallWidth) * 2 + n(input.dripTrimQuantityManual)
}

/** Derives FLASHING quantity (AMOUNT!N21, unit RM). */
export function qtyN21Flashing(input: AmountCalcInput): number {
  const canopyL = n(input.canopy0Length)
  const canopyW = n(input.canopy0Width)
  const W = n(input.buildingOverallWidth)
  const cosS = Math.cos((n(input.roofSlope) * Math.PI) / 180)
  const extWH = n(input.roofExtensionWidthHeight)
  const eaveH = n(input.eaveHeight)
  const frontH = n(input.sidewallFrontHeight)
  const backH = n(input.sidewallBackHeight)
  const leftH = n(input.sidewallLeftHeight)
  const cladExtWH = n(input.claddingExtensionWidthHeight)
  const tanS = Math.tan((n(input.roofSlope) * Math.PI) / 180)

  const t1 = canopyW * 2 + canopyL
  const t2 = (safeDiv(W, cosS) + 0.14) * 2
  const t3 = (safeDiv(extWH, cosS) + 0.14) * 2
  const t4 = n(input.gableEndFlashingQuantityManual)
  const t5 = eaveH - frontH + eaveH - cladExtWH * tanS - leftH + eaveH - backH + eaveH - cladExtWH * tanS - leftH
  const t6 = n(input.cornerFlashQuantityManual)
  const t7 = (n(input.mez0LengthM) + n(input.mez0WidthM)) * 2
  const t8 = (n(input.mezExt0LengthM) || n(input.mez1LengthM) || 0 + n(input.mezExt0WidthM) || n(input.mez1WidthM) || 0) * 2
  const t9 = n(input.mezzanineConcreteFlashingAdditional)

  return t1 + t2 + t3 + t4 + t5 + t6 + t7 + t8 + t9
}

/** Derives ROLLING SHUTTER quantity (AMOUNT!N22, unit SQM). */
export function qtyN22RollingShutter(input: AmountCalcInput): number {
  return n(input.rollingShutterLength) * n(input.rollingShutterWidth) * n(input.rollingShutterNos)
}

/** Derives LOUVERS quantity (AMOUNT!N23, unit SQM). */
export function qtyN23Louvers(input: AmountCalcInput): number {
  return n(input.louverLength) * n(input.louverWidth) * n(input.louverNos)
}

/** Derives SKY LIGHT quantity (AMOUNT!N24, unit SQM). */
export function qtyN24SkyLight(input: AmountCalcInput): number {
  return n(input.skyLightLength) * n(input.skyLightWidth) * n(input.skyLightNos)
}

/** Derives WALL LIGHT quantity (AMOUNT!N25, unit SQM). */
export function qtyN25WallLight(input: AmountCalcInput): number {
  return n(input.wallLightLength) * n(input.wallLightWidth) * n(input.wallLightNos)
}

/** Derives ROOF INSULATION quantity (AMOUNT!N26, unit SQM). */
export function qtyN26RoofInsulation(input: AmountCalcInput): number {
  return qtyN10RoofSheet(input)
}

/** Derives WALL INSULATION quantity (AMOUNT!N27, unit SQM). */
export function qtyN27WallInsulation(input: AmountCalcInput): number {
  return qtyN11CladdingSheet(input)
}

/** Derives TURBO VENTILATORS quantity (AMOUNT!N28, unit NOS). */
export function qtyN28TurboVentilators(input: AmountCalcInput): number {
  return n(input.turboVentilatorNos)
}

/** Derives DECKING SHEET quantity (AMOUNT!N29, unit SQM). */
export function qtyN29DeckingSheet(input: AmountCalcInput): number {
  const mez0L = n(input.mez0LengthM)
  const mez0W = n(input.mez0WidthM)
  const areaDed = n(input.areaDeduction0AreaM2) * n(input.areaDeduction0Numbers)
  const stairArea = n(input.stair0Length) * n(input.stair0Width)
  const mezExt0L = n(input.mezExt0LengthM) || n(input.mez1LengthM)
  const mezExt0W = n(input.mezExt0WidthM) || n(input.mez1WidthM)

  const netArea = (mez0L * mez0W - areaDed - stairArea + mezExt0L * mezExt0W) * 1.1
  return netArea + n(input.mezzanineDeckSheetQuantityAdditional)
}

/** Derives SHEAR STUDS quantity (AMOUNT!N30, unit NOS). */
export function qtyN30ShearStuds(input: AmountCalcInput): number {
  const mez0L = n(input.mez0LengthM)
  const mez0SecBeams = n(input.mez0BeamsSecondary)
  const mezExt0L = n(input.mezExt0LengthM) || n(input.mez1LengthM)
  const mezExt0SecBeams = n(input.mezExt0BeamsSecondary)

  const runLength = mez0L * mez0SecBeams + mezExt0L * mezExt0SecBeams
  return n(input.mezzanineShearStudsQuantityAdditional) + safeDiv(runLength, 0.4)
}

/** Derives POLY CARBONATE SHEET quantity (AMOUNT!N31, unit SQM). */
export function qtyN31PolyCarbonateSheet(input: AmountCalcInput): number {
  return n(input.pebLengthOfpolyCarbonateSheetAdditional)
}

/** Derives STAIR 1 quantity (AMOUNT!N32, unit KG). */
export function qtyN32Stair1(input: AmountCalcInput): number {
  const H = n(input.stair0Height)
  const nml = n(input.stair0NumberOfMidLanding)
  const L = n(input.stair0Length)
  const unitW = n(input.stair0UnitWeightOfStringer)

  const landingRun = safeDiv(H, nml + 1)
  const landingRun2 = L - 2
  const stringerLen = Math.sqrt(landingRun * landingRun + landingRun2 * landingRun2) + 2 + nml
  const factor = 2 + nml * 2

  return stringerLen * factor * unitW
}

/** Derives STAIR 2 quantity (AMOUNT!N33, unit KG). */
export function qtyN33Stair2(input: AmountCalcInput): number {
  const H = n(input.stair0Height)
  const W = n(input.stair0Width)
  return safeDiv(H, 0.15) * (W / 2) * 0.006 * 0.45 * 7850
}

/** Derives HANDRAIL quantity (AMOUNT!N34, unit KG). */
export function qtyN34Handrail(input: AmountCalcInput): number {
  return n(input.handrailWeightKg)
}

/** Derives CANOPY SIDE COVERING quantity (AMOUNT!N35, unit SQM). */
export function qtyN35CanopySideCovering(input: AmountCalcInput): number {
  const W = n(input.canopy0Width)
  const L = n(input.canopy0Length)
  const H = n(input.canopy0CanopySideCoveringHeight)
  return (W * 2 + L) * H
}

/** Derives DOORS quantity (AMOUNT!N36, unit SQM). */
export function qtyN36Doors(input: AmountCalcInput): number {
  return n(input.doorHeight) * n(input.doorWidth) * n(input.doorNos)
}

/** Derives WINDOWS quantity (AMOUNT!N37, unit SQM). */
export function qtyN37Windows(input: AmountCalcInput): number {
  const winH = input.windowHeight !== undefined ? input.windowHeight : input.doorHeight
  const winW = input.windowWidth !== undefined ? input.windowWidth : input.doorWidth
  const winNos = input.windowNos !== undefined ? input.windowNos : input.doorNos
  return n(winH) * n(winW) * n(winNos)
}

/** Derives FASCIA STRUCTURE quantity (AMOUNT!N38, unit KG). */
export function qtyN38FasciaStructure(input: AmountCalcInput): number {
  return n(input.fasciaBoardArea) * n(input.fasciaMaterialWeightPerSqft) * 10.76
}

/** Derives FASCIA COVERING SHEET BOARD quantity (AMOUNT!N39, unit SQM). */
export function qtyN39FasciaCoveringSheetBoard(input: AmountCalcInput): number {
  return n(input.fasciaBoardArea)
}

/** Derives INTERNAL PARTITIONS quantity (AMOUNT!N40, unit SQM). */
export function qtyN40InternalPartitions(input: AmountCalcInput): number {
  return n(input.partitionQuantity)
}

/** Shape of all 36 derived Amount line item quantities. */
export interface CalculatedAmountQuantities {
  steelStructuresQuantity: number
  windBracingsQuantity: number
  sagRodQuantity: number
  flangeBraceQuantity: number
  zCPurlinsQuantity: number
  roofSheetQuantity: number
  claddingSheetQuantity: number
  canopySheetQuantity: number
  purlinBoltsQuantity: number
  jointBoltsQuantity: number
  foundationBoltsQuantity: number
  anchorBoltsQuantity: number
  ridgeQuantity: number
  gutterQuantity: number
  downtakeQuantity: number
  dripTrimQuantity: number
  flashingQuantity: number
  rollingShutterQuantity: number
  louversQuantity: number
  skyLightQuantity: number
  wallLightQuantity: number
  roofInsulationQuantity: number
  wallInsulationQuantity: number
  turboVentilatorsQuantity: number
  deckingSheetQuantity: number
  shearStudsQuantity: number
  polyCarbonateSheetQuantity: number
  stair1Quantity: number
  stair2Quantity: number
  handrailQuantity: number
  canopySideCoveringQuantity: number
  doorsQuantity: number
  windowsQuantity: number
  fasciaStructureQuantity: number
  fasciaCoveringSheetBoardQuantity: number
  internalPartitionsQuantity: number
}

/**
 * Computes all 36 line-item quantities for an Amount record.
 */
export function calculateAmountQuantities(input: AmountCalcInput): CalculatedAmountQuantities {
  return {
    steelStructuresQuantity: qtyN5SteelStructures(input),
    windBracingsQuantity: qtyN6WindBracings(input),
    sagRodQuantity: qtyN7SagRod(input),
    flangeBraceQuantity: qtyN8FlangeBrace(input),
    zCPurlinsQuantity: qtyN9ZCPurlins(input),
    roofSheetQuantity: qtyN10RoofSheet(input),
    claddingSheetQuantity: qtyN11CladdingSheet(input),
    canopySheetQuantity: qtyN12CanopySheet(input),
    purlinBoltsQuantity: qtyN13PurlinBolts(input),
    jointBoltsQuantity: qtyN14JointBolts(input),
    foundationBoltsQuantity: qtyN15FoundationBolts(input),
    anchorBoltsQuantity: qtyN16AnchorBolts(input),
    ridgeQuantity: qtyN17Ridge(input),
    gutterQuantity: qtyN18Gutter(input),
    downtakeQuantity: qtyN19Downtake(input),
    dripTrimQuantity: qtyN20DripTrim(input),
    flashingQuantity: qtyN21Flashing(input),
    rollingShutterQuantity: qtyN22RollingShutter(input),
    louversQuantity: qtyN23Louvers(input),
    skyLightQuantity: qtyN24SkyLight(input),
    wallLightQuantity: qtyN25WallLight(input),
    roofInsulationQuantity: qtyN26RoofInsulation(input),
    wallInsulationQuantity: qtyN27WallInsulation(input),
    turboVentilatorsQuantity: qtyN28TurboVentilators(input),
    deckingSheetQuantity: qtyN29DeckingSheet(input),
    shearStudsQuantity: qtyN30ShearStuds(input),
    polyCarbonateSheetQuantity: qtyN31PolyCarbonateSheet(input),
    stair1Quantity: qtyN32Stair1(input),
    stair2Quantity: qtyN33Stair2(input),
    handrailQuantity: qtyN34Handrail(input),
    canopySideCoveringQuantity: qtyN35CanopySideCovering(input),
    doorsQuantity: qtyN36Doors(input),
    windowsQuantity: qtyN37Windows(input),
    fasciaStructureQuantity: qtyN38FasciaStructure(input),
    fasciaCoveringSheetBoardQuantity: qtyN39FasciaCoveringSheetBoard(input),
    internalPartitionsQuantity: qtyN40InternalPartitions(input),
  }
}

/** Input shape for deriving AmountItem rate fields from a Rate master row. */
export interface RateSource {
  fabricationRate: number
  erectionRate: number
  loadingRate: number
}

/** Derived rate fields written to an AmountItem. */
export interface AmountItemRates {
  rateFabrication: number
  rateErection: number
  rateLoading: number
}

/**
 * Derives the three AmountItem rate fields from the corresponding Rate master row.
 * Returns zeros when no matching rate exists.
 */
export function deriveAmountItemRates(rate: RateSource | null | undefined): AmountItemRates {
  if (!rate) return { rateFabrication: 0, rateErection: 0, rateLoading: 0 }
  return {
    rateFabrication: rate.fabricationRate,
    rateErection: rate.erectionRate,
    rateLoading: rate.loadingRate,
  }
}
