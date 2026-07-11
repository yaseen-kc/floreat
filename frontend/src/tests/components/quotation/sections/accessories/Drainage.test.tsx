import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Drainage } from '@/components/quotation/sections/accessories/Drainage'
import { useQuotationStore } from '@/stores/quotation-store'

describe('Drainage section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('renders the gutter and down-take fields', () => {
    render(<Drainage />)
    expect(screen.getByText('Drainage')).toBeInTheDocument()
    expect(screen.getByText('Gutter Material')).toBeInTheDocument()
    expect(screen.getByText('Gutter Size')).toBeInTheDocument()
    expect(screen.getByText('Down Take Material')).toBeInTheDocument()
    expect(screen.getByText('Down Take Size')).toBeInTheDocument()
  })

  it('shows the selected gutter material label from the store', () => {
    useQuotationStore.getState().setAccessories({ gutterType: 'PPGL' })
    render(<Drainage />)
    // The selected value renders inside the trigger.
    expect(screen.getAllByText('PPGL').length).toBeGreaterThan(0)
  })
})
