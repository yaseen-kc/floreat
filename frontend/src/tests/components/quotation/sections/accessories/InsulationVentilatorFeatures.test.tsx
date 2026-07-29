import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { InsulationVentilatorFeatures } from '@/components/quotation/sections/accessories/InsulationVentilatorFeatures'
import { useQuotationStore } from '@/stores/quotation-store'

describe('InsulationVentilatorFeatures', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('renders insulation, ventilator, handrail, and feature rows', () => {
    render(<InsulationVentilatorFeatures />)

    expect(screen.getByText('Insulation, Ventilator & Features')).toBeInTheDocument()
    for (const label of ['SL', 'Accessory', 'Type/Value', 'Quantity']) {
      expect(screen.getByRole('columnheader', { name: label })).toBeInTheDocument()
    }
    for (const label of ['Roof Insulation', 'Wall Insulation', 'Turbo Ventilator', 'Handrail', 'Deck Sheet Flashing', 'Gantry Girder', 'Lift Structure']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('enables selector and quantity fields for the turbo ventilator', async () => {
    render(<InsulationVentilatorFeatures />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Include Turbo Ventilator' }))

    expect(screen.getByRole('combobox', { name: 'Turbo Ventilator type' })).toBeEnabled()
    expect(screen.getAllByRole('spinbutton')[0]).toHaveAttribute('aria-readonly', 'false')
  })

  it('maps feature checkboxes to the existing boolean fields', async () => {
    render(<InsulationVentilatorFeatures />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Include Gantry Girder' }))

    expect(useQuotationStore.getState().accessories.gantryGirderEnabled).toBe(true)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Include Gantry Girder' }))
    expect(useQuotationStore.getState().accessories.gantryGirderEnabled).toBeUndefined()
  })
})
