import { afterEach, describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'

import { Step13Quotation } from '@/components/quotation/steps/Step13Quotation'
import { useQuotationStore } from '@/stores/quotation-store'

describe('Step13Quotation', () => {
  afterEach(() => {
    useQuotationStore.getState().resetQuotation()
  })

  it('renders the step heading and the letterhead meta', () => {
    useQuotationStore.getState().setProjectInfo({
      refNo: 'Q-2026-017',
      date: '2026-07-29',
      clientName: 'Acme Industries',
      subject: 'Warehouse expansion',
      firmName: 'Acme Design Studio',
      estimationEngineerName: 'Riya Nair',
      estimationEngineerMobile: '9000000001',
      headOfSalesName: 'Arun Menon',
      headOfSalesMobile: '9000000002',
    })
    render(<Step13Quotation />)

    expect(screen.getByRole('heading', { level: 2, name: 'Quotation' })).toBeInTheDocument()
    expect(screen.getByText('Acme Industries')).toBeInTheDocument()
    expect(screen.getAllByText('Q-2026-017').length).toBeGreaterThan(0)
    expect(screen.getByText('29 July 2026')).toBeInTheDocument()
    expect(screen.getByText('Warehouse expansion')).toBeInTheDocument()
    expect(screen.getByText(/For Acme Design Studio/)).toBeInTheDocument()
    expect(screen.getByText('Riya Nair')).toBeInTheDocument()
    expect(screen.getByText('9000000001')).toBeInTheDocument()
    expect(screen.getByText('Arun Menon')).toBeInTheDocument()
    expect(screen.getByText('9000000002')).toBeInTheDocument()
  })

  it('renders Not provided for empty letterhead values', () => {
    useQuotationStore.getState().setProjectInfo({
      refNo: '', date: '', clientName: '', subject: '', firmName: '',
      estimationEngineerName: '', estimationEngineerMobile: '',
      headOfSalesName: '', headOfSalesMobile: '',
    })
    render(<Step13Quotation />)

    expect(screen.getAllByText('Not provided').length).toBeGreaterThanOrEqual(9)
  })

  it('builds the building description from the live quotation draft', () => {
    const store = useQuotationStore.getState()
    store.setProjectInfo({ buildingUsage: 'Industrial', numberOfBuilding: 2, frameType: 'Portal', configuration: 'Multi Span' })
    store.setRoof({
      buildingOverallLength: 40,
      buildingOverallWidth: 20,
      eaveHeight: 8,
      roofSlope: 5,
      mainRoofFrames: 5,
      endRoofFrames: 2,
      internalColumnsForMainRoofFrames: 1,
      roofCoveringType: 'PUFF_SHEET',
      roofCoveringThickness: 30,
      claddingCoveringType: 'PPGL',
      claddingCoveringThickness: 0.45,
      polycarbonateRoofCount: 1,
      roofWindBracingSegmentsInOneHalf: 1,
      sidewalls: [{ side: 'FRONT', wallType: 'PANEL', thickness: 0.5, height: 3 }],
    })
    store.setAccessories({
      gutterQuantity: 10,
      turboVentilatorNos: 2,
      gantryGirderEnabled: true,
      roofInsulationType: 'ROCK_WOOL',
      partitionQuantity: 100,
      handrailWeightKg: 5,
      liftStructureEnabled: true,
    })
    store.setCanopy({ canopies: [{ canopySheet: 'PPGL' }] })
    store.setMezzanine({ floors: [{ type: 'DECK_SHEET' }], extensions: [] })

    render(<Step13Quotation />)

    const table = screen.getByRole('table', { name: 'Building configuration parameters and their values' })
    expect(within(table).getByText('Industrial')).toBeInTheDocument()
    expect(within(table).getByText('20 Meter')).toBeInTheDocument()
    expect(within(table).getByText('40 Meter')).toBeInTheDocument()
    expect(within(table).getByText('PANEL')).toBeInTheDocument()
    expect(within(table).getByText('3 Meter')).toBeInTheDocument()
    expect(within(table).getByText('6.666666666666667 Meter')).toBeInTheDocument()
    expect(within(table).getByText('PUFF_SHEET 30 mm Thick')).toBeInTheDocument()
    expect(within(table).getByText('PPGL 0.45 mm Thick')).toBeInTheDocument()
    expect(within(table).getAllByText('Yes').length).toBeGreaterThan(0)
    expect(within(table).getAllByText('NA').length).toBeGreaterThan(0)
    expect(within(table).queryByText('Commercial Building')).not.toBeInTheDocument()
    expect(within(table).queryByText('30 Meter')).not.toBeInTheDocument()
  })

  it('renders all nine chapters plus the contents list', () => {
    render(<Step13Quotation />)

    for (const title of [
      'List of Contents',
      'Scope of Work',
      'Product Specifications',
      'Applicable Codes',
      'Approval Drawings',
      'Quantity Estimation',
      'Pricing',
      'Exclusions',
      'Commercial Terms and Conditions',
      'Contract Form',
    ]) {
      expect(screen.getByRole('heading', { level: 3, name: title })).toBeInTheDocument()
    }

    expect(screen.getAllByTestId('quotation-panel')).toHaveLength(11)
  })

  it('renders the pricing grand total', () => {
    render(<Step13Quotation />)

    expect(screen.getByText('₹51,863,812.59')).toBeInTheDocument()
    expect(screen.getByText('Grand Total =')).toBeInTheDocument()
  })

  it('renders the quantity estimation rows with units', () => {
    render(<Step13Quotation />)

    expect(screen.getByText('Roof Purlins')).toBeInTheDocument()
    expect(screen.getByText('28,237.33')).toBeInTheDocument()
  })
})
