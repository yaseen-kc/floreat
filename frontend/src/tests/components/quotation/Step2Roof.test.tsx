import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

const mocks = vi.hoisted(() => ({ roofData: undefined as unknown }))

vi.mock('@/api/quotation/roof/getRoof', () => ({
  useRoof: () => ({ data: mocks.roofData }),
}))

import { Step2Roof } from '@/components/quotation/steps/Step2Roof'
import { useQuotationStore } from '@/stores/quotation-store'
import type { Roof } from '@/api/quotation/roof/getRoof'
import { validRoofDraft } from '@/tests/fixtures/roof'

/** Fills every required roof field so step 2 validates. */
const fillCoreDimensions = () => useQuotationStore.getState().setRoof(validRoofDraft)

describe('Step2Roof', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    mocks.roofData = undefined
  })

  it('renders the step heading and the core-dimensions section', () => {
    render(<Step2Roof />)
    expect(screen.getByRole('heading', { name: 'Structural inputs' })).toBeInTheDocument()
    expect(screen.getByText('Pre-Engineered Building Roof')).toBeInTheDocument()
    expect(screen.getByText('Eave Height')).toBeInTheDocument()
  })

  it('renders every optional section toggle', () => {
    render(<Step2Roof />)
    for (const title of [
      'Members', 'Purlins', 'Coverings', 'Flange Brace', 'Polycarbonate',
      'Wind Bracing', 'Cladding Openings', 'Fascia Board', 'Side Extension',
      'Material Grade', 'Sidewalls',
    ]) {
      expect(screen.getByText(title)).toBeInTheDocument()
    }
  })

  it('Continue is gated: nextStep stays on step 2 with an empty roof', () => {
    useQuotationStore.setState({ currentStep: 2 })
    const advanced = useQuotationStore.getState().nextStep()
    expect(advanced).toBe(false)
    expect(useQuotationStore.getState().currentStep).toBe(2)
    expect(useQuotationStore.getState().showValidation).toBe(true)
  })

  it('Continue advances to step 3 once every core dimension is valid', () => {
    useQuotationStore.setState({ currentStep: 2 })
    fillCoreDimensions()
    const advanced = useQuotationStore.getState().nextStep()
    expect(advanced).toBe(true)
    expect(useQuotationStore.getState().currentStep).toBe(3)
  })
})

/** A minimal Roof response with one optional section + a sidewall populated. */
const serverRoof = (): Roof =>
  ({
    id: 'roof-1',
    jobId: 'job-1',
    buildingOverallLength: '120',
    buildingOverallWidth: '50',
    eaveHeight: '6',
    roofSlope: '10',
    mainRoofFrames: 5,
    endRoofFrames: 2,
    roofPurlinSpacing: '1.5',
    claddingPurlins: 4,
    internalColumnsForMainRoofFrames: 0,
    internalColumnsForEndRoofFrames: 0,
    roofFrameBaseFixing: 'ANCHOR_BOLT',
    columnSegmentsInMainFrame: null,
    raftersInOneHalfOfMainFrame: null,
    columnSegmentsInEndFrame: null,
    raftersInOneHalfOfEndFrame: null,
    endFrameHorizontalTieBeam: null,
    roofPurlinType: 'Z_C',
    roofPurlinDepth: '150',
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
    diaOfRoofSagRod: null,
    diaOfCladdingSagRod: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sidewalls: [],
  })

describe('Step2Roof hydration on resume', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    useQuotationStore.getState().setJobId('job-1')
    mocks.roofData = undefined
  })

  it('hydrates the draft and section toggles from the server roof', async () => {
    mocks.roofData = serverRoof()
    render(<Step2Roof />)

    await waitFor(() => expect(useQuotationStore.getState().roof.buildingOverallLength).toBe(120))
    const s = useQuotationStore.getState()
    expect(s.roof.roofFrameBaseFixing).toBe('ANCHOR_BOLT')
    expect(s.roof.roofPurlinDepth).toBe(150)
    expect(s.roofSectionsEnabled.purlins).toBe(true)
  })

  it('does not overwrite a draft the user has already started', async () => {
    // Local edit present before the server data arrives.
    fillCoreDimensions()
    mocks.roofData = serverRoof()
    render(<Step2Roof />)

    await waitFor(() => expect(screen.getByText('Pre-Engineered Building Roof')).toBeInTheDocument())
    // Stays at the locally-entered value, not the server's 120.
    expect(useQuotationStore.getState().roof.buildingOverallLength).toBe(100)
    expect(useQuotationStore.getState().roof.roofFrameBaseFixing).toBe('FOUNDATION_BOLT')
  })
})
