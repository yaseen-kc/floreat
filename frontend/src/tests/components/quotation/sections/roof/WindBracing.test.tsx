import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WindBracing } from '@/components/quotation/sections/roof/WindBracing'
import { useQuotationStore } from '@/stores/quotation-store'

describe('WindBracing section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('hides the fields when disabled', () => {
    render(<WindBracing />)
    expect(screen.getByText('Wind Bracing')).toBeInTheDocument()
    expect(screen.queryByText('Wind Bracing Type')).not.toBeInTheDocument()
  })

  it('reveals the type select and numeric fields when enabled', () => {
    useQuotationStore.getState().toggleRoofSection('windBracing', true)
    render(<WindBracing />)
    expect(screen.getByText('Wind Bracing Type')).toBeInTheDocument()
    expect(screen.getByText('Roof Wind Bracing Segments (One Half)')).toBeInTheDocument()
    expect(screen.getByText('Column Wind Bracing Length')).toBeInTheDocument()
  })

  it('shows the selected wind bracing type label', () => {
    useQuotationStore.getState().toggleRoofSection('windBracing', true)
    useQuotationStore.getState().setRoof({ windBracingType: 'ROD' })
    render(<WindBracing />)
    expect(screen.getByText('Rod')).toBeInTheDocument()
  })

  it('editing a numeric field updates the store', () => {
    useQuotationStore.getState().toggleRoofSection('windBracing', true)
    render(<WindBracing />)
    const input = screen.getByText('Wind Bracing Column Height').parentElement!.querySelector('input')!
    fireEvent.change(input, { target: { value: '5.5' } })
    expect(useQuotationStore.getState().roof.windBracingColumnHeight).toBe(5.5)
  })

  it('disabling the section clears all its fields', () => {
    useQuotationStore.getState().toggleRoofSection('windBracing', true)
    useQuotationStore.getState().setRoof({ windBracingColumnHeight: 5.5, windBracingType: 'TUBE', roofWindBracingProvidedBays: 2 })
    useQuotationStore.getState().toggleRoofSection('windBracing', false)
    const { roof } = useQuotationStore.getState()
    expect(roof.windBracingColumnHeight).toBeUndefined()
    expect(roof.windBracingType).toBeUndefined()
    expect(roof.roofWindBracingProvidedBays).toBeUndefined()
  })
})
