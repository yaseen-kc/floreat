/**
 * Amount (bill-of-quantities) business-math. Authoritative implementations
 * used by the backend on write; the frontend may reuse them for live preview
 * only (never trusted server-side).
 *
 * Each `qtyN*` function is a faithful translation of the Excel `AMOUNT!Nx`
 * equation for one canonical line item — see
 * docs/AMOUNT_QUANTITY_IMPLEMENTATION_PROMPT.md for the full spec. Blank
 * inputs are treated as 0, matching Excel's blank-cell behaviour.
 */

/** Inputs the STEEL STRUCTURES (N5) quantity equation depends on. */
export interface SteelStructuresInput {
  /** Roof.buildingOverallLength. */
  buildingOverallLength?: number
  /** Roof.buildingOverallWidth. */
  buildingOverallWidth?: number
  /** Roof.roofSlope, in degrees. */
  roofSlope?: number
  /** Roof.materialConsumptionExcludingPurlin. */
  materialConsumptionExcludingPurlin?: number
  /** Canopy.canopies[0].length — first canopy entered. */
  canopy0Length?: number
  /** Canopy.canopies[0].width. */
  canopy0Width?: number
  /** Canopy.canopies[0].materialConsumptionKgPerSqft. */
  canopy0MaterialConsumptionKgPerSqft?: number
  /** Mezzanine.floors[0].lengthM — first floor entered. */
  mez0LengthM?: number
  /** Mezzanine.floors[0].widthM. */
  mez0WidthM?: number
  /** Mezzanine.floors[0].materialConsumptionKgPerSqft. */
  mez0MaterialConsumptionKgPerSqft?: number
  /** Mezzanine.floors[1].lengthM — second floor entered. */
  mez1LengthM?: number
  /** Mezzanine.floors[1].widthM. */
  mez1WidthM?: number
  /** Stair.areaDeductions[0].areaM2 — first deduction entered. */
  areaDeduction0AreaM2?: number
  /** Stair.areaDeductions[0].numbers. */
  areaDeduction0Numbers?: number
  /** Stair.stairs[0].length — first stair entered. */
  stair0Length?: number
  /** Stair.stairs[0].width. */
  stair0Width?: number
  /** Stair.stairs[0].height. */
  stair0Height?: number
  /** Stair.stairs[0].numberOfMidLanding. */
  stair0NumberOfMidLanding?: number
  /** Stair.stairs[0].unitWeightOfStringer. */
  stair0UnitWeightOfStringer?: number
}

/** Coerce a possibly-undefined field to a number, treating blanks as 0. */
const n = (v?: number): number => v ?? 0

/**
 * Derives the STEEL STRUCTURES quantity (AMOUNT!N5, unit KG):
 *
 *   L × (W / cos(S°) / 2 + 0.14) × 2 × 10.76 × mcPurlin
 *   + canopy0L × canopy0W × canopy0Mc × 10.76
 *   + (mez0L × mez0W − ad0Area × ad0Numbers − stair0L × stair0W + mez1L × mez1W) × mez0Mc × 10.76
 *   + (√((stair0H / (nml + 1))² + (stair0L − 2)²) + 2 + nml) × (2 + nml × 2) × unitWeightOfStringer
 *   + stair0H / 0.15 × stair0W / 2 × 0.006 × 0.45 × 7850
 *
 * A zero roof slope (cos = 1, never 0) needs no divide-by-zero guard for that
 * term; every other division in the equation is by a literal constant.
 */
export function qtyN5SteelStructures(input: SteelStructuresInput): number {
  const L = n(input.buildingOverallLength)
  const W = n(input.buildingOverallWidth)
  const mcPurlin = n(input.materialConsumptionExcludingPurlin)
  const cosS = Math.cos((n(input.roofSlope) * Math.PI) / 180)
  const roofTerm = L * (cosS === 0 ? 0 : W / cosS / 2 + 0.14) * 2 * 10.76 * mcPurlin

  const canopyTerm =
    n(input.canopy0Length) * n(input.canopy0Width) * n(input.canopy0MaterialConsumptionKgPerSqft) * 10.76

  const mez0L = n(input.mez0LengthM)
  const mez0W = n(input.mez0WidthM)
  const stair0L = n(input.stair0Length)
  const stair0W = n(input.stair0Width)
  const mezzTerm =
    (mez0L * mez0W -
      n(input.areaDeduction0AreaM2) * n(input.areaDeduction0Numbers) -
      stair0L * stair0W +
      n(input.mez1LengthM) * n(input.mez1WidthM)) *
    n(input.mez0MaterialConsumptionKgPerSqft) *
    10.76

  const stair0H = n(input.stair0Height)
  const nml = n(input.stair0NumberOfMidLanding)
  const landingRun = nml + 1 === 0 ? 0 : stair0H / (nml + 1)
  const landingRun2 = stair0L - 2
  const stairStringerTerm =
    (Math.sqrt(landingRun * landingRun + landingRun2 * landingRun2) + 2 + nml) *
    (2 + nml * 2) *
    n(input.stair0UnitWeightOfStringer)

  const stairStepTerm = (stair0H / 0.15) * (stair0W / 2) * 0.006 * 0.45 * 7850

  return roofTerm + canopyTerm + mezzTerm + stairStringerTerm + stairStepTerm
}
