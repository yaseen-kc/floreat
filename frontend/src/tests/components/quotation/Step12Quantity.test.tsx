import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const mocks = vi.hoisted(() => ({
  quantityData: undefined as unknown,
  upsertPebRoofMutateAsync: vi.fn(),
}))

vi.mock('@/api/quotation/quantity/getQuantity', () => ({
  useQuantity: () => ({ data: mocks.quantityData }),
}))

vi.mock('@/api/quotation/quantity-peb-roof/postQuantityPebRoof', () => ({
  useUpsertQuantityPebRoof: () => ({ mutateAsync: mocks.upsertPebRoofMutateAsync, isPending: false }),
}))

vi.mock('@/api/quotation/quantity-cladding/postQuantityCladding', () => ({
  useUpsertQuantityCladding: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('@/api/quotation/quantity-canopy/postQuantityCanopy', () => ({
  useUpsertQuantityCanopy: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('@/api/quotation/quantity-accessories/postQuantityAccessories', () => ({
  useUpsertQuantityAccessories: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('@/api/quotation/quantity-mezzanine/postQuantityMezzanine', () => ({
  useUpsertQuantityMezzanine: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('@/api/quotation/quantity-stair/postQuantityStair', () => ({
  useUpsertQuantityStair: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('@/api/quotation/quantity-additional-bolts/postQuantityAdditionalBolts', () => ({
  useUpsertQuantityAdditionalBolts: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: vi.fn() }),
  }
})

import { Step12Quantity } from '@/components/quotation/steps/Step12Quantity'
import { useQuotationStore } from '@/stores/quotation-store'

describe('Step12Quantity', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    useQuotationStore.setState({ jobId: 'job-123' })
    mocks.quantityData = undefined
    mocks.upsertPebRoofMutateAsync.mockReset().mockResolvedValue({ id: 'pr-1' })
  })

  it('renders the quantity heading and section headings', () => {
    render(<Step12Quantity />)

    expect(screen.getByRole('heading', { name: 'Quantity' })).toBeInTheDocument()
    expect(screen.getByText('PEB Roof')).toBeInTheDocument()
    expect(screen.getByText('Cladding')).toBeInTheDocument()
    expect(screen.getByText('Canopy')).toBeInTheDocument()
    expect(screen.getByText('Accessories')).toBeInTheDocument()
    expect(screen.getByText('Mezzanine')).toBeInTheDocument()
    expect(screen.getByText('Stair')).toBeInTheDocument()
    expect(screen.getByText('Additional Bolts')).toBeInTheDocument()
  }, 15000)

  it('renders section save buttons for individual table sections', () => {
    render(<Step12Quantity />)

    const saveButtons = screen.getAllByRole('button', { name: /Save/i })
    expect(saveButtons.length).toBe(7)
  })

  it('populates user input fields when quantity data is hydrated', () => {
    mocks.quantityData = {
      pebRoof: {
        lengthOfBuildingQuantity: '15.5',
      },
      additionalBolts: {
        jointBolt1Quantity: '42',
      },
    }

    render(<Step12Quantity />)

    const buildingLenInput = screen.getByRole('spinbutton', { name: /LENGTH OF BUILDING additional/i })
    expect(buildingLenInput).toHaveValue(15.5)

    const jointBolt1Input = screen.getAllByRole('spinbutton', { name: /Joint bolt/i })[0]
    expect(jointBolt1Input).toHaveValue(42)
  })
})
