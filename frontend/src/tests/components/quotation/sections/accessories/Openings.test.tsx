import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Openings } from '@/components/quotation/sections/accessories/Openings'
import { useQuotationStore } from '@/stores/quotation-store'

describe('Openings', () => {
  beforeEach(() => {
    useQuotationStore.getState().resetQuotation()
  })

  it('renders the four default opening rows and table headers', () => {
    render(<Openings />)

    expect(screen.getByText('Openings')).toBeInTheDocument()
    for (const label of ['SL', 'Opening', 'Length', 'Width', 'Nos', 'Qty']) {
      expect(screen.getByRole('columnheader', { name: label })).toBeInTheDocument()
    }
    for (const label of ['Rolling Shutter', 'Louver', 'Sky Light', 'Wall Light']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('enables an opening, updates fields, and calculates quantity', async () => {
    render(<Openings />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Include Rolling Shutter' }))

    const inputs = screen.getAllByRole('spinbutton')
    await userEvent.type(inputs[0], '3.5')
    await userEvent.type(inputs[1], '2.5')
    await userEvent.type(inputs[2], '2')

    expect(useQuotationStore.getState().accessories.rollingShutterLength).toBe(3.5)
    expect(useQuotationStore.getState().accessories.rollingShutterWidth).toBe(2.5)
    expect(useQuotationStore.getState().accessories.rollingShutterNos).toBe(2)
    expect(screen.getByText('17.5 m2')).toBeInTheDocument()
  })

  it('enables rows with hydrated values and clears them when unchecked', async () => {
    useQuotationStore.getState().setAccessories({ louverLength: 1, louverWidth: 2, louverNos: 3 })
    render(<Openings />)

    const louverToggle = screen.getByRole('checkbox', { name: 'Include Louver' })
    expect(louverToggle).toBeChecked()
    await userEvent.click(louverToggle)

    expect(useQuotationStore.getState().accessories.louverLength).toBeUndefined()
    expect(useQuotationStore.getState().accessories.louverWidth).toBeUndefined()
    expect(useQuotationStore.getState().accessories.louverNos).toBeUndefined()
  })
})
