import { describe, it, expect } from 'vitest'
import { STEPS, STEP_COUNT } from '@/components/quotation/steps'

describe('wizard steps registry', () => {
  it('registers Quantity, Amount then Quotation in the final three steps', () => {
    expect(STEP_COUNT).toBe(13)
    expect(STEPS[10]).toEqual({ label: 'Quantity', sub: 'QTY' })
    expect(STEPS[11]).toEqual({ label: 'Amount', sub: 'AMOUNT' })
    expect(STEPS[12]).toEqual({ label: 'Quotation', sub: 'QUOTE' })
    expect(STEPS[9].label).toBe('Rate Master')
  })
})
