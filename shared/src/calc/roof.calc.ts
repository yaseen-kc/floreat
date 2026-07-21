/**
 * Roof business-math. Authoritative implementations used by the backend on
 * write; the frontend reuses them for live preview only (never trusted server-side).
 */

export interface WindBracingBaySpacingInput {
  buildingOverallLength?: number
  mainRoofFrames?: number
  endRoofFrames?: number
}

/** Both roof and column bay spacing share the same formula. */
export function deriveWindBracingBaySpacing(input: WindBracingBaySpacingInput): number | undefined {
  const { buildingOverallLength, mainRoofFrames, endRoofFrames } = input
  if (buildingOverallLength === undefined || mainRoofFrames === undefined || endRoofFrames === undefined) return undefined
  const denom = mainRoofFrames + endRoofFrames - 1
  if (denom <= 0) return undefined
  return Math.round((buildingOverallLength / denom) * 1000) / 1000
}

export interface RoofWindBracingLengthInput {
  buildingOverallWidth?: number
  roofSlope?: number
  roofWindBracingSegmentsInOneHalf?: number
  roofWindBracingBaySpacing?: number
}

export function deriveRoofWindBracingLength(input: RoofWindBracingLengthInput): number | undefined {
  const { buildingOverallWidth, roofSlope, roofWindBracingSegmentsInOneHalf, roofWindBracingBaySpacing } = input
  if (
    buildingOverallWidth === undefined ||
    roofSlope === undefined ||
    roofWindBracingSegmentsInOneHalf === undefined ||
    roofWindBracingBaySpacing === undefined
  ) return undefined
  if (roofWindBracingSegmentsInOneHalf <= 0) return undefined
  const slopeRad = (roofSlope * Math.PI) / 180
  const seg = (buildingOverallWidth / 2) / Math.cos(slopeRad) / roofWindBracingSegmentsInOneHalf
  return Math.round(Math.sqrt(seg ** 2 + roofWindBracingBaySpacing ** 2) * 1000) / 1000
}

export interface ColumnWindBracingLengthInput {
  windBracingColumnHeight?: number
  columnWindBracingSegments?: number
  columnWindBracingBaySpacing?: number
}

export function deriveColumnWindBracingLength(input: ColumnWindBracingLengthInput): number | undefined {
  const { windBracingColumnHeight, columnWindBracingSegments, columnWindBracingBaySpacing } = input
  if (
    windBracingColumnHeight === undefined ||
    columnWindBracingSegments === undefined ||
    columnWindBracingBaySpacing === undefined
  ) return undefined
  if (columnWindBracingSegments <= 0) return undefined
  const segH = windBracingColumnHeight / columnWindBracingSegments
  return Math.round(Math.sqrt(segH ** 2 + columnWindBracingBaySpacing ** 2) * 1000) / 1000
}

/** Inputs the side-columns width/height derivation depends on. */
export interface SideColumnsWidthHeightInput {
  eaveHeight?: number
  roofSlope?: number
  claddingExtensionWidthHeight?: number
}

/**
 * Derives a roof's `sideColumnsWidthHeight`. This value is never user input — it
 * is computed and persisted from the eave height, roof slope and cladding
 * extension.
 *
 * Returns `undefined` while any input is blank (so a read-only display stays
 * empty and the field drops from a payload), `0` when the cladding extension is
 * `0`, and otherwise `eaveHeight − claddingExt × tan(roofSlope°)` clamped to `0`
 * and rounded to 3 decimals (matching the `Decimal(10,3)` column).
 */
export function deriveSideColumnsWidthHeight(input: SideColumnsWidthHeightInput): number | undefined {
  const { eaveHeight, roofSlope, claddingExtensionWidthHeight } = input
  if (claddingExtensionWidthHeight === undefined || eaveHeight === undefined || roofSlope === undefined) {
    return undefined
  }
  if (claddingExtensionWidthHeight === 0) return 0
  const raw = eaveHeight - claddingExtensionWidthHeight * Math.tan((roofSlope * Math.PI) / 180)
  return Math.max(0, Math.round(raw * 1000) / 1000)
}
