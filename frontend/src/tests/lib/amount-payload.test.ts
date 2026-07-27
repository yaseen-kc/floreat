import { describe, it, expect } from 'vitest'
import { buildAmountPayload, ITEM_PREFIX_MAP } from '@/lib/amount-payload'
import { calculateAmountQuantities } from '@floreat/shared/calc'
import type { Rate } from '@/api/quotation/rate/getRate'

describe('amount-payload', () => {
  it('maps all 36 items into flat schema properties', () => {
    const calc = calculateAmountQuantities({})
    const rateMap = new Map<string, Rate>()
    const payload = buildAmountPayload(calc, rateMap)

    expect(Object.keys(ITEM_PREFIX_MAP).length).toBe(36)
    expect(payload.steelStructuresQuantity).toBeDefined()
    expect(payload.steelStructuresFabricationRate).toBeDefined()
    expect(payload.steelStructuresErrectionRate).toBeDefined()
    expect(payload.steelStructuresLoadingRate).toBeDefined()
    expect(payload.steelStructuresFabricationAmount).toBeDefined()
    expect(payload.steelStructuresErrectionAmount).toBeDefined()
    expect(payload.steelStructuresLoadingAmount).toBeDefined()
  })

  it('calculates fabrication, erection, and loading amounts based on rates', () => {
    const calc = calculateAmountQuantities({})
    calc.steelStructuresQuantity = 100

    const mockRate = {
      id: 'r-1',
      item: 'STEEL STRUCTURE',
      unit: 'KG',
      fabricationRate: 10,
      erectionRate: 5,
      loadingRate: 2,
      totalRate: 17,
      createdAt: '',
      updatedAt: '',
    } as Rate

    const rateMap = new Map<string, Rate>([['STEEL STRUCTURE', mockRate]])
    const payload = buildAmountPayload(calc, rateMap)

    expect(payload.steelStructuresQuantity).toBe(100)
    expect(payload.steelStructuresFabricationRate).toBe(10)
    expect(payload.steelStructuresErrectionRate).toBe(5)
    expect(payload.steelStructuresLoadingRate).toBe(2)
    expect(payload.steelStructuresFabricationAmount).toBe(1000)
    expect(payload.steelStructuresErrectionAmount).toBe(500)
    expect(payload.steelStructuresLoadingAmount).toBe(200)
  })
})
