import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Polycarbonate } from '@/components/quotation/sections/roof/Polycarbonate'
import { useQuotationStore } from '@/stores/quotation-store'

describe('Polycarbonate section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('hides the fields when disabled', () => {
    render(<Polycarbonate />)
    expect(screen.getByText('Polycarbonate')).toBeInTheDocument()
    expect(screen.queryByText('Polycarbonate Roof Length')).not.toBeInTheDocument()
  })

  it('reveals the three fields when enabled', () => {
    useQuotationStore.getState().toggleRoofSection('polycarbonate', true)
    render(<Polycarbonate />)
    expect(screen.getByText('Polycarbonate Roof Length')).toBeInTheDocument()
    expect(screen.getByText('Polycarbonate Roof Width')).toBeInTheDocument()
    expect(screen.getByText('Polycarbonate Roof Count')).toBeInTheDocument()
  })

  it('editing a field updates the store', () => {
    useQuotationStore.getState().toggleRoofSection('polycarbonate', true)
    render(<Polycarbonate />)
    const input = screen.getByText('Polycarbonate Roof Count').parentElement!.querySelector('input')!
    fireEvent.change(input, { target: { value: '2' } })
    expect(useQuotationStore.getState().roof.polycarbonateRoofCount).toBe(2)
  })

  it('disabling the section clears its fields', () => {
    useQuotationStore.getState().toggleRoofSection('polycarbonate', true)
    useQuotationStore.getState().setRoof({ polycarbonateRoofCount: 2 })
    useQuotationStore.getState().toggleRoofSection('polycarbonate', false)
    expect(useQuotationStore.getState().roof.polycarbonateRoofCount).toBeUndefined()
  })
})
