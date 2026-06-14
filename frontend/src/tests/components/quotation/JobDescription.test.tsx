import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { JobDescription } from '@/components/quotation/sections/jobInfo/JobDescription'
import { useQuotationStore } from '@/stores/quotation-store'

describe('JobDescription (schema-driven)', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('renders the correct section title (not the JobInformations title)', () => {
    render(<JobDescription />)
    expect(screen.getByText('Building Description')).toBeInTheDocument()
    expect(screen.queryByText('Job Information')).not.toBeInTheDocument()
  })

  it('marks all of its fields as required (per schema)', () => {
    render(<JobDescription />)
    for (const label of ['Building Usage', 'Number of Buildings', 'Frame Type', 'Configuration']) {
      expect(screen.getByText(label).querySelector('span')?.textContent).toBe('*')
    }
  })

  it('surfaces schema errors for empty required fields when validation is shown', () => {
    useQuotationStore.setState({ showValidation: true })
    render(<JobDescription />)

    expect(screen.getByText('Building Usage is required')).toBeInTheDocument()
    expect(screen.getByText('Frame Type is required')).toBeInTheDocument()
    expect(screen.getByText('Configuration is required')).toBeInTheDocument()
    expect(screen.getByText('At least 1 building required')).toBeInTheDocument()
  })

  it('does not show errors before validation is triggered', () => {
    render(<JobDescription />)
    expect(screen.queryByText('Building Usage is required')).not.toBeInTheDocument()
    expect(screen.queryByText('At least 1 building required')).not.toBeInTheDocument()
  })

  it('clears the numberOfBuilding error once a valid count is entered', async () => {
    useQuotationStore.getState().setProjectInfo({ buildingUsage: 'Office', frameType: 'Steel', configuration: 'Std' })
    useQuotationStore.setState({ showValidation: true })
    render(<JobDescription />)

    expect(screen.getByText('At least 1 building required')).toBeInTheDocument()

    const numInput = screen.getByText('Number of Buildings').parentElement!.querySelector('input')!
    await userEvent.type(numInput, '2')

    expect(useQuotationStore.getState().projectInfo.numberOfBuilding).toBe(2)
    expect(screen.queryByText('At least 1 building required')).not.toBeInTheDocument()
  })

  it('wires text fields to the store', async () => {
    render(<JobDescription />)
    const input = screen.getByText('Building Usage').parentElement!.querySelector('input')!
    await userEvent.type(input, 'Warehouse')
    expect(useQuotationStore.getState().projectInfo.buildingUsage).toBe('Warehouse')
  })
})
