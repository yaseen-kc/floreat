import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { DrainageFlashingPartition } from '@/components/quotation/sections/accessories/DrainageFlashingPartition'
import { useQuotationStore } from '@/stores/quotation-store'

describe('DrainageFlashingPartition', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('renders all accessories 1 rows and table headers', () => {
    render(<DrainageFlashingPartition />)

    expect(screen.getByText('Drainage, Flashing & Partition')).toBeInTheDocument()
    for (const label of ['SL', 'Accessory', 'Material/Type', 'Size/Thickness', 'Qty', 'Override']) {
      expect(screen.getByRole('columnheader', { name: label })).toBeInTheDocument()
    }
    for (const label of ['Gutter', 'Down Take', 'Drip Trim', 'Gable End Flashing', 'Corner Flash', 'Ridge', 'Partition']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('enables a row and updates its material and size', async () => {
    render(<DrainageFlashingPartition />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Include Gutter' }))

    expect(screen.getByRole('combobox', { name: 'Gutter material' })).toBeEnabled()
    expect(screen.getByRole('combobox', { name: 'Gutter size' })).toBeEnabled()
  })

  it('preserves derived quantity override behavior', async () => {
    useQuotationStore.getState().setAccessories({ gutterQuantity: 200, gutterQuantityManual: true })
    render(<DrainageFlashingPartition />)

    expect(screen.getByRole('checkbox', { name: 'Include Gutter' })).toBeChecked()
    expect(screen.getByRole('switch', { name: 'Override Gutter quantity' })).toBeChecked()

    await userEvent.click(screen.getByRole('checkbox', { name: 'Include Gutter' }))
    expect(useQuotationStore.getState().accessories.gutterQuantity).toBeUndefined()
    expect(useQuotationStore.getState().accessories.gutterQuantityManual).toBeUndefined()
  })

  it('supports partition quantity', async () => {
    render(<DrainageFlashingPartition />)

    await userEvent.click(screen.getByRole('checkbox', { name: 'Include Partition' }))
    expect(screen.getByRole('combobox', { name: 'Partition material' })).toBeEnabled()
    expect(screen.getByRole('combobox', { name: 'Partition size' })).toBeEnabled()

  })
})
