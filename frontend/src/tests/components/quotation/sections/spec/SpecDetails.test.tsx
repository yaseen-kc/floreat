import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SpecDetails } from '@/components/quotation/sections/spec/SpecDetails'
import { useQuotationStore } from '@/stores/quotation-store'

describe('SpecDetails section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('renders the four spec fields', () => {
    render(<SpecDetails />)
    expect(screen.getByText('Product Specification')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Specifications')).toBeInTheDocument()
    expect(screen.getByText('Make / Brand')).toBeInTheDocument()
    expect(screen.getByText('Yield Strength')).toBeInTheDocument()
  })

  it('writes the description into the store', () => {
    render(<SpecDetails />)
    const description = screen.getByText('Description').parentElement!.querySelector('textarea')!
    fireEvent.change(description, { target: { value: 'Structural steel' } })
    expect(useQuotationStore.getState().spec.description).toBe('Structural steel')
  })

  it('writes the specifications list into the store, one item per line', () => {
    render(<SpecDetails />)
    const list = screen.getByText('Specifications').parentElement!.querySelector('textarea')!
    fireEvent.change(list, { target: { value: 'IS 2062\nIS 800' } })
    expect(useQuotationStore.getState().spec.specifications).toEqual(['IS 2062', 'IS 800'])
  })
})
