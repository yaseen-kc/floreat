import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CladdingOpenings } from '@/components/quotation/sections/roof/CladdingOpenings'
import { useQuotationStore } from '@/stores/quotation-store'

describe('CladdingOpenings section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('hides the fields when disabled', () => {
    render(<CladdingOpenings />)
    expect(screen.getByText('Cladding Openings')).toBeInTheDocument()
    expect(screen.queryByText('Front Cladding Opening Area')).not.toBeInTheDocument()
  })

  it('reveals the four area fields when enabled', () => {
    useQuotationStore.getState().toggleRoofSection('claddingOpenings', true)
    render(<CladdingOpenings />)
    expect(screen.getByText('Front Cladding Opening Area')).toBeInTheDocument()
    expect(screen.getByText('Back Cladding Opening Area')).toBeInTheDocument()
    expect(screen.getByText('Right Cladding Opening Area')).toBeInTheDocument()
    expect(screen.getByText('Left Cladding Opening Area')).toBeInTheDocument()
  })

  it('editing a field updates the store', () => {
    useQuotationStore.getState().toggleRoofSection('claddingOpenings', true)
    render(<CladdingOpenings />)
    const input = screen.getByText('Front Cladding Opening Area').parentElement!.querySelector('input')!
    fireEvent.change(input, { target: { value: '12' } })
    expect(useQuotationStore.getState().roof.frontCladdingOpeningArea).toBe(12)
  })

  it('disabling the section clears its fields', () => {
    useQuotationStore.getState().toggleRoofSection('claddingOpenings', true)
    useQuotationStore.getState().setRoof({ frontCladdingOpeningArea: 12 })
    useQuotationStore.getState().toggleRoofSection('claddingOpenings', false)
    expect(useQuotationStore.getState().roof.frontCladdingOpeningArea).toBeUndefined()
  })
})
