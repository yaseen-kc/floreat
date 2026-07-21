import { describe, it, expect } from 'vitest'
import { qtyN5SteelStructures } from '../../src/calc/amount.calc.js'

// The full sample-job oracle (19909.19607646245) requires the companion
// AMOUNT_N5_N40_schema_fields.md dataset, which isn't available yet — these
// tests isolate each of the equation's 5 additive terms with hand-computable
// inputs instead, so every term is verified independently.

describe('qtyN5SteelStructures', () => {
  it('returns 0 when every input is blank', () => {
    expect(qtyN5SteelStructures({})).toBe(0)
  })

  it('computes the roof term alone', () => {
    // L=10, W=10, S=0° (cos=1), mcPurlin=1 → 10 * (10/1/2 + 0.14) * 2 * 10.76 * 1
    const result = qtyN5SteelStructures({
      buildingOverallLength: 10,
      buildingOverallWidth: 10,
      roofSlope: 0,
      materialConsumptionExcludingPurlin: 1,
    })
    expect(result).toBeCloseTo(1106.128, 6)
  })

  it('computes the canopy term alone', () => {
    // 4 * 5 * 2 * 10.76 = 430.4
    const result = qtyN5SteelStructures({
      canopy0Length: 4,
      canopy0Width: 5,
      canopy0MaterialConsumptionKgPerSqft: 2,
    })
    expect(result).toBeCloseTo(430.4, 6)
  })

  it('computes the mezzanine term alone, subtracting stair area and deductions', () => {
    // (mez0L*mez0W - ad0Area*ad0Numbers - stair0L*stair0W + mez1L*mez1W) * mez0Mc * 10.76
    // (10*8 - 2*3 - 3*2 + 6*6) * 1.5 * 10.76 = (80 - 6 - 6 + 36) * 1.5 * 10.76 = 104 * 16.14 = 1678.56
    const result = qtyN5SteelStructures({
      mez0LengthM: 10,
      mez0WidthM: 8,
      mez0MaterialConsumptionKgPerSqft: 1.5,
      mez1LengthM: 6,
      mez1WidthM: 6,
      areaDeduction0AreaM2: 2,
      areaDeduction0Numbers: 3,
      stair0Length: 3,
      stair0Width: 2,
    })
    expect(result).toBeCloseTo(1678.56, 6)
  })

  it('computes the stair step term alone', () => {
    // stair0H/0.15 * stair0W/2 * 0.006 * 0.45 * 7850
    // 4.5/0.15 * 1.2/2 * 0.006 * 0.45 * 7850 = 30 * 0.6 * 21.195 = 381.51
    const result = qtyN5SteelStructures({ stair0Height: 4.5, stair0Width: 1.2 })
    expect(result).toBeCloseTo(381.51, 6)
  })

  it('computes the stair stringer term alone', () => {
    // H=3, nml=1, L=5, unitWeight=10:
    // (sqrt((3/2)^2 + (5-2)^2) + 2 + 1) * (2 + 1*2) * 10
    // = (sqrt(2.25+9) + 3) * 4 * 10 = (3.354101966... + 3) * 40 = 254.1640786...
    const result = qtyN5SteelStructures({
      stair0Height: 3,
      stair0NumberOfMidLanding: 1,
      stair0Length: 5,
      stair0UnitWeightOfStringer: 10,
    })
    expect(result).toBeCloseTo(254.1640786499874, 6)
  })
})

