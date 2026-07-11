import { describe, it, expect } from 'vitest'
import { deriveSideColumnsWidthHeight } from '../../src/calc/roof.calc.js'

describe('deriveSideColumnsWidthHeight', () => {
  it('returns 0 when the cladding extension is 0', () => {
    expect(deriveSideColumnsWidthHeight({ eaveHeight: 6, roofSlope: 10, claddingExtensionWidthHeight: 0 })).toBe(0)
  })

  it('returns undefined while the cladding extension is blank', () => {
    expect(
      deriveSideColumnsWidthHeight({ eaveHeight: 6, roofSlope: 10, claddingExtensionWidthHeight: undefined }),
    ).toBeUndefined()
  })

  it('returns undefined while eaveHeight or roofSlope is blank', () => {
    expect(deriveSideColumnsWidthHeight({ roofSlope: 10, claddingExtensionWidthHeight: 1 })).toBeUndefined()
    expect(deriveSideColumnsWidthHeight({ eaveHeight: 6, claddingExtensionWidthHeight: 1 })).toBeUndefined()
  })

  it('computes eaveHeight − claddingExt × tan(roofSlope°), rounded to 3 decimals', () => {
    // 6 − 1 × tan(10°) = 6 − 0.176326... = 5.823673... → 5.824
    expect(deriveSideColumnsWidthHeight({ eaveHeight: 6, roofSlope: 10, claddingExtensionWidthHeight: 1 })).toBe(5.824)
  })

  it('clamps a negative result to 0', () => {
    // 1 − 5 × tan(45°) = 1 − 5 = −4 → clamped to 0
    expect(deriveSideColumnsWidthHeight({ eaveHeight: 1, roofSlope: 45, claddingExtensionWidthHeight: 5 })).toBe(0)
  })
})
