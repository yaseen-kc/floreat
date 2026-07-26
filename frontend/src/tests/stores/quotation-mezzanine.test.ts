import { describe, it, expect } from 'vitest'
import {
  buildMezzaninePayload,
  type MezzanineDraft,
} from '@/stores/quotation-store'

describe('buildMezzaninePayload', () => {
  it('drops undefined fields and fully-empty rows, and omits empty arrays', () => {
    const draft: MezzanineDraft = {
      floors: [
        // A real floor: code + a couple of populated fields, the rest undefined.
        { code: 'MEZ_1', type: 'DECK_SHEET', lengthM: 12, widthM: undefined, beamsSecondary: undefined },
        // Fully-empty row (all undefined) — must be dropped.
        { type: undefined, lengthM: undefined },
      ],
      // No extensions at all — the key must be omitted entirely.
      extensions: [],
    }

    const payload = buildMezzaninePayload(draft)

    expect(payload.floors).toEqual([{ code: 'MEZ_1', type: 'DECK_SHEET', lengthM: 12 }])
    expect('extensions' in payload).toBe(false)
  })

  it('returns an empty object for an empty draft', () => {
    expect(buildMezzaninePayload({ floors: [], extensions: [] })).toEqual({})
  })
})
