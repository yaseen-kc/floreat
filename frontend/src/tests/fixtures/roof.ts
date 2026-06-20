import type { RoofDraft } from '@/stores/quotation-store'

/**
 * A fully-valid Step 2 roof draft for tests: every required core dimension AND
 * every required structural section field. Under the frontend-stricter
 * `createRoofSchema`, all section fields (except the optional Fascia Board
 * fields and the inline `sidewalls` array) are required, so passing this to
 * `setRoof` is what makes `validateStep(2)` succeed.
 */
export const validRoofDraft: Partial<RoofDraft> = {
  // core dimensions
  buildingOverallLength: 100,
  buildingOverallWidth: 50,
  eaveHeight: 6,
  roofSlope: 10,
  mainRoofFrames: 5,
  endRoofFrames: 2,
  roofPurlinSpacing: 1.5,
  claddingPurlins: 4,
  internalColumnsForMainRoofFrames: 0,
  internalColumnsForEndRoofFrames: 0,
  roofFrameBaseFixing: 'FOUNDATION_BOLT',
  // members
  columnSegmentsInMainFrame: 2,
  raftersInOneHalfOfMainFrame: 2,
  columnSegmentsInEndFrame: 1,
  raftersInOneHalfOfEndFrame: 1,
  endFrameHorizontalTieBeam: 1,
  // purlins
  roofPurlinType: 'Z_C',
  roofPurlinDepth: 150,
  roofPurlinUnitWeight: 5,
  claddingPurlinType: 'TUBE',
  claddingPurlinDepth: 120,
  claddingPurlinUnitWeight: 4,
  // coverings
  roofCoveringType: 'PPGL',
  roofCoveringThickness: 0.5,
  claddingCoveringType: 'BARE_GALVALUME',
  claddingCoveringThickness: 0.4,
  roofAreaDeduction: 0,
  // flange brace
  roofFlangeBraceAverageLength: 1.2,
  claddingFlangeBraceAverageLength: 1.1,
  endFrameFlangeBraceAverageLength: 1,
  // polycarbonate
  polycarbonateRoofLength: 3,
  polycarbonateRoofWidth: 1,
  polycarbonateRoofCount: 2,
  // wind bracing
  roofWindBracingSegmentsInOneHalf: 2,
  columnWindBracingSegments: 2,
  roofWindBracingProvidedBays: 1,
  columnWindBracingProvidedBays: 1,
  windBracingColumnHeight: 6,
  windBracingUnitWeight: 3,
  roofWindBracingBaySpacing: 5,
  columnWindBracingBaySpacing: 5,
  roofWindBracingLength: 7,
  columnWindBracingLength: 6,
  windBracingType: 'ROD',
  // cladding openings
  frontCladdingOpeningArea: 0,
  backCladdingOpeningArea: 0,
  rightCladdingOpeningArea: 0,
  leftCladdingOpeningArea: 0,
  // side extension
  roofExtensionWidthHeight: 1,
  roofExtensionMidFrameCount: 1,
  roofExtensionEndFrameCount: 1,
  claddingExtensionWidthHeight: 1,
  claddingExtensionMidFrameCount: 1,
  claddingExtensionEndFrameCount: 1,
  sideColumnsWidthHeight: 1,
  sideColumnsMidFrameCount: 1,
  sideColumnsEndFrameCount: 1,
  // material grade
  gradeOfPlateMaterial: 'FE_345',
  // material consumption
  materialConsumptionExcludingPurlin: 12.5,
  // SAG rod
  DiaOfRoofSagRod: 12,
  DiaOfCladdingSagRod: 10,
}
