import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MaterialConsumption } from '@/components/quotation/sections/roof/MaterialConsumption'
import { useQuotationStore } from '@/stores/quotation-store'

describe('MaterialConsumption section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('hides the field when disabled', () => {
    render(<MaterialConsumption />)
    expect(screen.getByText('Material Consumption')).toBeInTheDocument()
    expect(screen.queryByText('Material Consumption (Excluding Purlin)')).not.toBeInTheDocument()
  })

  it('reveals the field when enabled', () => {
    useQuotationStore.getState().toggleRoofSection('materialConsumption', true)
    render(<MaterialConsumption />)
    expect(screen.getByText('Material Consumption (Excluding Purlin)')).toBeInTheDocument()
  })

  it('editing the field updates the store', () => {
    useQuotationStore.getState().toggleRoofSection('materialConsumption', true)
    render(<MaterialConsumption />)
    const input = screen.getByText('Material Consumption (Excluding Purlin)').parentElement!.querySelector('input')!
    fireEvent.change(input, { target: { value: '12.5' } })
    expect(useQuotationStore.getState().roof.materialConsumptionExcludingPurlin).toBe(12.5)
  })

  it('disabling the section clears its field', () => {
    useQuotationStore.getState().toggleRoofSection('materialConsumption', true)
    useQuotationStore.getState().setRoof({ materialConsumptionExcludingPurlin: 12.5 })
    useQuotationStore.getState().toggleRoofSection('materialConsumption', false)
    expect(useQuotationStore.getState().roof.materialConsumptionExcludingPurlin).toBeUndefined()
  })
})
