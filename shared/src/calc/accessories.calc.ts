/**
 * Accessories business-math. Authoritative implementations used by the backend
 * on write; the frontend may reuse them for live preview only (never trusted
 * server-side).
 *
 * Every input lives on the job's Roof (and its sidewalls) — Accessories itself
 * holds none of them. The backend reads the roof, feeds it here, and overwrites
 * the six `*Quantity` fields with the results — except for any field whose
 * companion `*Manual` flag is set, which the user has overridden by hand (the
 * service keeps the client value and skips it on recompute).
 *
 * All results are rounded to 3 decimals to match the `Decimal(10,3)` columns.
 * Trig uses degrees (consistent with `deriveSideColumnsWidthHeight`).
 */

/** Roof-derived inputs the accessory quantity equations depend on. */
export interface AccessoryQuantitiesInput {
  /** Roof.buildingOverallLength (required on any saved roof). */
  buildingOverallLength?: number
  /** Roof.buildingOverallWidth (required on any saved roof). */
  buildingOverallWidth?: number
  /** Roof.eaveHeight (required on any saved roof). */
  eaveHeight?: number
  /** Roof.roofSlope in degrees (required on any saved roof). */
  roofSlope?: number
  /** Roof.mainRoofFrames (required on any saved roof). */
  mainRoofFrames?: number
  /** Roof.endRoofFrames (required on any saved roof). */
  endRoofFrames?: number
  /** Roof.roofExtensionWidthHeight — optional; treated as 0 when blank. */
  roofExtensionWidthHeight?: number
  /** Roof.claddingExtensionWidthHeight (a.k.a. sideExtensionCladdingWidthHeight) — optional; 0 when blank. */
  claddingExtensionWidthHeight?: number
  /** Roof.sideColumnsWidthHeight (a.k.a. sideExtensionSideColumnsWidthHeight) — optional; 0 when blank. */
  sideColumnsWidthHeight?: number
  /** Height of the FRONT sidewall; `undefined` when that sidewall doesn't exist. */
  frontSideWallHeight?: number
  /** Height of the LEFT sidewall; `undefined` when that sidewall doesn't exist. */
  leftSideWallHeight?: number
}

/** The six server-derived accessory quantities. Each is `undefined` when it can't be computed. */
export interface AccessoryQuantities {
  gutterQuantity?: number
  downTakeQuantity?: number
  dripTrimQuantity?: number
  gableEndFlashingQuantity?: number
  cornerFlashQuantity?: number
  ridgeQuantity?: number
}

/** Round to 3 decimals to match the `Decimal(10,3)` columns. */
const round3 = (n: number): number => Math.round(n * 1000) / 1000

/** cos of an angle given in degrees. */
const cosDeg = (deg: number): number => Math.cos((deg * Math.PI) / 180)

/**
 * Derives the six accessory `*Quantity` values from a job's roof. The backend
 * calls this only when a roof exists (so the required core dimensions are
 * present); blank *optional* inputs are treated as `0`.
 *
 * `cornerFlashQuantity` is `undefined` unless BOTH a FRONT and a LEFT sidewall
 * exist (their heights are required by the equation), so it stays empty rather
 * than being computed against a phantom `0` height.
 */
export function deriveAccessoryQuantities(input: AccessoryQuantitiesInput): AccessoryQuantities {
  const {
    buildingOverallLength: L,
    buildingOverallWidth: W,
    eaveHeight: H,
    roofSlope: S,
    mainRoofFrames,
    endRoofFrames,
    roofExtensionWidthHeight,
    claddingExtensionWidthHeight,
    sideColumnsWidthHeight,
    frontSideWallHeight,
    leftSideWallHeight,
  } = input

  const roofExt = roofExtensionWidthHeight ?? 0
  const claddingExt = claddingExtensionWidthHeight ?? 0
  const sideCols = sideColumnsWidthHeight ?? 0

  // ponytail: AQ19 is an unresolved spreadsheet cell reference with no mapping
  // in the schema — treated as 0 for now. Upgrade path: replace with the real
  // Roof field once identified.
  const AQ19 = 0

  const out: AccessoryQuantities = {}

  // 1. Gutter = 2 × buildingOverallLength
  if (L !== undefined) out.gutterQuantity = round3(2 * L)

  // 2. Down Take = (mainRoofFrames + endRoofFrames) × eaveHeight
  if (mainRoofFrames !== undefined && endRoofFrames !== undefined && H !== undefined) {
    out.downTakeQuantity = round3((mainRoofFrames + endRoofFrames) * H)
  }

  // 3. Drip Trim = 2 × (buildingOverallLength + buildingOverallWidth + AQ19)
  if (L !== undefined && W !== undefined) out.dripTrimQuantity = round3(2 * (L + W + AQ19))

  // 4. Gable End Flashing = 2 × (W / cos(S) + 0.14) + 2 × (roofExt / cos(S) + 0.14)
  if (W !== undefined && S !== undefined) {
    const cos = cosDeg(S)
    out.gableEndFlashingQuantity = round3(2 * (W / cos + 0.14) + 2 * (roofExt / cos + 0.14))
  }

  // 5. Corner Flash — requires BOTH front & left sidewall heights.
  if (H !== undefined && frontSideWallHeight !== undefined && leftSideWallHeight !== undefined) {
    if (claddingExt === 0) {
      out.cornerFlashQuantity = round3(4 * (H - frontSideWallHeight))
    } else {
      const columnTerm = sideCols === 0 ? 0 : sideCols - leftSideWallHeight
      out.cornerFlashQuantity = round3(2 * ((H - frontSideWallHeight) + columnTerm))
    }
  }

  // 6. Ridge = buildingOverallLength
  if (L !== undefined) out.ridgeQuantity = round3(L)

  return out
}

/**
 * Derives a line-item's `quantity` = `dimA × dimB × nos`, rounded to 3 decimals.
 * Used for every accessory line item (each is two dimensions × a unit count):
 *   - Doors & windows use height × width × nos.
 *   - Openings (rolling shutter / louver / sky light / wall light) and folded
 *     plates use length × width × nos (folded plate has no height column, so
 *     length is its primary dimension).
 *
 * Returns `undefined` when any of the three inputs is blank, so the caller can
 * persist `null` rather than a misleading `0`.
 */
export function deriveLineItemQuantity(dimA?: number, dimB?: number, nos?: number): number | undefined {
  if (dimA === undefined || dimB === undefined || nos === undefined) return undefined
  return round3(dimA * dimB * nos)
}
