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

describe('setStair', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('patches the stair draft via setStair', () => {
    useQuotationStore.getState().setStair({ stairs: [{ code: 'STAIR-1', length: 3 }] })
    expect(useQuotationStore.getState().stair.stairs[0]).toEqual({ code: 'STAIR-1', length: 3 })
  })
})
