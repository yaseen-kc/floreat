import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SagRod } from '@/components/quotation/sections/roof/SagRod'
import { useQuotationStore } from '@/stores/quotation-store'

describe('SagRod section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('hides the fields when disabled', () => {
    render(<SagRod />)
    expect(screen.getByText('SAG Rod')).toBeInTheDocument()
    expect(screen.queryByText('Roof SAG Rod Diameter')).not.toBeInTheDocument()
  })

  it('reveals the two fields when enabled', () => {
    useQuotationStore.getState().toggleRoofSection('sagRod', true)
    render(<SagRod />)
    expect(screen.getByText('Roof SAG Rod Diameter')).toBeInTheDocument()
    expect(screen.getByText('Cladding SAG Rod Diameter')).toBeInTheDocument()
  })

  it('editing a field updates the store', () => {
    useQuotationStore.getState().toggleRoofSection('sagRod', true)
    render(<SagRod />)
    const input = screen.getByText('Roof SAG Rod Diameter').parentElement!.querySelector('input')!
    fireEvent.change(input, { target: { value: '12' } })
    expect(useQuotationStore.getState().roof.diaOfRoofSagRod).toBe(12)
  })

  it('disabling the section clears its fields', () => {
    useQuotationStore.getState().toggleRoofSection('sagRod', true)
    useQuotationStore.getState().setRoof({ diaOfRoofSagRod: 12, diaOfCladdingSagRod: 10 })
    useQuotationStore.getState().toggleRoofSection('sagRod', false)
    const { roof } = useQuotationStore.getState()
    expect(roof.diaOfRoofSagRod).toBeUndefined()
    expect(roof.diaOfCladdingSagRod).toBeUndefined()
  })
})
