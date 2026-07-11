import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DerivedQuantities, derivePreview } from '@/components/quotation/sections/accessories/DerivedQuantities'
import { useQuotationStore } from '@/stores/quotation-store'
import { deriveAccessoryQuantities } from '@floreat/shared/calc'

describe('DerivedQuantities section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('derivePreview matches deriveAccessoryQuantities for the roof draft', () => {
    useQuotationStore.getState().setRoof({
      buildingOverallLength: 100,
      buildingOverallWidth: 40,
      eaveHeight: 6,
      roofSlope: 10,
      mainRoofFrames: 8,
      endRoofFrames: 2,
    })
    const roof = useQuotationStore.getState().roof
    const preview = derivePreview(roof)

    expect(preview.gutterQuantity).toBe(deriveAccessoryQuantities({ buildingOverallLength: 100 }).gutterQuantity)
    expect(preview.gutterQuantity).toBe(200)
    expect(preview.ridgeQuantity).toBe(100)
  })

  it('enabling Override flips the *Manual flag in the store', async () => {
    render(<DerivedQuantities />)

    const toggle = screen.getByRole('switch', { name: /override gutter quantity/i })
    await userEvent.click(toggle)

    expect(useQuotationStore.getState().accessories.gutterQuantityManual).toBe(true)
  })

  it('disabling Override clears the manual value and flag', async () => {
    useQuotationStore.getState().setAccessories({ gutterQuantity: 999, gutterQuantityManual: true })
    render(<DerivedQuantities />)

    const toggle = screen.getByRole('switch', { name: /override gutter quantity/i })
    await userEvent.click(toggle)

    expect(useQuotationStore.getState().accessories.gutterQuantityManual).toBeUndefined()
    expect(useQuotationStore.getState().accessories.gutterQuantity).toBeUndefined()
  })

  const CORE_DIMS = {
    buildingOverallLength: 100,
    buildingOverallWidth: 40,
    eaveHeight: 6,
    roofSlope: 10,
    mainRoofFrames: 8,
    endRoofFrames: 2,
  }

  it('shows the Corner Flash hint when FRONT/LEFT sidewalls are missing', () => {
    useQuotationStore.getState().setRoof(CORE_DIMS)
    render(<DerivedQuantities />)

    expect(screen.getByText(/add front and left sidewalls/i)).toBeInTheDocument()
  })

  it('hides the hint and shows the value once FRONT and LEFT sidewalls exist', () => {
    useQuotationStore.getState().setRoof({
      ...CORE_DIMS,
      sidewalls: [
        { side: 'FRONT', wallType: 'BRICK', thickness: 0.2, height: 3 },
        { side: 'LEFT', wallType: 'BRICK', thickness: 0.2, height: 3 },
      ],
    })
    render(<DerivedQuantities />)

    expect(screen.queryByText(/add front and left sidewalls/i)).not.toBeInTheDocument()
    // cornerFlashQuantity = 4 * (eaveHeight - frontSideWallHeight) = 4 * (6 - 3) = 12
    expect(screen.getByDisplayValue('12')).toBeInTheDocument()
  })

  it('hides the hint when Override is enabled for Corner Flash', async () => {
    useQuotationStore.getState().setRoof(CORE_DIMS)
    render(<DerivedQuantities />)

    expect(screen.getByText(/add front and left sidewalls/i)).toBeInTheDocument()

    const toggle = screen.getByRole('switch', { name: /override corner flash quantity/i })
    await userEvent.click(toggle)

    expect(screen.queryByText(/add front and left sidewalls/i)).not.toBeInTheDocument()
  })
})
