import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FasciaBoard } from '@/components/quotation/sections/roof/FasciaBoard'
import { useQuotationStore } from '@/stores/quotation-store'

describe('FasciaBoard section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('hides the fields when disabled', () => {
    render(<FasciaBoard />)
    expect(screen.getByText('Fascia Board')).toBeInTheDocument()
    expect(screen.queryByText('Fascia Board Area')).not.toBeInTheDocument()
  })

  it('reveals the two fields when enabled', () => {
    useQuotationStore.getState().toggleRoofSection('fasciaBoard', true)
    render(<FasciaBoard />)
    expect(screen.getByText('Fascia Board Area')).toBeInTheDocument()
    expect(screen.getByText('Fascia Material Weight')).toBeInTheDocument()
  })

  it('editing a field updates the store', () => {
    useQuotationStore.getState().toggleRoofSection('fasciaBoard', true)
    render(<FasciaBoard />)
    const input = screen.getByText('Fascia Board Area').parentElement!.querySelector('input')!
    fireEvent.change(input, { target: { value: '20' } })
    expect(useQuotationStore.getState().roof.fasciaBoardArea).toBe(20)
  })

  it('disabling the section clears its fields', () => {
    useQuotationStore.getState().toggleRoofSection('fasciaBoard', true)
    useQuotationStore.getState().setRoof({ fasciaBoardArea: 20, fasciaMaterialWeightPerSqft: 3 })
    useQuotationStore.getState().toggleRoofSection('fasciaBoard', false)
    const { roof } = useQuotationStore.getState()
    expect(roof.fasciaBoardArea).toBeUndefined()
    expect(roof.fasciaMaterialWeightPerSqft).toBeUndefined()
  })
})
