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
    useQuotationStore.getState().toggleRoofSection('sidewalls', false)
    render(<Sidewalls />)
    expect(screen.getByText('Sidewalls')).toBeInTheDocument()
    expect(screen.queryByText('Front')).not.toBeInTheDocument()
  })

  it('renders the four fixed sides by default', () => {
    render(<Sidewalls />)
    expect(screen.getByText('Front')).toBeInTheDocument()
    expect(screen.getByText('Back')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.queryByText('Add sidewall')).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Remove sidewall/)).not.toBeInTheDocument()
  })

  it('normalizes custom rows to the four fixed sides', () => {
    useQuotationStore.getState().setRoof({
      sidewalls: [{ side: 'LEFT', wallType: 'PANEL', thickness: 0.2, height: 3 }],
    })
    render(<Sidewalls />)
    expect(useQuotationStore.getState().roof.sidewalls?.map((row) => row.side)).toEqual([
      'FRONT', 'BACK', 'RIGHT', 'LEFT',
    ])
    expect(screen.getAllByText('Front')).toHaveLength(1)
    expect(screen.getAllByText('Left')).toHaveLength(1)
  })

  it('editing a row field updates the correct side', () => {
    render(<Sidewalls />)
    const numericInputs = screen.getAllByRole('spinbutton')
    fireEvent.change(numericInputs[3], { target: { value: '3.5' } })
    const rows = useQuotationStore.getState().roof.sidewalls!
    expect(rows[1].side).toBe('BACK')
    expect(rows[1].height).toBe(3.5)
    expect(rows[0].height).toBe(0)
  })

  it('restores four rows after the section is re-enabled', () => {
    useQuotationStore.getState().toggleRoofSection('sidewalls', false)
    useQuotationStore.getState().toggleRoofSection('sidewalls', true)
    expect(useQuotationStore.getState().roof.sidewalls?.map((row) => row.side)).toEqual([
      'FRONT', 'BACK', 'RIGHT', 'LEFT',
    ])
  })

  it('flags every blank row when validation is shown', () => {
    useQuotationStore.setState({ showValidation: true })
    render(<Sidewalls />)
    expect(screen.getAllByText('Thickness is required')).toHaveLength(4)
    expect(screen.getAllByText('Height is required')).toHaveLength(4)
  })
})
