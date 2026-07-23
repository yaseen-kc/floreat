import { describe, it, expect, beforeEach } from 'vitest'
import { useQuotationStore, buildAccessoriesPayload } from '@/stores/quotation-store'
import { createAccessoriesSchema } from '@/schemas/accessories.schema'

describe('buildAccessoriesPayload', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('returns an empty object for a fresh (untouched) draft', () => {
    const payload = buildAccessoriesPayload(useQuotationStore.getState().accessories)
    expect(payload).toEqual({})
  })

  it('keeps provided scalar fields and drops blank (undefined) ones', () => {
    useQuotationStore.getState().setAccessories({ gutterType: 'PPGL', gutterSize: 'IN_6' })
    const payload = buildAccessoriesPayload(useQuotationStore.getState().accessories)
    expect(payload.gutterType).toBe('PPGL')
    expect(payload.gutterSize).toBe('IN_6')
    expect(payload).not.toHaveProperty('downTakeType')
  })

  it('drops a *Quantity value unless its *Manual flag is true', () => {
    // Non-manual: derived server-side, so the value is dropped.
    useQuotationStore.getState().setAccessories({ gutterQuantity: 200 })
    let payload = buildAccessoriesPayload(useQuotationStore.getState().accessories)
    expect(payload).not.toHaveProperty('gutterQuantity')

    // Manual override: the value is kept alongside the flag.
    useQuotationStore.getState().setAccessories({ gutterQuantity: 200, gutterQuantityManual: true })
    payload = buildAccessoriesPayload(useQuotationStore.getState().accessories)
    expect(payload.gutterQuantity).toBe(200)
    expect(payload.gutterQuantityManual).toBe(true)
  })

  it('preserves line-item scalar fields', () => {
    useQuotationStore.getState().setAccessories({
      doorHeight: 2.1, doorWidth: 0.9, doorNos: 3,
    })
    const payload = buildAccessoriesPayload(useQuotationStore.getState().accessories)
    expect(payload.doorHeight).toEqual(2.1)
    expect(payload.doorWidth).toEqual(0.9)
    expect(payload.doorNos).toEqual(3)
  })


  it('produces a payload that satisfies the create schema', () => {
    useQuotationStore.getState().setAccessories({
      gutterType: 'PPGL',
      partitionQuantity: 4,
      doorHeight: 2.1, doorWidth: 0.9, doorNos: 3,
      rollingShutterLength: 3, rollingShutterWidth: 3, rollingShutterNos: 1,
    })
    const payload = buildAccessoriesPayload(useQuotationStore.getState().accessories)
    expect(createAccessoriesSchema.safeParse(payload).success).toBe(true)
  })
})
