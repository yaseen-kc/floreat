import { describe, it, expect } from 'vitest'
import { createSpecSchema } from '../../src/schemas/spec.schema.js'

describe('createSpecSchema', () => {
  it('accepts an empty object (products optional)', () => {
    expect(createSpecSchema.safeParse({}).success).toBe(true)
  })

  it('parses a products array', () => {
    const result = createSpecSchema.safeParse({
      products: [{ description: 'Beam', yieldStrengthMpa: 350 }],
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.products).toHaveLength(1)
  })

  it('rejects blank string fields (min(1))', () => {
    expect(createSpecSchema.safeParse({ products: [{ description: '' }] }).success).toBe(false)
  })

  it('rejects a non-positive yield strength', () => {
    expect(createSpecSchema.safeParse({ products: [{ yieldStrengthMpa: 0 }] }).success).toBe(false)
  })
})
