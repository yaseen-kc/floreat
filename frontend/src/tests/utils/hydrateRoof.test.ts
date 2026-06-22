import { describe, it, expect } from 'vitest'
import type { Roof } from '@/api/quotation/roof/getRoof'
import { mapRoofResponseToDraft } from '@/utils/hydrateRoof'

/** A Roof response with all optional fields null and no sidewalls. */
const baseRoof = (): Roof => ({
  id: 'roof-1',
  jobId: 'job-1',
  buildingOverallLength: '100',
  buildingOverallWidth: '50',
  eaveHeight: '6',
  roofSlope: '10',
  mainRoofFrames: 5,
  endRoofFrames: 2,
  roofPurlinSpacing: '1.5',
  claddingPurlins: 4,
  internalColumnsForMainRoofFrames: 0,
  internalColumnsForEndRoofFrames: 0,
  roofFrameBaseFixing: 'FOUNDATION_BOLT',
  columnSegmentsInMainFrame: null,
  raftersInOneHalfOfMainFrame: null,
  columnSegmentsInEndFrame: null,
  raftersInOneHalfOfEndFrame: null,
  endFrameHorizontalTieBeam: null,
  roofPurlinType: null,
  roofPurlinDepth: null,
  roofPurlinUnitWeight: null,
  claddingPurlinType: null,
  claddingPurlinDepth: null,
  claddingPurlinUnitWeight: null,
  roofCoveringType: null,
  roofCoveringThickness: null,
  claddingCoveringType: null,
  claddingCoveringThickness: null,
  roofAreaDeduction: null,
  roofFlangeBraceAverageLength: null,
  claddingFlangeBraceAverageLength: null,
  endFrameFlangeBraceAverageLength: null,
  polycarbonateRoofLength: null,
  polycarbonateRoofWidth: null,
  polycarbonateRoofCount: null,
  roofWindBracingSegmentsInOneHalf: null,
  columnWindBracingSegments: null,
  roofWindBracingProvidedBays: null,
  columnWindBracingProvidedBays: null,
  windBracingColumnHeight: null,
  windBracingUnitWeight: null,
  roofWindBracingBaySpacing: null,
  columnWindBracingBaySpacing: null,
  roofWindBracingLength: null,
  columnWindBracingLength: null,
  windBracingType: null,
  frontCladdingOpeningArea: null,
  backCladdingOpeningArea: null,
  rightCladdingOpeningArea: null,
  leftCladdingOpeningArea: null,
  fasciaBoardArea: null,
  fasciaMaterialWeightPerSqft: null,
  roofExtensionWidthHeight: null,
  roofExtensionMidFrameCount: null,
  roofExtensionEndFrameCount: null,
  claddingExtensionWidthHeight: null,
  claddingExtensionMidFrameCount: null,
  claddingExtensionEndFrameCount: null,
  sideColumnsWidthHeight: null,
  sideColumnsMidFrameCount: null,
  sideColumnsEndFrameCount: null,
  gradeOfPlateMaterial: null,
  materialConsumptionExcludingPurlin: null,
  DiaOfRoofSagRod: null,
  DiaOfCladdingSagRod: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  sidewalls: [],
})

describe('mapRoofResponseToDraft', () => {
  it('coerces Decimal-string core dimensions to numbers', () => {
    const { roof } = mapRoofResponseToDraft(baseRoof())
    expect(roof.buildingOverallLength).toBe(100)
    expect(roof.eaveHeight).toBe(6)
    expect(roof.roofPurlinSpacing).toBe(1.5)
    expect(roof.roofFrameBaseFixing).toBe('FOUNDATION_BOLT')
  })

  it('maps null optionals to undefined and disables their sections', () => {
    const { roof, roofSectionsEnabled } = mapRoofResponseToDraft(baseRoof())
    expect(roof.roofPurlinDepth).toBeUndefined()
    expect(roof.gradeOfPlateMaterial).toBeUndefined()
    expect(roofSectionsEnabled.purlins).toBe(false)
    expect(roofSectionsEnabled.windBracing).toBe(false)
    expect(roofSectionsEnabled.sidewalls).toBe(false)
  })

  it('enables a section when any of its fields is populated', () => {
    const r = baseRoof()
    r.roofPurlinType = 'Z_C'
    r.roofPurlinDepth = '150'
    const { roof, roofSectionsEnabled } = mapRoofResponseToDraft(r)
    expect(roof.roofPurlinType).toBe('Z_C')
    expect(roof.roofPurlinDepth).toBe(150)
    expect(roofSectionsEnabled.purlins).toBe(true)
    expect(roofSectionsEnabled.coverings).toBe(false)
  })

  it('maps sidewalls and enables the section when rows exist', () => {
    const r = baseRoof()
    r.sidewalls = [
      { id: 'sw-1', roofId: 'roof-1', side: 'FRONT', wallType: 'BRICK', thickness: '0.2', height: '3' },
    ]
    const { roof, roofSectionsEnabled } = mapRoofResponseToDraft(r)
    expect(roof.sidewalls).toEqual([{ side: 'FRONT', wallType: 'BRICK', thickness: 0.2, height: 3 }])
    expect(roofSectionsEnabled.sidewalls).toBe(true)
  })

  it('enables the members section from an integer field', () => {
    const r = baseRoof()
    r.columnSegmentsInMainFrame = 2
    const { roof, roofSectionsEnabled } = mapRoofResponseToDraft(r)
    expect(roof.columnSegmentsInMainFrame).toBe(2)
    expect(roofSectionsEnabled.members).toBe(true)
  })

  it('maps material consumption and enables its section', () => {
    const r = baseRoof()
    r.materialConsumptionExcludingPurlin = '12.5'
    const { roof, roofSectionsEnabled } = mapRoofResponseToDraft(r)
    expect(roof.materialConsumptionExcludingPurlin).toBe(12.5)
    expect(roofSectionsEnabled.materialConsumption).toBe(true)
    expect(roofSectionsEnabled.sagRod).toBe(false)
  })

  it('maps SAG rod diameters and enables its section', () => {
    const r = baseRoof()
    r.DiaOfRoofSagRod = '12'
    r.DiaOfCladdingSagRod = '10'
    const { roof, roofSectionsEnabled } = mapRoofResponseToDraft(r)
    expect(roof.DiaOfRoofSagRod).toBe(12)
    expect(roof.DiaOfCladdingSagRod).toBe(10)
    expect(roofSectionsEnabled.sagRod).toBe(true)
    expect(roofSectionsEnabled.materialConsumption).toBe(false)
  })

  it('mirrors sideColumnsMidFrameCount from claddingExtensionMidFrameCount, ignoring the persisted value', () => {
    const r = baseRoof()
    r.claddingExtensionMidFrameCount = 4
    // A stale/mismatched persisted value must be overridden by the mirror.
    r.sideColumnsMidFrameCount = 99
    const { roof } = mapRoofResponseToDraft(r)
    expect(roof.sideColumnsMidFrameCount).toBe(4)
  })
})
