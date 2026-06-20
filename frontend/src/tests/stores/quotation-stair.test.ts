import { describe, it, expect, beforeEach } from 'vitest'
import {
  buildStairPayload,
  useQuotationStore,
  type StairDraft,
} from '@/stores/quotation-store'

describe('buildStairPayload', () => {
  it('drops undefined fields and fully-empty rows, and omits empty arrays', () => {
    const draft: StairDraft = {
      stairs: [
        // A real staircase: code + a couple of populated fields, the rest undefined.
        { code: 'STAIR-1', typeOfStep: 'TUBE', length: 12, width: undefined, height: undefined },
        // Fully-empty row (all undefined) — must be dropped.
        { typeOfStep: undefined, length: undefined },
      ],
      // No area deductions at all — the key must be omitted entirely.
      areaDeductions: [],
    }

    const payload = buildStairPayload(draft)

    expect(payload.stairs).toEqual([{ code: 'STAIR-1', typeOfStep: 'TUBE', length: 12 }])
    expect('areaDeductions' in payload).toBe(false)
  })

  it('returns an empty object for an empty draft', () => {
    expect(buildStairPayload({ stairs: [], areaDeductions: [] })).toEqual({})
  })
})

describe('setHasStair', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('clears stairs and area deductions when toggled off', () => {
    const { setStair, setHasStair } = useQuotationStore.getState()
    setHasStair(true)
    setStair({ stairs: [{ code: 'STAIR-1' }], areaDeductions: [{ type: 'LIFT' }] })
    expect(useQuotationStore.getState().stair.stairs).toHaveLength(1)

    setHasStair(false)
    const s = useQuotationStore.getState()
    expect(s.hasStair).toBe(false)
    expect(s.stair).toEqual({ stairs: [], areaDeductions: [] })
  })

  it('patches the stair draft via setStair', () => {
    useQuotationStore.getState().setStair({ stairs: [{ code: 'STAIR-1', length: 3 }] })
    expect(useQuotationStore.getState().stair.stairs[0]).toEqual({ code: 'STAIR-1', length: 3 })
  })
})
