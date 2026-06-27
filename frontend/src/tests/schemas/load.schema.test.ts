import { describe, it, expect } from 'vitest'
import { createLoadSchema, updateLoadSchema } from '@/schemas/load.schema'

describe('createLoadSchema', () => {
  it('accepts an empty object (all fields optional — partial drafts allowed)', () => {
    expect(createLoadSchema.parse({})).toEqual({})
  })

  it('accepts valid load + completion-period values', () => {
    const input = {
      deadLoadOnRoofRafters: 0.5,
      approvalDrawingsTime: 2,
      approvalDrawingsUnit: 'WEEKS' as const,
    }
    expect(createLoadSchema.parse(input)).toEqual(input)
  })

  it('rejects a non-positive load value', () => {
    const result = createLoadSchema.safeParse({ snowLoad: -1 })
    expect(result.success).toBe(false)
  })

  it('rejects a non-integer completion-period value', () => {
    const result = createLoadSchema.safeParse({ supplyOfMaterialsDays: 3.5 })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown approval-drawings unit', () => {
    const result = createLoadSchema.safeParse({ approvalDrawingsUnit: 'YEARS' })
    expect(result.success).toBe(false)
  })

  it('updateLoadSchema also accepts an empty object', () => {
    expect(updateLoadSchema.parse({})).toEqual({})
  })
})
