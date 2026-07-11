import { describe, it, expect } from 'vitest'
import { num, int } from '../../src/units/index.js'

describe('num', () => {
  it('coerces a Decimal wire string to a number', () => {
    expect(num('12.500')).toBe(12.5)
  })

  it('maps null to undefined (kept out of payloads)', () => {
    expect(num(null)).toBeUndefined()
  })
})

describe('int', () => {
  it('passes a number through unchanged', () => {
    expect(int(7)).toBe(7)
  })

  it('maps null to undefined (kept out of payloads)', () => {
    expect(int(null)).toBeUndefined()
  })

  it('preserves zero', () => {
    expect(int(0)).toBe(0)
  })
})
