import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Step2Roof } from '@/components/quotation/steps/Step2Roof'
import { useQuotationStore } from '@/stores/quotation-store'

/** Fills the 11 required core dimensions so step 2 validates. */
const fillCoreDimensions = () =>
  useQuotationStore.getState().setRoof({
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
  })

describe('Step2Roof', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('renders the step heading and the core-dimensions section', () => {
    render(<Step2Roof />)
    expect(screen.getByRole('heading', { name: 'Structural inputs' })).toBeInTheDocument()
    expect(screen.getByText('Core Dimensions')).toBeInTheDocument()
    expect(screen.getByText('Eave Height')).toBeInTheDocument()
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
