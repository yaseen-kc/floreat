/**
 * Roof business-math. Authoritative implementations used by the backend on
 * write; the frontend reuses them for live preview only (never trusted server-side).
 */

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
