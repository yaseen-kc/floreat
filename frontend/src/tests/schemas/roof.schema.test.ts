import { describe, it, expect } from 'vitest'
import { createRoofSchema, sidewallSchema, isRequired, getFieldErrors } from '@/schemas/roof.schema'
import type { CreateRoofInput, RoofField } from '@/schemas/roof.schema'

/** Returns a shallow copy of `obj` without `key` (used to build invalid payloads). */
function omit<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const clone = { ...obj }
  delete (clone as Record<string, unknown>)[key as string]
  return clone
}

/**
 * Every field the (frontend-stricter) `createRoofSchema` now requires: the core
 * dimensions plus all structural section fields. Fascia Board fields and the
 * inline `sidewalls` array remain optional and are deliberately omitted.
 */
const requiredRoof: CreateRoofInput = {
  // core dimensions
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
  // members
  columnSegmentsInMainFrame: 2,
  raftersInOneHalfOfMainFrame: 2,
  columnSegmentsInEndFrame: 1,
  raftersInOneHalfOfEndFrame: 1,
  endFrameHorizontalTieBeam: 1,
  // purlins
  roofPurlinType: 'Z_C',
  roofPurlinDepth: 150,
  roofPurlinUnitWeight: 5,
  claddingPurlinType: 'TUBE',
  claddingPurlinDepth: 120,
  claddingPurlinUnitWeight: 4,
  // coverings
  roofCoveringType: 'PPGL',
  roofCoveringThickness: 0.5,
  claddingCoveringType: 'BARE_GALVALUME',
  claddingCoveringThickness: 0.4,
  roofAreaDeduction: 0,
  // flange brace
  roofFlangeBraceAverageLength: 1.2,
  claddingFlangeBraceAverageLength: 1.1,
  endFrameFlangeBraceAverageLength: 1,
  // polycarbonate
  polycarbonateRoofLength: 3,
  polycarbonateRoofWidth: 1,
  polycarbonateRoofCount: 2,
  // wind bracing
  roofWindBracingSegmentsInOneHalf: 2,
  columnWindBracingSegments: 2,
  roofWindBracingProvidedBays: 1,
  columnWindBracingProvidedBays: 1,
  windBracingColumnHeight: 6,
  windBracingUnitWeight: 3,
  roofWindBracingBaySpacing: 5,
  columnWindBracingBaySpacing: 5,
  roofWindBracingLength: 7,
  columnWindBracingLength: 6,
  windBracingType: 'ROD',
  // cladding openings
  frontCladdingOpeningArea: 0,
  backCladdingOpeningArea: 0,
  rightCladdingOpeningArea: 0,
  leftCladdingOpeningArea: 0,
  // side extension
  roofExtensionWidthHeight: 1,
  roofExtensionMidFrameCount: 1,
  roofExtensionEndFrameCount: 1,
  claddingExtensionWidthHeight: 1,
  claddingExtensionMidFrameCount: 1,
  claddingExtensionEndFrameCount: 1,
  sideColumnsWidthHeight: 1,
  sideColumnsMidFrameCount: 1,
  sideColumnsEndFrameCount: 1,
  // material grade
  gradeOfPlateMaterial: 'FE_345',
  // material consumption
  materialConsumptionExcludingPurlin: 12.5,
  // SAG rod
  DiaOfRoofSagRod: 12,
  DiaOfCladdingSagRod: 10,
}

