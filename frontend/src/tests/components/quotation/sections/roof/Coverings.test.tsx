import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Coverings } from '@/components/quotation/sections/roof/Coverings'
import { useQuotationStore } from '@/stores/quotation-store'

describe('Coverings section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('hides the fields when disabled', () => {
    render(<Coverings />)
    expect(screen.getByText('Coverings')).toBeInTheDocument()
    expect(screen.queryByText('Roof Covering Thickness')).not.toBeInTheDocument()
  })

  it('reveals the type selects and numeric fields when enabled', () => {
    useQuotationStore.getState().toggleRoofSection('coverings', true)
    render(<Coverings />)
    expect(screen.getByText('Roof Covering Type')).toBeInTheDocument()
    expect(screen.getByText('Cladding Covering Type')).toBeInTheDocument()
    expect(screen.getByText('Roof Covering Thickness')).toBeInTheDocument()
    expect(screen.getByText('Roof Area Deduction')).toBeInTheDocument()
  })

  it('shows the selected covering type label', () => {
    useQuotationStore.getState().toggleRoofSection('coverings', true)
    useQuotationStore.getState().setRoof({ roofCoveringType: 'PPGL' })
    render(<Coverings />)
    expect(screen.getByText('PPGL')).toBeInTheDocument()
  })

  it('editing a numeric field updates the store', () => {
    useQuotationStore.getState().toggleRoofSection('coverings', true)
    render(<Coverings />)
    const input = screen.getByText('Roof Covering Thickness').parentElement!.querySelector('input')!
    fireEvent.change(input, { target: { value: '0.5' } })
    expect(useQuotationStore.getState().roof.roofCoveringThickness).toBe(0.5)
  })

  it('disabling the section clears its fields', () => {
    useQuotationStore.getState().toggleRoofSection('coverings', true)
    useQuotationStore.getState().setRoof({ roofCoveringThickness: 0.5, roofCoveringType: 'OTHER' })
    useQuotationStore.getState().toggleRoofSection('coverings', false)
    const { roof } = useQuotationStore.getState()
    expect(roof.roofCoveringThickness).toBeUndefined()
    expect(roof.roofCoveringType).toBeUndefined()
  })
})
