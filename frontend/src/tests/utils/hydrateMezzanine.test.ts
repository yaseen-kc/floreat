import { describe, it, expect } from 'vitest'
import { mapMezzanineResponseToDraft } from '@/utils/hydrateMezzanine'
import type { Mezzanine } from '@/api/quotation/mezz/getMezz'

const serverMezzanine = (): Mezzanine => ({
  id: 'mezz-1',
  jobId: 'job-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  floors: [
    {
      id: 'floor-1',
      mezzanineId: 'mezz-1',
      code: 'MEZ-1',
      floor: 'FLOOR_1',
      type: 'DECK_SHEET',
      heightFrom: 'GROUND',
      thicknessMm: '120',
      lengthM: '12.5',
      widthM: null,
      heightM: null,
      materialConsumptionKgPerSqft: null,
      beamsMidPrimary: 4,
      beamsEndPrimary: null,
      beamsSecondary: null,
      jointsMidPrimary: null,
      jointsEndPrimary: null,
      internalColumnsMidPrimary: null,
      internalColumnsEndPrimary: null,
    },
  ],
  extensions: [],
})

describe('mapMezzanineResponseToDraft', () => {
  it('coerces Decimal strings to numbers and nulls to undefined', () => {
    const mezzanine = mapMezzanineResponseToDraft(serverMezzanine())
    const floor = mezzanine.floors[0]
    expect(floor.thicknessMm).toBe(120)
    expect(floor.lengthM).toBe(12.5)
    expect(floor.beamsMidPrimary).toBe(4)
    expect(floor.widthM).toBeUndefined()
    expect(floor.beamsEndPrimary).toBeUndefined()
    expect(floor.code).toBe('MEZ-1')
    expect(floor.type).toBe('DECK_SHEET')
  })

  it('returns populated floors/extensions when the server record has data', () => {
    const mezzanine = mapMezzanineResponseToDraft(serverMezzanine())
    expect(mezzanine.floors).toHaveLength(1)
    expect(mezzanine.extensions).toHaveLength(0)
  })

  it('returns empty floors/extensions for an empty server record', () => {
    const empty: Mezzanine = { ...serverMezzanine(), floors: [], extensions: [] }
    const mezzanine = mapMezzanineResponseToDraft(empty)
    expect(mezzanine.floors).toHaveLength(0)
    expect(mezzanine.extensions).toHaveLength(0)
  })
})