describe('createRoofSchema', () => {
  it('accepts a required-only payload (no fascia board, no sidewalls)', () => {
    const result = createRoofSchema.safeParse(requiredRoof)
    expect(result.success).toBe(true)
  })

  it('accepts a full payload with the optional fascia board and inline sidewalls', () => {
    const full: CreateRoofInput = {
      ...requiredRoof,
      fasciaBoardArea: 20,
      fasciaMaterialWeightPerSqft: 1.5,
      sidewalls: [
        { side: 'FRONT', wallType: 'BRICK', thickness: 0.23, height: 3 },
        { side: 'BACK', wallType: 'PANEL', thickness: 0.1, height: 4 },
      ],
    }
    const result = createRoofSchema.safeParse(full)
    expect(result.success).toBe(true)
  })

  it('rejects a payload missing a required core field (eaveHeight)', () => {
    const result = createRoofSchema.safeParse(omit(requiredRoof, 'eaveHeight'))
    expect(result.success).toBe(false)
  })

  it('rejects a payload missing a required section field (roofPurlinDepth)', () => {
    const result = createRoofSchema.safeParse(omit(requiredRoof, 'roofPurlinDepth'))
    expect(result.success).toBe(false)
  })

  it('rejects a payload missing a required section enum (windBracingType)', () => {
    const result = createRoofSchema.safeParse(omit(requiredRoof, 'windBracingType'))
    expect(result.success).toBe(false)
  })

  it('accepts a payload that omits only the optional fascia board fields', () => {
    // requiredRoof already omits fascia board fields — confirm that's valid.
    expect(createRoofSchema.safeParse(requiredRoof).success).toBe(true)
  })

  it('rejects an invalid enum value for roofFrameBaseFixing', () => {
    const result = createRoofSchema.safeParse({
      ...requiredRoof,
      roofFrameBaseFixing: 'NOT_A_REAL_FIXING',
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-positive required dimensions', () => {
    const result = createRoofSchema.safeParse({ ...requiredRoof, buildingOverallLength: 0 })
    expect(result.success).toBe(false)
  })

  it('allows zero material consumption but rejects negative', () => {
    expect(createRoofSchema.safeParse({ ...requiredRoof, materialConsumptionExcludingPurlin: 0 }).success).toBe(true)
    expect(createRoofSchema.safeParse({ ...requiredRoof, materialConsumptionExcludingPurlin: -1 }).success).toBe(false)
  })

  it('rejects non-positive SAG rod diameters', () => {
    expect(createRoofSchema.safeParse({ ...requiredRoof, DiaOfRoofSagRod: 0 }).success).toBe(false)
    expect(createRoofSchema.safeParse({ ...requiredRoof, DiaOfCladdingSagRod: -1 }).success).toBe(false)
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

/** The 11 required core dimensions (roof.schema.ts). */
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

/** A representative section field per now-required section. */
const SECTION_FIELDS: RoofField[] = [
  'endFrameHorizontalTieBeam',
  'roofPurlinDepth',
  'roofCoveringType',
  'roofFlangeBraceAverageLength',
  'polycarbonateRoofCount',
  'windBracingType',
  'frontCladdingOpeningArea',
  'roofExtensionWidthHeight',
  'gradeOfPlateMaterial',
  'materialConsumptionExcludingPurlin',
  'DiaOfRoofSagRod',
]

describe('isRequired', () => {
  it('reports every core dimension as required', () => {
    for (const field of CORE_FIELDS) {
      expect(isRequired(field)).toBe(true)
    }
  })

  it('reports every structural section field as required', () => {
    for (const field of SECTION_FIELDS) {
      expect(isRequired(field)).toBe(true)
    }
  })

  it('reports the excluded fascia board fields and sidewalls as not required', () => {
    expect(isRequired('fasciaBoardArea')).toBe(false)
    expect(isRequired('fasciaMaterialWeightPerSqft')).toBe(false)
    expect(isRequired('sidewalls')).toBe(false)
  })
})

describe('getFieldErrors', () => {
  it('returns no errors for a valid required payload', () => {
    expect(getFieldErrors(requiredRoof)).toEqual({})
  })

  it('flags every core field when given an empty object', () => {
    const errors = getFieldErrors({})
    for (const field of CORE_FIELDS) {
      expect(errors[field]).toBeDefined()
    }
  })

  it('flags every section field when given an empty object', () => {
    const errors = getFieldErrors({})
    for (const field of SECTION_FIELDS) {
      expect(errors[field]).toBeDefined()
    }
  })

  it('flags a non-positive core dimension', () => {
    const errors = getFieldErrors({ ...requiredRoof, eaveHeight: 0 })
    expect(errors.eaveHeight).toBeDefined()
  })

  it('flags a missing required section field', () => {
    const errors = getFieldErrors(omit(requiredRoof, 'roofPurlinDepth'))
    expect(errors.roofPurlinDepth).toBeDefined()
  })

  it('does not flag the optional fascia board fields when absent', () => {
    const errors = getFieldErrors(requiredRoof)
    expect(errors.fasciaBoardArea).toBeUndefined()
    expect(errors.fasciaMaterialWeightPerSqft).toBeUndefined()
  })
})
