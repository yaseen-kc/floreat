/**
 * Roof derived calculations — shared (isomorphic) between the frontend (live
 * preview) and the backend (authoritative recompute on write).
 */

/** The inputs needed to derive the Side Columns Width / Height. */
export interface SideColumnsWidthHeightInput {
  eaveHeight?: number
  roofSlope?: number
  claddingExtensionWidthHeight?: number
}

/**
 * Derives the Side Columns Width / Height from the eave height, roof slope
 * (in degrees) and cladding extension width/height. This value is never a user
 * input — the frontend computes it for a read-only preview and the backend
 * recomputes it authoritatively before persisting.
 *
 * Returns `undefined` while any input is missing (so the preview stays empty),
 * `0` when the cladding extension is `0`, and otherwise
 * `eaveHeight − claddingExt × tan(roofSlope)` clamped to `0` and rounded to 3
 * decimals (matching the `Decimal(10,3)` column).
 */
export function deriveSideColumnsWidthHeight(
  input: SideColumnsWidthHeightInput,
): number | undefined {
  const { eaveHeight, roofSlope, claddingExtensionWidthHeight } = input
  if (
    claddingExtensionWidthHeight === undefined ||
    eaveHeight === undefined ||
    roofSlope === undefined
  ) {
    return undefined
  }
  if (claddingExtensionWidthHeight === 0) return 0
  const raw = eaveHeight - claddingExtensionWidthHeight * Math.tan((roofSlope * Math.PI) / 180)
  return Math.max(0, Math.round(raw * 1000) / 1000)
}
