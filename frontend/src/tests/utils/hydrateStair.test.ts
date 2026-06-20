import { describe, it, expect } from 'vitest'
import { mapStairResponseToDraft } from '@/utils/hydrateStair'
import { buildLocationOptions } from '@/components/quotation/sections/stair/stairOptions'
import type { Stair } from '@/api/quotation/stair/getStairs'

const serverStair = (): Stair => ({
  id: 'stair-1',
  jobId: 'job-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  stairs: [
    {
      id: 'item-1',
      stairId: 'stair-1',
      code: 'STAIR-1',
      typeOfStep: 'TUBE',
      location: 'MEZ-1',
      startingFrom: 'GROUND',
      endingUpTo: 'FIRST_FLOOR',
      length: '12.5',
      width: null,
      height: null,
      numberOfMidLanding: 2,
      typeOfStringer: 'HR_SECTION',
      unitWeightOfStringer: null,
    },
  ],
  areaDeductions: [],
})

describe('mapStairResponseToDraft', () => {
  it('coerces Decimal strings to numbers and nulls to undefined', () => {
    const { stair } = mapStairResponseToDraft(serverStair())
    const item = stair.stairs[0]
    expect(item.length).toBe(12.5)
    expect(item.numberOfMidLanding).toBe(2)
    expect(item.width).toBeUndefined()
    expect(item.unitWeightOfStringer).toBeUndefined()
    expect(item.code).toBe('STAIR-1')
    expect(item.typeOfStep).toBe('TUBE')
    expect(item.location).toBe('MEZ-1')
  })

  it('derives hasStair from the presence of stairs/areaDeductions', () => {
    expect(mapStairResponseToDraft(serverStair()).hasStair).toBe(true)
    const empty: Stair = { ...serverStair(), stairs: [], areaDeductions: [] }
    expect(mapStairResponseToDraft(empty).hasStair).toBe(false)
  })
})

describe('buildLocationOptions', () => {
  it('derives MEZ-/EXT- codes by position from the mezzanine draft', () => {
    const options = buildLocationOptions({ floors: [{}, {}], extensions: [{}] })
    expect(options.map((o) => o.value)).toEqual(['MEZ-1', 'MEZ-2', 'EXT-1'])
  })

  it('returns no options when the mezzanine draft is empty', () => {
    expect(buildLocationOptions({ floors: [], extensions: [] })).toEqual([])
  })
})
