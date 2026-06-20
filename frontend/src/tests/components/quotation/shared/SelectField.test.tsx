import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SelectField } from '@/components/quotation/shared/SelectField'

const OPTIONS = [
  { value: 'Z_C', label: 'Z / C Section' },
  { value: 'TUBE', label: 'Tube' },
]

describe('SelectField shared primitive', () => {
  it('renders the label and a required asterisk when required', () => {
    render(<SelectField label="Roof Purlin Type" value={undefined} options={OPTIONS} required error={false} onChange={() => {}} />)
    const label = screen.getByText('Roof Purlin Type')
    expect(label).toBeInTheDocument()
    expect(label.querySelector('span')?.textContent).toBe('*')
  })

  it('omits the asterisk when not required', () => {
    render(<SelectField label="Roof Purlin Type" value={undefined} options={OPTIONS} required={false} error={false} onChange={() => {}} />)
    expect(screen.getByText('Roof Purlin Type').querySelector('span')).toBeNull()
  })

  it('shows the placeholder when no value is selected', () => {
    render(<SelectField label="Roof Purlin Type" value={undefined} options={OPTIONS} required error={false} placeholder="Pick one" onChange={() => {}} />)
    expect(screen.getByText('Pick one')).toBeInTheDocument()
  })

  it('shows the selected option label when a value is set', () => {
    render(<SelectField label="Roof Purlin Type" value="TUBE" options={OPTIONS} required error={false} onChange={() => {}} />)
    expect(screen.getByText('Tube')).toBeInTheDocument()
  })

  it('shows an error message and marks the trigger invalid when error is true', () => {
    render(<SelectField label="Roof Purlin Type" value={undefined} options={OPTIONS} required error onChange={() => {}} />)
    expect(screen.getByText('Roof Purlin Type is required')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })
})
