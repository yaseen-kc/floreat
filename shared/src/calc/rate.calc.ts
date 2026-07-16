/**
 * Rate master-data business-math. Authoritative implementations used by the
 * backend on read/write; the frontend may reuse them for live preview only
 * (never trusted server-side).
 *
 * A Rate row stores only its raw pricing components (material, fabrication,
 * transportation, installation, loading/unloading, overheads, others, margin%).
 * The four *rates* below are always derived from those components — never
 * stored — so the server stays the single source of truth (see backend
 * standards §0). Results use `Math.ceil` per the `rateFormulas` spec.
 */

/** Raw pricing components of a Rate row. Every field is optional; blanks are treated as 0. */
export interface RatePricingInput {
  material?: number
  fabrication?: number
  transportation?: number
  installation?: number
  loadingUnloading?: number
  overheads?: number
  others?: number
  /** Margin as a percentage (e.g. 15 → a 1.15 multiplier). */
  marginPercentage?: number
}

/** The four server-derived rates for a Rate row. */
export interface RateBreakdown {
  fabricationRate: number
  erectionRate: number
  loadingRate: number
  totalRate: number
}

/** Coerce a possibly-undefined component to a number, treating blanks as 0. */
const n = (v?: number): number => v ?? 0

/**
 * Derives the four rates for a Rate row from its raw pricing components:
 *   marginMultiplier = (marginPercentage / 100) + 1
 *   fabricationRate  = ceil((material + fabrication + transportation) * mult + overheads + others)
 *   erectionRate     = ceil(installation * mult)
 *   loadingRate      = ceil(loadingUnloading)
 *   totalRate        = fabricationRate + erectionRate + loadingRate
 *
 * Missing components are treated as 0, so an all-blank pricing object yields all
 * zeroes.
 */
export function deriveRateBreakdown(pricing: RatePricingInput): RateBreakdown {
  const marginMultiplier = n(pricing.marginPercentage) / 100 + 1
  const fabricationRate = Math.ceil(
    (n(pricing.material) + n(pricing.fabrication) + n(pricing.transportation)) * marginMultiplier +
      n(pricing.overheads) +
      n(pricing.others),
  )
  const erectionRate = Math.ceil(n(pricing.installation) * marginMultiplier)
  const loadingRate = Math.ceil(n(pricing.loadingUnloading))
  const totalRate = fabricationRate + erectionRate + loadingRate

  return { fabricationRate, erectionRate, loadingRate, totalRate }
}
