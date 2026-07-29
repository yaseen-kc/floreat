import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { DoorsWindowsFoldedPlates } from '@/components/quotation/sections/accessories/DoorsWindowsFoldedPlates'
import { useQuotationStore } from '@/stores/quotation-store'

describe('DoorsWindowsFoldedPlates', () => {
  beforeEach(() => {
    useQuotationStore.getState().resetQuotation()
  })

  it('renders the three default accessory rows and requested headers', () => {
    render(<DoorsWindowsFoldedPlates />)

    expect(screen.getByText('Doors, Windows & Folded Plates')).toBeInTheDocument()
    for (const label of ['SL', 'Accessory', 'Height/Length', 'Width', 'Nos', 'Qty']) {
      expect(screen.getByRole('columnheader', { name: label })).toBeInTheDocument()
    }
    for (const label of ['Doors', 'Windows', 'Folded Plates']) expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('starts rows unchecked and enables a row for editing', async () => {
    render(<DoorsWindowsFoldedPlates />)

    const doorToggle = screen.getByRole('checkbox', { name: 'Include Doors' })
    expect(doorToggle).not.toBeChecked()
    expect(screen.getByLabelText('Include Doors')).toBeInTheDocument()

    const inputs = screen.getAllByRole('spinbutton')
    expect(inputs[0]).toHaveAttribute('aria-readonly', 'true')

    await userEvent.click(doorToggle)
    expect(inputs[0]).toHaveAttribute('aria-readonly', 'false')
  })

  it('updates door fields and displays calculated quantity', async () => {
    render(<DoorsWindowsFoldedPlates />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Include Doors' }))

    const inputs = screen.getAllByRole('spinbutton')
    await userEvent.type(inputs[0], '2.1')
    await userEvent.type(inputs[1], '0.9')
    await userEvent.type(inputs[2], '3')

    expect(useQuotationStore.getState().accessories.doorHeight).toBe(2.1)
    expect(useQuotationStore.getState().accessories.doorWidth).toBe(0.9)
    expect(useQuotationStore.getState().accessories.doorNos).toBe(3)
    expect(screen.getByText('5.67 m2')).toBeInTheDocument()
  })

  it('clears a row when it is unchecked', async () => {
    useQuotationStore.getState().setAccessories({ doorHeight: 2.1, doorWidth: 0.9, doorNos: 3 })
    render(<DoorsWindowsFoldedPlates />)

    const doorToggle = screen.getByRole('checkbox', { name: 'Include Doors' })
    expect(doorToggle).toBeChecked()
    await userEvent.click(doorToggle)

    expect(useQuotationStore.getState().accessories.doorHeight).toBeUndefined()
    expect(useQuotationStore.getState().accessories.doorWidth).toBeUndefined()
    expect(useQuotationStore.getState().accessories.doorNos).toBeUndefined()
  })
})
