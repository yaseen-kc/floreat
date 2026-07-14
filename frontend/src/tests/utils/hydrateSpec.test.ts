import { describe, it, expect } from 'vitest'
import { mapSpecResponseToDraft } from '@/utils/hydrateSpec'
import type { Spec } from '@/api/quotation/spec/getSpec'

describe('mapSpecResponseToDraft', () => {
  it('maps a fully-populated spec response into a draft', () => {
    const response: Spec = {
      id: 's1', jobId: 'j1', createdAt: '', updatedAt: '',
      description: 'Structural steel',
      specifications: ['IS 2062', 'IS 800'],
      makeOrBrand: ['Tata', 'JSW'],
      yieldStrengthMpa: 345,
    }
    expect(mapSpecResponseToDraft(response)).toEqual({
      description: 'Structural steel',
      specifications: ['IS 2062', 'IS 800'],
      makeOrBrand: ['Tata', 'JSW'],
      yieldStrengthMpa: 345,
    })
  })

  it('collapses a blank description and preserves empty arrays', () => {
    const response = {
      id: 's1', jobId: 'j1', createdAt: '', updatedAt: '',
      description: '   ',
      specifications: [],
      makeOrBrand: [],
      yieldStrengthMpa: 250,
    } as unknown as Spec
    const draft = mapSpecResponseToDraft(response)
    expect(draft.description).toBeUndefined()
    expect(draft.specifications).toEqual([])
    expect(draft.makeOrBrand).toEqual([])
    expect(draft.yieldStrengthMpa).toBe(250)
  })
})
