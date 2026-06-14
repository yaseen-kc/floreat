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

  it('disabling the section clears its fields', () => {
    useQuotationStore.getState().toggleRoofSection('sideExtension', true)
    useQuotationStore.getState().setRoof({ roofExtensionWidthHeight: 2.5, sideColumnsMidFrameCount: 3 })
    useQuotationStore.getState().toggleRoofSection('sideExtension', false)
    const { roof } = useQuotationStore.getState()
    expect(roof.roofExtensionWidthHeight).toBeUndefined()
    expect(roof.sideColumnsMidFrameCount).toBeUndefined()
  })
})
