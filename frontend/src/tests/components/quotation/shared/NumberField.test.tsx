import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NumberField } from '@/components/quotation/shared/NumberField'

describe('NumberField shared primitive', () => {
  it('renders the label, unit, and a required asterisk when required', () => {
    render(<NumberField label="Eave Height" value={0} unit="m" required error={false} onChange={() => {}} />)
    const label = screen.getByText('Eave Height')
    expect(label).toBeInTheDocument()
    expect(label.querySelector('span')?.textContent).toBe('*')
    expect(screen.getByText('m')).toBeInTheDocument()
  })

  it('omits the asterisk when not required', () => {
    render(<NumberField label="Eave Height" value={0} unit="m" required={false} error={false} onChange={() => {}} />)
    expect(screen.getByText('Eave Height').querySelector('span')).toBeNull()
  })

  it('shows an error message when error is true', () => {
    render(<NumberField label="Eave Height" value={0} unit="m" required error onChange={() => {}} />)
    expect(screen.getByText('Eave Height is required')).toBeInTheDocument()
  })

  it('does not render an error message when error is false', () => {
    render(<NumberField label="Eave Height" value={6} unit="m" required error={false} onChange={() => {}} />)
    expect(screen.queryByText('Eave Height is required')).not.toBeInTheDocument()
  })

  it('forwards the parsed numeric value to onChange', () => {
    const onChange = vi.fn()
    render(<NumberField label="Eave Height" value={0} unit="m" required error={false} onChange={onChange} />)
    const input = screen.getByText('Eave Height').parentElement!.querySelector('input')!
    fireEvent.change(input, { target: { value: '42' } })
    expect(onChange).toHaveBeenCalledWith(42)
  })

  it('renders a number input that accepts a step', () => {
    render(<NumberField label="Main Roof Frames" value={0} unit="count" step={1} required error={false} onChange={() => {}} />)
    const input = screen.getByText('Main Roof Frames').parentElement!.querySelector('input')!
    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('step', '1')
  })
})
