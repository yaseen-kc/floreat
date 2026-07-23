import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Doors } from '@/components/quotation/sections/accessories/Doors'
import { useQuotationStore } from '@/stores/quotation-store'

describe('Doors', () => {
  beforeEach(() => {
    useQuotationStore.getState().resetQuotation()
  })

  it('renders the Door section', () => {
    render(<Doors />)
    expect(screen.getByText('Doors')).toBeInTheDocument()
  })

  it('updates door fields in the store when inputs change', async () => {
    render(<Doors />)
    const heightInput = screen.getByLabelText(/height/i)
    await userEvent.type(heightInput, '2.1')
    expect(useQuotationStore.getState().accessories.doorHeight).toEqual(2.1)
  })
})
