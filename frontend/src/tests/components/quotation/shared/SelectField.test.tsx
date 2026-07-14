import { describe, it, expect, vi } from 'vitest'
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

  it('stays controlled across an undefined→value transition (no controlled/uncontrolled warning)', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { rerender } = render(
      <SelectField label="Roof Purlin Type" value={undefined} options={OPTIONS} required error={false} placeholder="Pick one" onChange={() => {}} />,
    )
    // Starts empty: placeholder is shown (no selected option).
    expect(screen.getByText('Pick one')).toBeInTheDocument()

    // Selecting a value must not flip the underlying Select from uncontrolled to controlled.
    rerender(
      <SelectField label="Roof Purlin Type" value="TUBE" options={OPTIONS} required error={false} placeholder="Pick one" onChange={() => {}} />,
    )
    expect(screen.getByText('Tube')).toBeInTheDocument()

    const warned = errorSpy.mock.calls.some((args) =>
      args.some((a) => typeof a === 'string' && a.includes('changing from uncontrolled to controlled')),
    )
    expect(warned).toBe(false)
    errorSpy.mockRestore()
  })
})
