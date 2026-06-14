import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { JobInformations } from '@/components/quotation/sections/jobInfo/JobInformations'
import { useQuotationStore } from '@/stores/quotation-store'

describe('JobInformations form (schema-driven)', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('shows errors for empty required fields but not for optional ones', () => {
    useQuotationStore.setState({ showValidation: true })
    render(<JobInformations />)

    // Required fields surface a validation error.
    expect(screen.getByText('Project No is required')).toBeInTheDocument()
    expect(screen.getByText('Designed By (Name) is required')).toBeInTheDocument()

    // Optional contact fields and firmName do not.
    expect(screen.queryByText('Client Name is required')).not.toBeInTheDocument()
    expect(screen.queryByText('Estimation Engineer (Name) is required')).not.toBeInTheDocument()
    expect(screen.queryByText('Head of Sales (Name) is required')).not.toBeInTheDocument()
    expect(screen.queryByText('Firm Name is required')).not.toBeInTheDocument()
  })

  it('does not mark optional fields with a required asterisk', () => {
    render(<JobInformations />)

    const clientLabel = screen.getByText('Client Name')
    expect(clientLabel.querySelector('span')).toBeNull()

    const firmLabel = screen.getByText('Firm Name')
    expect(firmLabel.querySelector('span')).toBeNull()
  })

  it('renders an editable, optional Firm Name field wired to the store', async () => {
    render(<JobInformations />)

    const firmLabel = screen.getByText('Firm Name')
    const input = firmLabel.parentElement!.querySelector('input')!
    await userEvent.type(input, 'Acme Co')

    expect(useQuotationStore.getState().projectInfo.firmName).toBe('Acme Co')
  })
})
