import { describe, it, expect } from 'vitest'
import {
  createMezzanineSchema,
  mezzanineFloorSchema,
  mezzanineFloorExtensionSchema,
} from '@/schemas/mezzanine.schema'
import type { CreateMezzanineInput } from '@/schemas/mezzanine.schema'

/** A fully-valid floor used as the baseline for the floor assertions. */
const validFloor = {
  code: 'MEZ-1',
  floor: 'FLOOR_1',
  type: 'DECK_SHEET',
  heightFrom: 'GROUND',
  thicknessMm: 120,
  lengthM: 10,
  widthM: 5,
  heightM: 3,
  materialConsumptionKgPerSqft: 12.5,
  beamsMidPrimary: 2,
  beamsEndPrimary: 1,
  beamsSecondary: 4,
  jointsMidPrimary: 1,
  jointsEndPrimary: 0,
  internalColumnsMidPrimary: 0,
  internalColumnsEndPrimary: 0,
} as const

/** A valid extension with every optional count omitted. */
const validExtensionNoCounts = {
  type: 'PANEL',
  heightFrom: 'FIRST_FLOOR',
  typicalTo: 'FLOOR_3',
  thicknessMm: 100,
  lengthM: 8,
  widthM: 4,
  heightM: 3,
} as const

describe('mezzanineFloorSchema', () => {
  it('parses a fully-valid floor', () => {
    expect(mezzanineFloorSchema.safeParse(validFloor).success).toBe(true)
  })

  it('rejects a code that does not match MEZ-<n>', () => {
    const result = mezzanineFloorSchema.safeParse({ ...validFloor, code: 'MEZ_1' })
    expect(result.success).toBe(false)
  })

  it('rejects a non-positive dimension', () => {
    expect(mezzanineFloorSchema.safeParse({ ...validFloor, lengthM: 0 }).success).toBe(false)
    expect(mezzanineFloorSchema.safeParse({ ...validFloor, thicknessMm: -1 }).success).toBe(false)
  })

  it('parses a floor with the integer counts omitted (now optional)', () => {
    const { beamsSecondary, ...withoutCount } = validFloor
    void beamsSecondary
    expect(mezzanineFloorSchema.safeParse(withoutCount).success).toBe(true)
  })

  it('parses an empty floor object (all fields optional)', () => {
    expect(mezzanineFloorSchema.safeParse({}).success).toBe(true)
  })
})

describe('mezzanineFloorExtensionSchema', () => {
  it('parses an extension with all optional counts omitted', () => {
    expect(mezzanineFloorExtensionSchema.safeParse(validExtensionNoCounts).success).toBe(true)
  })

  it('parses an empty extension object (all fields optional)', () => {
    expect(mezzanineFloorExtensionSchema.safeParse({}).success).toBe(true)
  })

  it('rejects a non-positive dimension', () => {
    expect(
      mezzanineFloorExtensionSchema.safeParse({ ...validExtensionNoCounts, widthM: 0 }).success,
    ).toBe(false)
  })
})

describe('createMezzanineSchema', () => {
  it('accepts an empty object (floors and extensions both optional)', () => {
    expect(createMezzanineSchema.safeParse({}).success).toBe(true)
  })

  it('accepts inline floors and extensions', () => {
    const payload: CreateMezzanineInput = {
      floors: [validFloor],
      extensions: [validExtensionNoCounts],
    }
    expect(createMezzanineSchema.safeParse(payload).success).toBe(true)
  })

  it('rejects a floors array containing an invalid floor', () => {
    const result = createMezzanineSchema.safeParse({ floors: [{ ...validFloor, code: 'bad' }] })
    expect(result.success).toBe(false)
  })
})
