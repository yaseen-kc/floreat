import { describe, it, expect, beforeEach } from 'vitest'
import { useQuotationStore, buildRoofPayload } from '@/stores/quotation-store'
import { validRoofDraft } from '@/tests/fixtures/roof'

describe('setRoof derives sideColumnsWidthHeight', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('computes the value from eaveHeight, roofSlope and claddingExtensionWidthHeight', () => {
    useQuotationStore.getState().setRoof({ eaveHeight: 6, roofSlope: 10, claddingExtensionWidthHeight: 1 })
    // 6 − 1 × tan(10°) = 5.823673... → 5.824
    expect(useQuotationStore.getState().roof.sideColumnsWidthHeight).toBe(5.824)
  })

  it('ignores any caller-supplied value and recomputes', () => {
    useQuotationStore.getState().setRoof({
      eaveHeight: 6,
      roofSlope: 10,
      claddingExtensionWidthHeight: 1,
      sideColumnsWidthHeight: 999,
    })
    expect(useQuotationStore.getState().roof.sideColumnsWidthHeight).toBe(5.824)
  })

  it('recomputes live when the cladding extension changes', () => {
    useQuotationStore.getState().setRoof({ eaveHeight: 6, roofSlope: 10, claddingExtensionWidthHeight: 1 })
    useQuotationStore.getState().setRoof({ claddingExtensionWidthHeight: 0 })
    expect(useQuotationStore.getState().roof.sideColumnsWidthHeight).toBe(0)
  })

  it('keeps the derived value out of the built payload (the backend recomputes it)', () => {
    useQuotationStore.getState().setRoof(validRoofDraft)
    const payload = buildRoofPayload(useQuotationStore.getState().roof)
    // validRoofDraft: eave 6, slope 10, cladding 1 → 5.824 preview, but the
    // payload omits it so the server stays the source of truth.
    expect(payload).not.toHaveProperty('sideColumnsWidthHeight')
    expect(useQuotationStore.getState().roof.sideColumnsWidthHeight).toBe(5.824)
  })
})
