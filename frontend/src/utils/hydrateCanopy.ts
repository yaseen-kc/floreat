import type { Canopy } from '@/api/quotation/canopy/getCanopy'
import type { CanopyDraft, CanopyItemDraft } from '@/stores/quotation-store'

import { num, int } from '@floreat/shared/units'

/** The mapped canopy draft. */
export type HydratedCanopy = CanopyDraft

/**
 * Maps a `Canopy` API response (Decimal columns as strings, optionals as `null`)
 * into a Step 5 {@link CanopyDraft}.
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

  return { canopies }
}
