import { describe, it, expect } from 'vitest'
import { deriveSideColumnsWidthHeight } from './roof.calc.js'

describe('deriveSideColumnsWidthHeight', () => {
  it('returns undefined when any input is missing', () => {
    expect(deriveSideColumnsWidthHeight({ eaveHeight: 6, roofSlope: 10 })).toBeUndefined()
    expect(
      deriveSideColumnsWidthHeight({ eaveHeight: 6, claddingExtensionWidthHeight: 1 }),
    ).toBeUndefined()
    expect(
      deriveSideColumnsWidthHeight({ roofSlope: 10, claddingExtensionWidthHeight: 1 }),
    ).toBeUndefined()
  })

  it('returns 0 when the cladding extension is 0', () => {
    expect(
      deriveSideColumnsWidthHeight({ eaveHeight: 6, roofSlope: 10, claddingExtensionWidthHeight: 0 }),
    ).toBe(0)
  })

  it('computes eave − ext·tan(slope), rounded to 3 decimals', () => {
    // 6 − 1·tan(10°) = 6 − 0.17632698… = 5.82367… → 5.824
    expect(
      deriveSideColumnsWidthHeight({ eaveHeight: 6, roofSlope: 10, claddingExtensionWidthHeight: 1 }),
    ).toBe(5.824)
  })

  it('clamps a negative result to 0', () => {
    // tall extension + steep slope drives the raw value below 0
    expect(
      deriveSideColumnsWidthHeight({ eaveHeight: 1, roofSlope: 45, claddingExtensionWidthHeight: 5 }),
    ).toBe(0)
  })
})
