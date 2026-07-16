import { describe, it, expect } from 'vitest'
import { STEPS, STEP_COUNT } from '@/components/quotation/steps'

describe('wizard steps registry', () => {
  it('registers Rate Master as the final (10th) step', () => {
    expect(STEP_COUNT).toBe(10)
    expect(STEPS[8]).toEqual({ label: 'Spec', sub: 'SPEC' })
    expect(STEPS[9]).toEqual({ label: 'Rate Master', sub: 'RATE' })
    expect(STEPS[7].label).toBe('Joint')
  })
})
