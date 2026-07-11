import type { Load } from '@/api/quotation/load/getLoad'
import type { LoadDraft } from '@/stores/quotation-store'

import { num, int } from '@floreat/shared/units'

/**
 * Maps a `Load` API response (Decimal columns as strings, optionals as `null`)
 * into a Step 7 {@link LoadDraft}. Load is flat with no child arrays, so this is
 * a straight field-by-field coercion: Decimal strings → numbers, `null` → blank.
 */
export function mapLoadResponseToDraft(l: Load): LoadDraft {
  return {
    deadLoadOnRoofRafters: num(l.deadLoadOnRoofRafters),
    liveLoadOnRoofRafters: num(l.liveLoadOnRoofRafters),
    collateralLoadOnRoofRafters: num(l.collateralLoadOnRoofRafters),
    windLoadOnRoofRaftersUpward: num(l.windLoadOnRoofRaftersUpward),
    windLoadHorizontal: num(l.windLoadHorizontal),
    deadLoadOnRoofFloor: num(l.deadLoadOnRoofFloor),
    liveLoadOnRoofFloor: num(l.liveLoadOnRoofFloor),
    floorDeadLoad: num(l.floorDeadLoad),
    floorFinishLoad: num(l.floorFinishLoad),
    floorLiveLoad: num(l.floorLiveLoad),
    snowLoad: num(l.snowLoad),
    earthquakeLoad: num(l.earthquakeLoad),
    approvalDrawingsTime: int(l.approvalDrawingsTime),
    approvalDrawingsUnit: l.approvalDrawingsUnit ?? undefined,
    supplyOfMaterialsDays: int(l.supplyOfMaterialsDays),
    erectionOfStructureDays: int(l.erectionOfStructureDays),
  }
}
