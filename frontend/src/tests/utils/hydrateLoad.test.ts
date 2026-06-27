import { describe, it, expect } from 'vitest'
import { mapLoadResponseToDraft } from '@/utils/hydrateLoad'
import type { Load } from '@/api/quotation/load/getLoad'

describe('mapLoadResponseToDraft', () => {
  it('coerces Decimal strings to numbers and nulls to undefined', () => {
    const response: Load = {
      id: 'l1', jobId: 'j1', createdAt: '', updatedAt: '',
      deadLoadOnRoofRafters: '0.500',
      liveLoadOnRoofRafters: null,
      collateralLoadOnRoofRafters: '0.250',
      windLoadOnRoofRaftersUpward: null,
      windLoadHorizontal: '150.000',
      deadLoadOnRoofFloor: null,
      liveLoadOnRoofFloor: null,
      floorDeadLoad: null,
      floorFinishLoad: null,
      floorLiveLoad: '3.500',
      snowLoad: null,
      earthquakeLoad: null,
      approvalDrawingsTime: 2,
      approvalDrawingsUnit: 'WEEKS',
      supplyOfMaterialsDays: 30,
      erectionOfStructureDays: null,
    }
    const draft = mapLoadResponseToDraft(response)
    expect(draft.deadLoadOnRoofRafters).toBe(0.5)
    expect(draft.windLoadHorizontal).toBe(150)
    expect(draft.floorLiveLoad).toBe(3.5)
    expect(draft.liveLoadOnRoofRafters).toBeUndefined()
    expect(draft.approvalDrawingsTime).toBe(2)
    expect(draft.approvalDrawingsUnit).toBe('WEEKS')
    expect(draft.supplyOfMaterialsDays).toBe(30)
    expect(draft.erectionOfStructureDays).toBeUndefined()
  })

  it('maps an all-null response to an entirely blank draft', () => {
    const response: Load = {
      id: 'l1', jobId: 'j1', createdAt: '', updatedAt: '',
      deadLoadOnRoofRafters: null, liveLoadOnRoofRafters: null,
      collateralLoadOnRoofRafters: null, windLoadOnRoofRaftersUpward: null,
      windLoadHorizontal: null, deadLoadOnRoofFloor: null, liveLoadOnRoofFloor: null,
      floorDeadLoad: null, floorFinishLoad: null, floorLiveLoad: null,
      snowLoad: null, earthquakeLoad: null,
      approvalDrawingsTime: null, approvalDrawingsUnit: null,
      supplyOfMaterialsDays: null, erectionOfStructureDays: null,
    }
    const draft = mapLoadResponseToDraft(response)
    expect(Object.values(draft).every((v) => v === undefined)).toBe(true)
  })
})
