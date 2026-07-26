import { describe, it, expect } from 'vitest'
import { mapCanopyResponseToDraft } from '@/utils/hydrateCanopy'
import type { Canopy } from '@/api/quotation/canopy/getCanopy'

describe('mapCanopyResponseToDraft', () => {
  it('coerces Decimal strings to numbers and nulls to undefined', () => {
    const response: Canopy = {
      id: 'c1', jobId: 'j1', createdAt: '', updatedAt: '',
      canopies: [{
        id: 'ci1', canopyId: 'c1', code: 'CANOPY_1', heightFrom: 'GROUND',
        length: '5.500', width: '3.000', height: '4.200',
        materialConsumptionKgPerSqft: '2.100',
        numberOfBeams: 4, numberOfPurlins: 6, purlinDepth: '0.150', unitWeightOfPurlin: '3.200',
        canopySheet: 'NCGL', sheetThick: '0.500', canopySideCoveringHeight: '1.200',
        gutter: true, downTake: false, flashing: null,
      }],
    }
    const canopy = mapCanopyResponseToDraft(response)
    expect(canopy.canopies).toHaveLength(1)
    expect(canopy.canopies[0].length).toBe(5.5)
    expect(canopy.canopies[0].flashing).toBeUndefined()
    expect(canopy.canopies[0].gutter).toBe(true)
  })

  it('returns empty canopies array for an empty server record', () => {
    const response: Canopy = { id: 'c1', jobId: 'j1', createdAt: '', updatedAt: '', canopies: [] }
    expect(mapCanopyResponseToDraft(response).canopies).toHaveLength(0)
  })
})
