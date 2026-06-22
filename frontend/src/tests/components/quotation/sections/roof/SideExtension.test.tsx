import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SideExtension } from '@/components/quotation/sections/roof/SideExtension'
import { useQuotationStore } from '@/stores/quotation-store'

describe('SideExtension section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('hides the fields when disabled', () => {
    render(<SideExtension />)
    expect(screen.getByText('Side Extension')).toBeInTheDocument()
    expect(screen.queryByText('Roof Extension Width / Height')).not.toBeInTheDocument()
  })

  it('reveals the grouped fields when enabled', () => {
    useQuotationStore.getState().toggleRoofSection('sideExtension', true)
    render(<SideExtension />)
    expect(screen.getByText('Roof Extension Width / Height')).toBeInTheDocument()
    expect(screen.getByText('Cladding Extension Mid Frame Count')).toBeInTheDocument()
    expect(screen.getByText('Side Columns End Frame Count')).toBeInTheDocument()
  })

  it('editing a field updates the store', () => {
    useQuotationStore.getState().toggleRoofSection('sideExtension', true)
    render(<SideExtension />)
    const input = screen.getByText('Roof Extension Width / Height').parentElement!.querySelector('input')!
    fireEvent.change(input, { target: { value: '2.5' } })
    expect(useQuotationStore.getState().roof.roofExtensionWidthHeight).toBe(2.5)
  })

  it('renders Side Columns Width / Height as a read-only derived field', () => {
    useQuotationStore.getState().toggleRoofSection('sideExtension', true)
    useQuotationStore.getState().setRoof({ eaveHeight: 6, roofSlope: 10, claddingExtensionWidthHeight: 1 })
    render(<SideExtension />)
    const input = screen
      .getByText('Side Columns Width / Height')
      .parentElement!.querySelector('input')! as HTMLInputElement
    // 6 − 1 × tan(10°) → 5.824
    expect(input).toHaveAttribute('readonly')
    expect(input.value).toBe('5.824')
    // No required asterisk on a derived field.
    expect(screen.getByText('Side Columns Width / Height').textContent).not.toContain('*')
  })

  it('updates the derived Side Columns Width / Height live when cladding extension changes', () => {
    useQuotationStore.getState().toggleRoofSection('sideExtension', true)
    useQuotationStore.getState().setRoof({ eaveHeight: 6, roofSlope: 10, claddingExtensionWidthHeight: 1 })
    render(<SideExtension />)
    const cladding = screen
      .getByText('Cladding Extension Width / Height')
      .parentElement!.querySelector('input')!
    fireEvent.change(cladding, { target: { value: '0' } })
    const derived = screen
      .getByText('Side Columns Width / Height')
      .parentElement!.querySelector('input')! as HTMLInputElement
    expect(derived.value).toBe('0')
  })

  it('renders Side Columns Mid Frame Count as a read-only mirror of the cladding count', () => {
    useQuotationStore.getState().toggleRoofSection('sideExtension', true)
    useQuotationStore.getState().setRoof({ claddingExtensionMidFrameCount: 4 })
    render(<SideExtension />)
    const input = screen
      .getByText('Side Columns Mid Frame Count')
      .parentElement!.querySelector('input')! as HTMLInputElement
    expect(input).toHaveAttribute('readonly')
    expect(input.value).toBe('4')
    // No required asterisk on a derived field.
    expect(screen.getByText('Side Columns Mid Frame Count').textContent).not.toContain('*')
  })

  it('updates the mirrored Side Columns Mid Frame Count live when the cladding count changes', () => {
    useQuotationStore.getState().toggleRoofSection('sideExtension', true)
    render(<SideExtension />)
    const cladding = screen
      .getByText('Cladding Extension Mid Frame Count')
      .parentElement!.querySelector('input')!
    fireEvent.change(cladding, { target: { value: '7' } })
    const mirrored = screen
      .getByText('Side Columns Mid Frame Count')
      .parentElement!.querySelector('input')! as HTMLInputElement
    expect(mirrored.value).toBe('7')
    expect(useQuotationStore.getState().roof.sideColumnsMidFrameCount).toBe(7)
  })

  it('disabling the section clears its fields', () => {
    useQuotationStore.getState().toggleRoofSection('sideExtension', true)
    useQuotationStore.getState().setRoof({ roofExtensionWidthHeight: 2.5, claddingExtensionMidFrameCount: 3 })
    // The mirror keeps sideColumnsMidFrameCount in lock-step with the cladding count.
    expect(useQuotationStore.getState().roof.sideColumnsMidFrameCount).toBe(3)
    useQuotationStore.getState().toggleRoofSection('sideExtension', false)
    const { roof } = useQuotationStore.getState()
    expect(roof.roofExtensionWidthHeight).toBeUndefined()
    expect(roof.sideColumnsMidFrameCount).toBeUndefined()
  })
})
