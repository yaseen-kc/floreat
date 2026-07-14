import { describe, it, expect } from 'vitest'
import { STEPS, STEP_COUNT } from '@/components/quotation/steps'

describe('wizard steps registry', () => {
  it('registers Spec as the final (9th) step', () => {
    expect(STEP_COUNT).toBe(9)
    expect(STEPS[8]).toEqual({ label: 'Spec', sub: 'SPEC' })
    expect(STEPS[7].label).toBe('Joint')
  })
})
