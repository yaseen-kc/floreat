import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FlangeBrace } from '@/components/quotation/sections/roof/FlangeBrace'
import { useQuotationStore } from '@/stores/quotation-store'

describe('FlangeBrace section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('hides the fields when disabled', () => {
    render(<FlangeBrace />)
    expect(screen.getByText('Flange Brace')).toBeInTheDocument()
    expect(screen.queryByText('Roof Flange Brace Average Length')).not.toBeInTheDocument()
  })

  it('reveals the three fields when enabled', () => {
    useQuotationStore.getState().toggleRoofSection('flangeBrace', true)
    render(<FlangeBrace />)
    expect(screen.getByText('Roof Flange Brace Average Length')).toBeInTheDocument()
    expect(screen.getByText('Cladding Flange Brace Average Length')).toBeInTheDocument()
    expect(screen.getByText('End Frame Flange Brace Average Length')).toBeInTheDocument()
  })

  it('editing a field updates the store', () => {
    useQuotationStore.getState().toggleRoofSection('flangeBrace', true)
    render(<FlangeBrace />)
    const input = screen.getByText('Roof Flange Brace Average Length').parentElement!.querySelector('input')!
    fireEvent.change(input, { target: { value: '1.2' } })
    expect(useQuotationStore.getState().roof.roofFlangeBraceAverageLength).toBe(1.2)
  })

  it('disabling the section clears its fields', () => {
    useQuotationStore.getState().toggleRoofSection('flangeBrace', true)
    useQuotationStore.getState().setRoof({ roofFlangeBraceAverageLength: 1.2 })
    useQuotationStore.getState().toggleRoofSection('flangeBrace', false)
    expect(useQuotationStore.getState().roof.roofFlangeBraceAverageLength).toBeUndefined()
  })
})
