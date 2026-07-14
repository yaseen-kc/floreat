import { describe, it, expect } from 'vitest'
import { mapSpecResponseToDraft } from '@/utils/hydrateSpec'
import type { Spec } from '@/api/quotation/spec/getSpec'

describe('mapSpecResponseToDraft', () => {
  it('maps a populated products array into draft rows', () => {
    const response: Spec = {
      id: 's1', jobId: 'j1', createdAt: '', updatedAt: '',
      products: [
        { id: 'p1', code: 'PRODUCT-1', description: 'Structural steel', specification: 'IS 2062', makeOrBrand: 'Tata', yieldStrengthMpa: 345 },
        { id: 'p2', code: 'PRODUCT-2', description: 'Roofing sheet', specification: null, makeOrBrand: 'JSW', yieldStrengthMpa: null },
      ],
    }
    expect(mapSpecResponseToDraft(response)).toEqual({
      products: [
        { code: 'PRODUCT-1', description: 'Structural steel', specification: 'IS 2062', makeOrBrand: 'Tata', yieldStrengthMpa: 345 },
        { code: 'PRODUCT-2', description: 'Roofing sheet', specification: undefined, makeOrBrand: 'JSW', yieldStrengthMpa: undefined },
      ],
    })
  })

  it('collapses blank strings to undefined', () => {
    const response = {
      id: 's1', jobId: 'j1', createdAt: '', updatedAt: '',
      products: [{ id: 'p1', code: null, description: '   ', specification: null, makeOrBrand: null, yieldStrengthMpa: 250 }],
    } as unknown as Spec
    const draft = mapSpecResponseToDraft(response)
    expect(draft.products[0].description).toBeUndefined()
    expect(draft.products[0].code).toBeUndefined()
    expect(draft.products[0].yieldStrengthMpa).toBe(250)
  })

  it('yields an empty table when products is absent', () => {
    const response = { id: 's1', jobId: 'j1', createdAt: '', updatedAt: '' } as unknown as Spec
    expect(mapSpecResponseToDraft(response)).toEqual({ products: [] })
  })
})
