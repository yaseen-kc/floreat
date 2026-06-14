import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FrameMembers } from '@/components/quotation/sections/roof/FrameMembers'
import { useQuotationStore } from '@/stores/quotation-store'

describe('FrameMembers section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('renders the toggle and hides the fields when disabled', () => {
    render(<FrameMembers />)
    expect(screen.getByText('Members')).toBeInTheDocument()
    expect(screen.getByRole('switch')).toBeInTheDocument()
    expect(screen.queryByText('Column Segments (Main Frame)')).not.toBeInTheDocument()
  })

  it('flags the section as required when validation runs and it is left disabled', () => {
    useQuotationStore.setState({ showValidation: true })
    render(<FrameMembers />)
    expect(
      screen.getByText('This section is required — enable it and complete all fields.'),
    ).toBeInTheDocument()
  })

  it('reveals the 5 member fields when the section is enabled', () => {
    useQuotationStore.getState().toggleRoofSection('members', true)
    render(<FrameMembers />)
    expect(screen.getByText('Column Segments (Main Frame)')).toBeInTheDocument()
    expect(screen.getByText('Rafters in One Half (Main Frame)')).toBeInTheDocument()
    expect(screen.getByText('Column Segments (End Frame)')).toBeInTheDocument()
    expect(screen.getByText('Rafters in One Half (End Frame)')).toBeInTheDocument()
    expect(screen.getByText('End Frame Horizontal Tie Beam')).toBeInTheDocument()
  })

  it('clicking the switch enables the section', () => {
    render(<FrameMembers />)
    fireEvent.click(screen.getByRole('switch'))
    expect(useQuotationStore.getState().roofSectionsEnabled.members).toBe(true)
  })

  it('editing a field updates the store', () => {
    useQuotationStore.getState().toggleRoofSection('members', true)
    render(<FrameMembers />)
    const input = screen.getByText('Column Segments (Main Frame)').parentElement!.querySelector('input')!
    fireEvent.change(input, { target: { value: '3' } })
    expect(useQuotationStore.getState().roof.columnSegmentsInMainFrame).toBe(3)
  })

  it('disabling the section clears its fields', () => {
    useQuotationStore.getState().toggleRoofSection('members', true)
    useQuotationStore.getState().setRoof({ columnSegmentsInMainFrame: 4 })
    useQuotationStore.getState().toggleRoofSection('members', false)
    expect(useQuotationStore.getState().roof.columnSegmentsInMainFrame).toBeUndefined()
  })
})
