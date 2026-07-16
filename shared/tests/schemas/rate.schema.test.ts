import { describe, it, expect } from 'vitest'
import { createRateSchema, updateRateSchema } from '../../src/schemas/rate.schema.js'

describe('createRateSchema', () => {
  it('accepts a minimal item + unit (pricing optional)', () => {
    expect(createRateSchema.safeParse({ item: 'RIDGE', unit: 'RM' }).success).toBe(true)
  })

  it('accepts a fully priced item', () => {
    const result = createRateSchema.safeParse({
      item: 'STEEL STRUCTURE',
      unit: 'KG',
      material: 63,
      marginPercentage: 15,
    })
    expect(result.success).toBe(true)
  })

  it('requires item', () => {
    expect(createRateSchema.safeParse({ unit: 'KG' }).success).toBe(false)
  })

  it('rejects a blank item', () => {
    expect(createRateSchema.safeParse({ item: '', unit: 'KG' }).success).toBe(false)
  })

  it('rejects an unknown unit', () => {
    expect(createRateSchema.safeParse({ item: 'X', unit: 'TON' }).success).toBe(false)
  })

  it('rejects negative pricing', () => {
    expect(createRateSchema.safeParse({ item: 'X', unit: 'KG', material: -1 }).success).toBe(false)
  })
})

describe('updateRateSchema', () => {
  it('accepts an empty object (all fields optional)', () => {
    expect(updateRateSchema.safeParse({}).success).toBe(true)
  })

  it('accepts a partial pricing update', () => {
    expect(updateRateSchema.safeParse({ marginPercentage: 20 }).success).toBe(true)
  })
})
