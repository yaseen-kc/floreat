import { describe, it, expect } from 'vitest'
import { deriveRateBreakdown } from '../../src/calc/rate.calc.js'

describe('deriveRateBreakdown', () => {
  it('computes the four rates for the STEEL STRUCTURE reference pricing', () => {
    // material 63, fabrication 15, transportation 1.5, installation 8,
    // loadingUnloading 3, overheads 0, others 0, margin 15% → mult 1.15
    const result = deriveRateBreakdown({
      material: 63,
      fabrication: 15,
      transportation: 1.5,
      installation: 8,
      loadingUnloading: 3,
      overheads: 0,
      others: 0,
      marginPercentage: 15,
    })

    // fabricationRate = ceil((63+15+1.5)*1.15 + 0 + 0) = ceil(91.425) = 92
    expect(result.fabricationRate).toBe(92)
    // erectionRate = ceil(8*1.15) = ceil(9.2) = 10
    expect(result.erectionRate).toBe(10)
    // loadingRate = ceil(3) = 3
    expect(result.loadingRate).toBe(3)
    // totalRate = 92 + 10 + 3 = 105
    expect(result.totalRate).toBe(105)
  })

  it('treats an all-blank pricing object as zeroes', () => {
    expect(deriveRateBreakdown({})).toEqual({
      fabricationRate: 0,
      erectionRate: 0,
      loadingRate: 0,
      totalRate: 0,
    })
  })

  it('defaults margin to a 1.0 multiplier when marginPercentage is absent', () => {
    const result = deriveRateBreakdown({ material: 10, installation: 5, loadingUnloading: 2 })
    // no margin → mult 1: fabricationRate = ceil(10) = 10, erectionRate = ceil(5) = 5, loading = 2
    expect(result).toEqual({ fabricationRate: 10, erectionRate: 5, loadingRate: 2, totalRate: 17 })
  })

  it('folds overheads and others into the fabrication rate after the margin', () => {
    const result = deriveRateBreakdown({ material: 100, overheads: 5, others: 3, marginPercentage: 0 })
    // ceil(100*1 + 5 + 3) = 108
    expect(result.fabricationRate).toBe(108)
  })
})
