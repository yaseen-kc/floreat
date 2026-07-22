import { describe, it, expect } from 'vitest'
import { STEPS, STEP_COUNT } from '@/components/quotation/steps'

describe('wizard steps registry', () => {
  it('registers Quantity as the final (12th) step', () => {
    expect(STEP_COUNT).toBe(12)
    expect(STEPS[10]).toEqual({ label: 'Amount', sub: 'AMOUNT' })
    expect(STEPS[11]).toEqual({ label: 'Quantity', sub: 'QTY' })
    expect(STEPS[9].label).toBe('Rate Master')
  })
})
