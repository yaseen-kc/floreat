import { describe, it, expect } from 'vitest'
import { createRoofSchema, sidewallSchema, isRequired, getFieldErrors } from '@/schemas/roof.schema'
import type { CreateRoofInput, RoofField } from '@/schemas/roof.schema'

/** The minimal set of required fields the backend `createRoofSchema` enforces. */
const minimalRoof: CreateRoofInput = {
  buildingOverallLength: 100,
  buildingOverallWidth: 50,
  eaveHeight: 6,
  roofSlope: 10,
  mainRoofFrames: 5,
  endRoofFrames: 2,
  roofPurlinSpacing: 1.5,
  claddingPurlins: 4,
  internalColumnsForMainRoofFrames: 0,
  internalColumnsForEndRoofFrames: 0,
  roofFrameBaseFixing: 'FOUNDATION_BOLT',
}

describe('createRoofSchema', () => {
  it('accepts a minimal required-only payload', () => {
    const result = createRoofSchema.safeParse(minimalRoof)
    expect(result.success).toBe(true)
  })

  it('accepts a full payload with optional sections and inline sidewalls', () => {
    const full: CreateRoofInput = {
      ...minimalRoof,
      columnSegmentsInMainFrame: 2,
      roofPurlinType: 'Z_C',
      roofPurlinDepth: 0.2,
      roofCoveringType: 'PPGL',
      windBracingType: 'ROD',
      gradeOfPlateMaterial: 'FE_345',
      sidewalls: [
        { side: 'FRONT', wallType: 'BRICK', thickness: 0.23, height: 3 },
        { side: 'BACK', wallType: 'PANEL', thickness: 0.1, height: 4 },
      ],
    }
    const result = createRoofSchema.safeParse(full)
    expect(result.success).toBe(true)
  })

  it('rejects a payload missing a required field (eaveHeight)', () => {
    const { eaveHeight: _omitted, ...withoutEaveHeight } = minimalRoof
    const result = createRoofSchema.safeParse(withoutEaveHeight)
    expect(result.success).toBe(false)
  })

  it('rejects an invalid enum value for roofFrameBaseFixing', () => {
    const result = createRoofSchema.safeParse({
      ...minimalRoof,
      roofFrameBaseFixing: 'NOT_A_REAL_FIXING',
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-positive required dimensions', () => {
    const result = createRoofSchema.safeParse({ ...minimalRoof, buildingOverallLength: 0 })
    expect(result.success).toBe(false)
  })
})

describe('sidewallSchema', () => {
  it('accepts a well-formed sidewall entry', () => {
    const result = sidewallSchema.safeParse({
      side: 'LEFT',
      wallType: 'AAC',
      thickness: 0.2,
      height: 3.5,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a sidewall with a non-positive height', () => {
    const result = sidewallSchema.safeParse({
      side: 'LEFT',
      wallType: 'AAC',
      thickness: 0.2,
      height: 0,
    })
    expect(result.success).toBe(false)
  })

  it('rejects a sidewall with an invalid side', () => {
    const result = sidewallSchema.safeParse({
      side: 'TOP',
      wallType: 'AAC',
      thickness: 0.2,
      height: 3,
    })
    expect(result.success).toBe(false)
  })
})

/** The 11 required core dimensions (roof.schema.ts lines 60–71). */
const CORE_FIELDS: RoofField[] = [
  'buildingOverallLength',
  'buildingOverallWidth',
  'eaveHeight',
  'roofSlope',
  'mainRoofFrames',
  'endRoofFrames',
  'roofPurlinSpacing',
  'claddingPurlins',
  'internalColumnsForMainRoofFrames',
  'internalColumnsForEndRoofFrames',
  'roofFrameBaseFixing',
]

describe('isRequired', () => {
  it('reports every core dimension as required', () => {
    for (const field of CORE_FIELDS) {
      expect(isRequired(field)).toBe(true)
    }
  })

  it('reports optional section fields as not required', () => {
    expect(isRequired('roofPurlinDepth')).toBe(false)
    expect(isRequired('windBracingType')).toBe(false)
    expect(isRequired('sidewalls')).toBe(false)
  })
})

describe('getFieldErrors', () => {
  it('returns no errors for a valid core payload', () => {
    expect(getFieldErrors(minimalRoof)).toEqual({})
  })

  it('flags every core field when given an empty object', () => {
    const errors = getFieldErrors({})
    for (const field of CORE_FIELDS) {
      expect(errors[field]).toBeDefined()
    }
  })

  it('flags a non-positive core dimension', () => {
    const errors = getFieldErrors({ ...minimalRoof, eaveHeight: 0 })
    expect(errors.eaveHeight).toBeDefined()
  })

  it('does not flag optional fields that are absent', () => {
    const errors = getFieldErrors(minimalRoof)
    expect(errors.roofPurlinDepth).toBeUndefined()
  })
})
