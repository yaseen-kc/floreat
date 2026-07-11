import { describe, it, expect } from 'vitest'
import { deriveAccessoryQuantities, deriveLineItemQuantity } from '../../src/calc/accessories.calc.js'

/** Sample roof mirroring the backend factory (L=30, W=15, H=5.645, S=6°, MF=4, EF=2). */
const sampleRoof = {
  buildingOverallLength: 30,
  buildingOverallWidth: 15,
  eaveHeight: 5.645,
  roofSlope: 6,
  mainRoofFrames: 4,
  endRoofFrames: 2,
}

describe('deriveAccessoryQuantities', () => {
  it('computes gutter, downTake, dripTrim, gableEnd and ridge from core roof dims', () => {
    const q = deriveAccessoryQuantities(sampleRoof)
    expect(q.gutterQuantity).toBe(60) // 2 × 30
    expect(q.downTakeQuantity).toBe(33.87) // (4 + 2) × 5.645
    expect(q.dripTrimQuantity).toBe(90) // 2 × (30 + 15 + 0)  (AQ19 = 0)
    // 2 × (15 / cos(6°) + 0.14) + 2 × (0 / cos(6°) + 0.14) = 30.725
    expect(q.gableEndFlashingQuantity).toBe(30.725)
    expect(q.ridgeQuantity).toBe(30) // buildingOverallLength
  })

  it('adds the roof extension term to gable end flashing', () => {
    // second term becomes 2 × (2 / cos(6°) + 0.14)
    const q = deriveAccessoryQuantities({ ...sampleRoof, roofExtensionWidthHeight: 2 })
    const cos = Math.cos((6 * Math.PI) / 180)
    const expected = Math.round((2 * (15 / cos + 0.14) + 2 * (2 / cos + 0.14)) * 1000) / 1000
    expect(q.gableEndFlashingQuantity).toBe(expected)
  })

  it('corner flash: cladding extension 0 → 4 × (eaveHeight − frontHeight)', () => {
    const q = deriveAccessoryQuantities({
      ...sampleRoof,
      claddingExtensionWidthHeight: 0,
      frontSideWallHeight: 3.5,
      leftSideWallHeight: 3.5,
    })
    expect(q.cornerFlashQuantity).toBe(8.58) // 4 × (5.645 − 3.5)
  })

  it('corner flash: cladding extension present → 2 × ((eave − front) + (sideCols − left))', () => {
    const q = deriveAccessoryQuantities({
      eaveHeight: 6,
      claddingExtensionWidthHeight: 1,
      sideColumnsWidthHeight: 5,
      frontSideWallHeight: 3.5,
      leftSideWallHeight: 3.5,
    })
    expect(q.cornerFlashQuantity).toBe(8) // 2 × ((6−3.5) + (5−3.5))
  })

  it('corner flash: cladding extension present but sideCols 0 → column term drops to 0', () => {
    const q = deriveAccessoryQuantities({
      eaveHeight: 6,
      claddingExtensionWidthHeight: 1,
      sideColumnsWidthHeight: 0,
      frontSideWallHeight: 3.5,
      leftSideWallHeight: 3.5,
    })
    expect(q.cornerFlashQuantity).toBe(5) // 2 × ((6−3.5) + 0)
  })

  it('corner flash is undefined unless BOTH front and left sidewall heights exist', () => {
    expect(deriveAccessoryQuantities({ ...sampleRoof, frontSideWallHeight: 3.5 }).cornerFlashQuantity).toBeUndefined()
    expect(deriveAccessoryQuantities({ ...sampleRoof, leftSideWallHeight: 3.5 }).cornerFlashQuantity).toBeUndefined()
    expect(deriveAccessoryQuantities(sampleRoof).cornerFlashQuantity).toBeUndefined()
  })
})

describe('deriveLineItemQuantity', () => {
  it('multiplies the two dimensions by the unit count, rounded to 3 dp', () => {
    expect(deriveLineItemQuantity(2.1, 1.2, 2)).toBe(5.04) // door: height × width × nos
    expect(deriveLineItemQuantity(3, 3, 1)).toBe(9) // opening: length × width × nos
    expect(deriveLineItemQuantity(1.234, 1, 1)).toBe(1.234)
  })

  it('returns undefined when any input is blank', () => {
    expect(deriveLineItemQuantity(undefined, 1.2, 2)).toBeUndefined()
    expect(deriveLineItemQuantity(2.1, undefined, 2)).toBeUndefined()
    expect(deriveLineItemQuantity(2.1, 1.2, undefined)).toBeUndefined()
  })
})
