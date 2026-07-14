import { describe, it, expect, beforeEach } from 'vitest'
import { useQuotationStore, buildSpecPayload } from '@/stores/quotation-store'
import { createSpecSchema } from '@/schemas/spec.schema'

describe('spec store draft', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('starts as an empty object and setSpec merges fields', () => {
    expect(useQuotationStore.getState().spec).toEqual({})
    useQuotationStore.getState().setSpec({ description: 'Steel' })
    useQuotationStore.getState().setSpec({ yieldStrengthMpa: 345 })
    expect(useQuotationStore.getState().spec).toEqual({ description: 'Steel', yieldStrengthMpa: 345 })
  })
})

describe('buildSpecPayload', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('returns an empty object for a fresh (untouched) draft', () => {
    expect(buildSpecPayload(useQuotationStore.getState().spec)).toEqual({})
  })

  it('keeps provided fields and drops blank ones', () => {
    useQuotationStore.getState().setSpec({
      description: 'Structural steel',
      specifications: ['IS 2062'],
      makeOrBrand: ['Tata'],
      yieldStrengthMpa: 345,
    })
    const payload = buildSpecPayload(useQuotationStore.getState().spec)
    expect(payload).toEqual({
      description: 'Structural steel',
      specifications: ['IS 2062'],
      makeOrBrand: ['Tata'],
      yieldStrengthMpa: 345,
    })
  })

  it('trims entries and drops blank lines / empty arrays', () => {
    useQuotationStore.getState().setSpec({
      description: '   ',
      specifications: ['  IS 2062  ', '', '   '],
      makeOrBrand: [],
    })
    const payload = buildSpecPayload(useQuotationStore.getState().spec)
    expect(payload).toEqual({ specifications: ['IS 2062'] })
    expect(payload).not.toHaveProperty('description')
    expect(payload).not.toHaveProperty('makeOrBrand')
    expect(payload).not.toHaveProperty('yieldStrengthMpa')
  })

  it('produces a payload that satisfies the create schema', () => {
    useQuotationStore.getState().setSpec({
      description: 'Structural steel',
      specifications: ['IS 2062', 'IS 800'],
      makeOrBrand: ['Tata', 'JSW'],
      yieldStrengthMpa: 345,
    })
    const payload = buildSpecPayload(useQuotationStore.getState().spec)
    expect(createSpecSchema.safeParse(payload).success).toBe(true)
  })
})
