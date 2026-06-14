import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Purlins } from '@/components/quotation/sections/roof/Purlins'
import { useQuotationStore } from '@/stores/quotation-store'

describe('Purlins section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('hides the fields when disabled', () => {
    render(<Purlins />)
    expect(screen.getByText('Purlins')).toBeInTheDocument()
    expect(screen.queryByText('Roof Purlin Depth')).not.toBeInTheDocument()
  })

  it('reveals two type selects and four numeric fields when enabled', () => {
    useQuotationStore.getState().toggleRoofSection('purlins', true)
    render(<Purlins />)
    expect(screen.getByText('Roof Purlin Type')).toBeInTheDocument()
    expect(screen.getByText('Cladding Purlin Type')).toBeInTheDocument()
    expect(screen.getByText('Roof Purlin Depth')).toBeInTheDocument()
    expect(screen.getByText('Cladding Purlin Unit Weight')).toBeInTheDocument()
  })

  it('shows the selected enum value as the trigger label', () => {
    useQuotationStore.getState().toggleRoofSection('purlins', true)
    useQuotationStore.getState().setRoof({ roofPurlinType: 'TUBE' })
    render(<Purlins />)
    expect(screen.getByText('Tube')).toBeInTheDocument()
  })

  it('editing a numeric field updates the store', () => {
    useQuotationStore.getState().toggleRoofSection('purlins', true)
    render(<Purlins />)
    const input = screen.getByText('Roof Purlin Depth').parentElement!.querySelector('input')!
    fireEvent.change(input, { target: { value: '150' } })
    expect(useQuotationStore.getState().roof.roofPurlinDepth).toBe(150)
  })

  it('disabling the section clears its fields', () => {
    useQuotationStore.getState().toggleRoofSection('purlins', true)
    useQuotationStore.getState().setRoof({ roofPurlinDepth: 150, roofPurlinType: 'Z_C' })
    useQuotationStore.getState().toggleRoofSection('purlins', false)
    const { roof } = useQuotationStore.getState()
    expect(roof.roofPurlinDepth).toBeUndefined()
    expect(roof.roofPurlinType).toBeUndefined()
  })
})
