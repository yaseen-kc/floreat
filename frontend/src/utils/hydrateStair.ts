import type { Stair } from '@/api/quotation/stair/getStairs'
import type {
  StairDraft,
  StairItemDraft,
  AreaDeductionDraft,
} from '@/stores/quotation-store'

import { num, int } from '@floreat/shared/units'

/** The mapped stair draft plus the derived top-level toggle. */
export interface HydratedStair {
  stair: StairDraft
  hasStair: boolean
}

/**
 * Maps a `Stair` API response (Decimal columns as strings, optionals as `null`)
 * into a Step 4 {@link StairDraft}. `hasStair` is enabled when the response
 * contains at least one staircase or area deduction.
 */
export function mapStairResponseToDraft(s: Stair): HydratedStair {
  const stairs: StairItemDraft[] = s.stairs.map((it) => ({
    code: it.code ?? undefined,
    typeOfStep: it.typeOfStep ?? undefined,
    location: it.location ?? undefined,
    startingFrom: it.startingFrom ?? undefined,
    endingUpTo: it.endingUpTo ?? undefined,
    length: num(it.length),
    width: num(it.width),
    height: num(it.height),
    numberOfMidLanding: int(it.numberOfMidLanding),
    typeOfStringer: it.typeOfStringer ?? undefined,
    unitWeightOfStringer: num(it.unitWeightOfStringer),
  }))

  const areaDeductions: AreaDeductionDraft[] = s.areaDeductions.map((d) => ({
    type: d.type ?? undefined,
    location: d.location ?? undefined,
    areaM2: num(d.areaM2),
    numbers: int(d.numbers),
    deductionFor: d.deductionFor ?? undefined,
  }))

  return { stair: { stairs, areaDeductions }, hasStair: stairs.length > 0 || areaDeductions.length > 0 }
}
