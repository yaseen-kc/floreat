import { describe, it, expect, beforeEach } from 'vitest'
import {
  buildMezzaninePayload,
  useQuotationStore,
  type MezzanineDraft,
} from '@/stores/quotation-store'

describe('buildMezzaninePayload', () => {
  it('drops undefined fields and fully-empty rows, and omits empty arrays', () => {
    const draft: MezzanineDraft = {
      floors: [
        // A real floor: code + a couple of populated fields, the rest undefined.
        { code: 'MEZ-1', type: 'DECK_SHEET', lengthM: 12, widthM: undefined, beamsSecondary: undefined },
        // Fully-empty row (all undefined) — must be dropped.
        { type: undefined, lengthM: undefined },
      ],
      // No extensions at all — the key must be omitted entirely.
      extensions: [],
    }

    const payload = buildMezzaninePayload(draft)

    expect(payload.floors).toEqual([{ code: 'MEZ-1', type: 'DECK_SHEET', lengthM: 12 }])
    expect('extensions' in payload).toBe(false)
  })

  it('returns an empty object for an empty draft', () => {
    expect(buildMezzaninePayload({ floors: [], extensions: [] })).toEqual({})
  })
})

describe('setHasMezzanine', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('clears floors and extensions when toggled off', () => {
    const { setMezzanine, setHasMezzanine } = useQuotationStore.getState()
    setHasMezzanine(true)
    setMezzanine({ floors: [{ code: 'MEZ-1' }], extensions: [{ type: 'PANEL' }] })
    expect(useQuotationStore.getState().mezzanine.floors).toHaveLength(1)

    setHasMezzanine(false)
    const s = useQuotationStore.getState()
    expect(s.hasMezzanine).toBe(false)
    expect(s.mezzanine).toEqual({ floors: [], extensions: [] })
  })
})
