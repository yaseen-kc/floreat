import { describe, it, expect, beforeEach } from 'vitest'
import { useQuotationStore, buildLoadPayload } from '@/stores/quotation-store'
import { createLoadSchema } from '@/schemas/load.schema'

describe('buildLoadPayload', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('returns an empty object for a fresh (untouched) draft', () => {
    const payload = buildLoadPayload(useQuotationStore.getState().load)
    expect(payload).toEqual({})
  })

  it('keeps provided fields and drops blank (undefined) ones', () => {
    useQuotationStore.getState().setLoad({ snowLoad: 1.2, approvalDrawingsUnit: 'WEEKS' })
    const payload = buildLoadPayload(useQuotationStore.getState().load)
    expect(payload.snowLoad).toBe(1.2)
    expect(payload.approvalDrawingsUnit).toBe('WEEKS')
    expect(payload).not.toHaveProperty('windLoadHorizontal')
    expect(payload).not.toHaveProperty('supplyOfMaterialsDays')
  })

  it('drops a field that is cleared back to undefined', () => {
    useQuotationStore.getState().setLoad({ floorLiveLoad: 3 })
    useQuotationStore.getState().setLoad({ floorLiveLoad: undefined })
    const payload = buildLoadPayload(useQuotationStore.getState().load)
    expect(payload).not.toHaveProperty('floorLiveLoad')
  })

  it('produces a payload that satisfies the create schema', () => {
    useQuotationStore.getState().setLoad({
      deadLoadOnRoofRafters: 0.5,
      windLoadHorizontal: 150,
      approvalDrawingsTime: 2,
      approvalDrawingsUnit: 'WEEKS',
      supplyOfMaterialsDays: 30,
      erectionOfStructureDays: 15,
    })
    const payload = buildLoadPayload(useQuotationStore.getState().load)
    expect(createLoadSchema.safeParse(payload).success).toBe(true)
  })
})
