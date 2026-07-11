import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Doors } from '@/components/quotation/sections/accessories/Doors'
import { useQuotationStore } from '@/stores/quotation-store'

describe('Doors section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('shows an empty state when there are no doors', () => {
    render(<Doors />)
    expect(screen.getByText('No doors added yet.')).toBeInTheDocument()
  })

  it('adds a door row to the store', async () => {
    render(<Doors />)
    await userEvent.click(screen.getByRole('button', { name: /add door/i }))
    expect(useQuotationStore.getState().accessories.doors).toHaveLength(1)
  })

  it('removes a door row from the store', async () => {
    useQuotationStore.getState().setAccessories({ doors: [{ height: 2.1, width: 0.9, nos: 2 }] })
    render(<Doors />)
    await userEvent.click(screen.getByRole('button', { name: /remove door 1/i }))
    expect(useQuotationStore.getState().accessories.doors).toHaveLength(0)
  })
})
