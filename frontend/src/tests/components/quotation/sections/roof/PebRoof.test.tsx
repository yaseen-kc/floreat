import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PebRoof } from '@/components/quotation/sections/roof/PebRoof'
import { useQuotationStore } from '@/stores/quotation-store'

/** Every core-dimension label rendered by the section. */
const ALL_LABELS = [
  'Building Overall Length',
  'Building Overall Width',
  'Eave Height',
  'Roof Slope',
  'Main Roof Frames',
  'End Roof Frames',
  'Roof Purlin Spacing',
  'Cladding Purlins',
  'Internal Columns (Main Frames)',
  'Internal Columns (End Frames)',
  'Roof Frame Base Fixing',
]

describe('PebRoof core-dimensions section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('renders every core-dimension field label', () => {
    render(<PebRoof />)
    for (const label of ALL_LABELS) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('marks each field with a required asterisk', () => {
    render(<PebRoof />)
    for (const label of ALL_LABELS) {
      expect(screen.getByText(label).querySelector('span')?.textContent).toBe('*')
    }
  })

  it('does not show errors when showValidation is false', () => {
    render(<PebRoof />)
    expect(screen.queryByText('Eave Height is required')).not.toBeInTheDocument()
    expect(screen.queryByText('Roof Frame Base Fixing is required')).not.toBeInTheDocument()
  })

  it('shows errors for the empty defaults when showValidation is true', () => {
    useQuotationStore.setState({ showValidation: true })
    render(<PebRoof />)
    expect(screen.getByText('Eave Height is required')).toBeInTheDocument()
    expect(screen.getByText('Building Overall Length is required')).toBeInTheDocument()
    expect(screen.getByText('Roof Frame Base Fixing is required')).toBeInTheDocument()
  })

  it('writes edits to a numeric field into the store', () => {
    render(<PebRoof />)
    const input = screen.getByText('Eave Height').parentElement!.querySelector('input')!
    fireEvent.change(input, { target: { value: '6' } })
    expect(useQuotationStore.getState().roof.eaveHeight).toBe(6)
  })

  it('clears the error once a field is filled and validation re-runs', () => {
    useQuotationStore.setState({ showValidation: true })
    const { rerender } = render(<PebRoof />)
    expect(screen.getByText('Eave Height is required')).toBeInTheDocument()

    useQuotationStore.getState().setRoof({ eaveHeight: 6 })
    rerender(<PebRoof />)
    expect(screen.queryByText('Eave Height is required')).not.toBeInTheDocument()
  })
})
