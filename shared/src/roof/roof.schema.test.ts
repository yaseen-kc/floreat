import { describe, it, expect } from 'vitest'
import { createRoofSchema, updateRoofSchema } from './roof.schema.js'

/** Minimal valid core payload (only the required dimensions). */
const validCore = {
  buildingOverallLength: 30,
  buildingOverallWidth: 15,
  eaveHeight: 5.645,
  roofSlope: 6,
  mainRoofFrames: 4,
  endRoofFrames: 2,
  roofPurlinSpacing: 1.27,
  claddingPurlins: 2,
  internalColumnsForMainRoofFrames: 2,
  internalColumnsForEndRoofFrames: 2,
  roofFrameBaseFixing: 'FOUNDATION_BOLT' as const,
}

describe('shared roof.schema', () => {
  it('accepts a valid core payload (sections optional)', () => {
    expect(createRoofSchema.safeParse(validCore).success).toBe(true)
  })

  it('rejects a payload missing a required core field', () => {
    const { eaveHeight, ...missing } = validCore
    expect(createRoofSchema.safeParse(missing).success).toBe(false)
  })

  it('rejects a non-positive core dimension', () => {
    expect(createRoofSchema.safeParse({ ...validCore, roofSlope: -1 }).success).toBe(false)
  })

  it('rejects an unknown roofFrameBaseFixing enum value', () => {
    expect(createRoofSchema.safeParse({ ...validCore, roofFrameBaseFixing: 'NOPE' }).success).toBe(false)
  })

  it('treats sideColumnsWidthHeight as optional (derived) and accepts 0', () => {
    expect(createRoofSchema.safeParse({ ...validCore, sideColumnsWidthHeight: 0 }).success).toBe(true)
    expect(createRoofSchema.safeParse(validCore).success).toBe(true)
  })

  it('updateRoofSchema is fully partial (empty object is valid)', () => {
    expect(updateRoofSchema.safeParse({}).success).toBe(true)
  })
})
