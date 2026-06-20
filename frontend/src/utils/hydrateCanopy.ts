import type { Canopy } from '@/api/quotation/canopy/getCanopy'
import type { CanopyDraft, CanopyItemDraft } from '@/stores/quotation-store'

/** Prisma `Decimal` columns serialise as strings (or null) — coerce to number. */
const num = (v: string | null): number | undefined => (v == null ? undefined : Number(v))

/** `null` optional integers become `undefined` so they stay out of the payload. */
const int = (v: number | null): number | undefined => (v == null ? undefined : v)

/** The mapped canopy draft plus the derived top-level toggle. */
export interface HydratedCanopy {
  canopy: CanopyDraft
  hasCanopy: boolean
}

/**
 * Maps a `Canopy` API response (Decimal columns as strings, optionals as `null`)
 * into a Step 5 {@link CanopyDraft}. `hasCanopy` is enabled when the response
 * contains at least one canopy item.
 */
export function mapCanopyResponseToDraft(c: Canopy): HydratedCanopy {
  const canopies: CanopyItemDraft[] = c.canopies.map((it) => ({
    code: it.code ?? undefined,
    heightFrom: it.heightFrom ?? undefined,
    length: num(it.length),
    width: num(it.width),
    height: num(it.height),
    materialConsumptionKgPerSqft: num(it.materialConsumptionKgPerSqft),
    numberOfBeams: int(it.numberOfBeams),
    numberOfPurlins: int(it.numberOfPurlins),
    purlinDepth: num(it.purlinDepth),
    unitWeightOfPurlin: num(it.unitWeightOfPurlin),
    canopySheet: it.canopySheet ?? undefined,
    sheetThick: num(it.sheetThick),
    canopySideCoveringHeight: num(it.canopySideCoveringHeight),
    gutter: it.gutter ?? undefined,
    downTake: it.downTake ?? undefined,
    flashing: it.flashing ?? undefined,
  }))

  return { canopy: { canopies }, hasCanopy: canopies.length > 0 }
}
