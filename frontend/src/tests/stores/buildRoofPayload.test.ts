import { describe, it, expect, beforeEach } from 'vitest'
import { useQuotationStore, buildRoofPayload } from '@/stores/quotation-store'
import type { RoofDraft } from '@/stores/quotation-store'
import { createRoofSchema } from '@/schemas/roof.schema'
import { validRoofDraft } from '@/tests/fixtures/roof'

/** A fully-valid set of the 11 required core dimensions + fixing. */
const CORE: Partial<RoofDraft> = {
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

describe('buildRoofPayload', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('throws when the base fixing is not selected', () => {
    const roof = useQuotationStore.getState().roof
    expect(() => buildRoofPayload(roof)).toThrow()
  })

  it('omits undefined optional fields and an empty sidewalls array', () => {
    useQuotationStore.getState().setRoof(CORE)
    const payload = buildRoofPayload(useQuotationStore.getState().roof)
    expect(payload).not.toHaveProperty('roofPurlinDepth')
    expect(payload).not.toHaveProperty('gradeOfPlateMaterial')
    expect(payload).not.toHaveProperty('sidewalls')
    expect(payload.buildingOverallLength).toBe(100)
    expect(payload.roofFrameBaseFixing).toBe('FOUNDATION_BOLT')
  })

  it('includes enabled-section values that were provided', () => {
    useQuotationStore.getState().setRoof({ ...CORE, roofPurlinDepth: 150, gradeOfPlateMaterial: 'FE_345' })
    const payload = buildRoofPayload(useQuotationStore.getState().roof)
    expect(payload.roofPurlinDepth).toBe(150)
    expect(payload.gradeOfPlateMaterial).toBe('FE_345')
  })

  it('includes a non-empty sidewalls array', () => {
    useQuotationStore.getState().setRoof({
      ...CORE,
      sidewalls: [{ side: 'FRONT', wallType: 'BRICK', thickness: 0.2, height: 3 }],
    })
    const payload = buildRoofPayload(useQuotationStore.getState().roof)
    expect(payload.sidewalls).toHaveLength(1)
  })

  it('produces a payload that satisfies the create schema', () => {
    useQuotationStore.getState().setRoof(validRoofDraft)
    const payload = buildRoofPayload(useQuotationStore.getState().roof)
    expect(createRoofSchema.safeParse(payload).success).toBe(true)
  })
})

describe('validateStep(2) with optional sections (core + fixing required)', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('is invalid by default (core unfilled)', () => {
    expect(useQuotationStore.getState().validateStep(2)).toBe(false)
  })

  it('is valid with only the core dimensions + fixing filled (sections optional)', () => {
    useQuotationStore.getState().setRoof(CORE)
    expect(useQuotationStore.getState().validateStep(2)).toBe(true)
  })

  it('is valid with every field filled', () => {
    useQuotationStore.getState().setRoof(validRoofDraft)
    expect(useQuotationStore.getState().validateStep(2)).toBe(true)
  })

  it('is invalid when the fixing is unselected', () => {
    useQuotationStore.getState().setRoof({ ...CORE, roofFrameBaseFixing: '' })
    expect(useQuotationStore.getState().validateStep(2)).toBe(false)
  })

  it('is invalid when a sidewall row has a non-positive dimension', () => {
    useQuotationStore.getState().setRoof({
      ...CORE,
      sidewalls: [{ side: 'FRONT', wallType: 'BRICK', thickness: 0, height: 0 }],
    })
    expect(useQuotationStore.getState().validateStep(2)).toBe(false)
  })
})
