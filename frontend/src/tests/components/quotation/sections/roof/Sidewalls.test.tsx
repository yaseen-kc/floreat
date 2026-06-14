import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Sidewalls } from '@/components/quotation/sections/roof/Sidewalls'
import { useQuotationStore } from '@/stores/quotation-store'

describe('Sidewalls section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('hides the body when disabled', () => {
    render(<Sidewalls />)
    expect(screen.getByText('Sidewalls')).toBeInTheDocument()
    expect(screen.queryByText('Add sidewall')).not.toBeInTheDocument()
  })

  it('shows an empty hint and an add button when enabled with no rows', () => {
    useQuotationStore.getState().toggleRoofSection('sidewalls', true)
    render(<Sidewalls />)
    expect(screen.getByText('No sidewalls added yet.')).toBeInTheDocument()
    expect(screen.getByText('Add sidewall')).toBeInTheDocument()
  })

  it('clicking add appends a sidewall row', () => {
    useQuotationStore.getState().toggleRoofSection('sidewalls', true)
    render(<Sidewalls />)
    fireEvent.click(screen.getByText('Add sidewall'))
    expect(useQuotationStore.getState().roof.sidewalls).toHaveLength(1)
    expect(screen.getByText('Sidewall 1')).toBeInTheDocument()
  })

  it('editing a row field updates the correct index', () => {
    useQuotationStore.getState().toggleRoofSection('sidewalls', true)
    useQuotationStore.getState().setRoof({
      sidewalls: [
        { side: 'FRONT', wallType: 'BRICK', thickness: 0, height: 0 },
        { side: 'BACK', wallType: 'PANEL', thickness: 0, height: 0 },
      ],
    })
    render(<Sidewalls />)
    const heightInputs = screen.getAllByText('Height').map((l) => l.parentElement!.querySelector('input')!)
    fireEvent.change(heightInputs[1], { target: { value: '3.5' } })
    const rows = useQuotationStore.getState().roof.sidewalls!
    expect(rows[1].height).toBe(3.5)
    expect(rows[0].height).toBe(0)
  })

  it('removing a row deletes it', () => {
    useQuotationStore.getState().toggleRoofSection('sidewalls', true)
    useQuotationStore.getState().setRoof({
      sidewalls: [
        { side: 'FRONT', wallType: 'BRICK', thickness: 0.2, height: 3 },
        { side: 'BACK', wallType: 'PANEL', thickness: 0.2, height: 3 },
      ],
    })
    render(<Sidewalls />)
    fireEvent.click(screen.getByLabelText('Remove sidewall 1'))
    const rows = useQuotationStore.getState().roof.sidewalls!
    expect(rows).toHaveLength(1)
    expect(rows[0].side).toBe('BACK')
  })

  it('disabling the section empties the array', () => {
    useQuotationStore.getState().toggleRoofSection('sidewalls', true)
    useQuotationStore.getState().setRoof({ sidewalls: [{ side: 'FRONT', wallType: 'BRICK', thickness: 0.2, height: 3 }] })
    useQuotationStore.getState().toggleRoofSection('sidewalls', false)
    expect(useQuotationStore.getState().roof.sidewalls).toEqual([])
  })

  it('flags invalid (zero) thickness/height when validation is shown', () => {
    useQuotationStore.getState().toggleRoofSection('sidewalls', true)
    useQuotationStore.getState().setRoof({ sidewalls: [{ side: 'FRONT', wallType: 'BRICK', thickness: 0, height: 0 }] })
    useQuotationStore.setState({ showValidation: true })
    render(<Sidewalls />)
    expect(screen.getByText('Thickness is required')).toBeInTheDocument()
    expect(screen.getByText('Height is required')).toBeInTheDocument()
  })
})
