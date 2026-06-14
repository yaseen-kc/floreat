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

  it('shows errors for every empty required field, including the contact fields', () => {
    useQuotationStore.setState({ showValidation: true })
    render(<JobInformations />)

    expect(screen.getByText('Project No is required')).toBeInTheDocument()
    expect(screen.getByText('Designed By (Name) is required')).toBeInTheDocument()

    // Previously-optional fields are now required too.
    expect(screen.getByText('Client Name is required')).toBeInTheDocument()
    expect(screen.getByText('Estimation Engineer (Name) is required')).toBeInTheDocument()
    expect(screen.getByText('Head of Sales (Name) is required')).toBeInTheDocument()
    expect(screen.getByText('Firm Name is required')).toBeInTheDocument()
  })

  it('marks every field with a required asterisk', () => {
    render(<JobInformations />)

    for (const label of ['Client Name', 'Firm Name', 'Estimation Engineer (Name)', 'Head of Sales (Name)']) {
      expect(screen.getByText(label).querySelector('span')?.textContent).toBe('*')
    }
  })

  it('renders an editable Firm Name field wired to the store', async () => {
    render(<JobInformations />)

    const firmLabel = screen.getByText('Firm Name')
    const input = firmLabel.parentElement!.querySelector('input')!
    await userEvent.type(input, 'Acme Co')

    expect(useQuotationStore.getState().projectInfo.firmName).toBe('Acme Co')
  })
})
