import { describe, it, expect, beforeEach } from 'vitest'
import { useQuotationStore, buildSpecPayload, DEFAULT_SPEC_PRODUCTS } from '@/stores/quotation-store'
import { createSpecSchema } from '@/schemas/spec.schema'

describe('spec store draft', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('starts with the seeded default products and setSpec replaces products', () => {
    expect(useQuotationStore.getState().spec).toEqual({
      products: DEFAULT_SPEC_PRODUCTS.map((product, index) => ({
        code: `PRODUCT-${index + 1}`,
        ...product,
      })),
    })
    useQuotationStore.getState().setSpec({ products: [{ description: 'Steel' }] })
    expect(useQuotationStore.getState().spec).toEqual({ products: [{ description: 'Steel' }] })
  })
})

describe('buildSpecPayload', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('returns the seeded default rows for a fresh (untouched) draft', () => {
    expect(buildSpecPayload(useQuotationStore.getState().spec)).toEqual({
      products: DEFAULT_SPEC_PRODUCTS.map((product, index) => ({
        code: `PRODUCT-${index + 1}`,
        ...product,
      })),
    })
  })

  it('compacts each product row and renumbers PRODUCT-n by position', () => {
    useQuotationStore.getState().setSpec({
      products: [
        { description: 'Structural steel', specification: 'IS 2062', makeOrBrand: 'Tata', yieldStrengthMpa: 345 },
        { description: 'Purlins' },
      ],
    })
    const payload = buildSpecPayload(useQuotationStore.getState().spec)
    expect(payload).toEqual({
      products: [
        { code: 'PRODUCT-1', description: 'Structural steel', specification: 'IS 2062', makeOrBrand: 'Tata', yieldStrengthMpa: 345 },
        { code: 'PRODUCT-2', description: 'Purlins' },
      ],
    })
  })

  it('drops fully-empty rows and omits products entirely when none remain', () => {
    useQuotationStore.getState().setSpec({ products: [{}, { code: 'PRODUCT-9' }] })
    expect(buildSpecPayload(useQuotationStore.getState().spec)).toEqual({})
  })

  it('produces a payload that satisfies the create schema', () => {
    useQuotationStore.getState().setSpec({
      products: [
        { description: 'Structural steel', specification: 'IS 2062', makeOrBrand: 'Tata', yieldStrengthMpa: 345 },
        { description: 'Roofing sheet', makeOrBrand: 'JSW' },
      ],
    })
    const payload = buildSpecPayload(useQuotationStore.getState().spec)
    expect(createSpecSchema.safeParse(payload).success).toBe(true)
  })
})
