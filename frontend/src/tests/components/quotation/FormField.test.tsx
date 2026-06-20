import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Field, ErrMsg } from '@/components/quotation/shared/FormField'

describe('FormField shared primitives', () => {
  it('renders the label and a required asterisk when required', () => {
    render(<Field label="Project No" value="" required error={false} onChange={() => {}} />)
    const label = screen.getByText('Project No')
    expect(label).toBeInTheDocument()
    expect(label.querySelector('span')?.textContent).toBe('*')
  })

  it('omits the asterisk when not required', () => {
    render(<Field label="Client Name" value="" required={false} error={false} onChange={() => {}} />)
    expect(screen.getByText('Client Name').querySelector('span')).toBeNull()
  })

  it('shows an error border and message when error is true', () => {
    render(<Field label="Subject" value="" required error onChange={() => {}} />)
    expect(screen.getByText('Subject is required')).toBeInTheDocument()
    const input = screen.getByText('Subject').parentElement!.querySelector('input')!
    expect(input.className).toContain('border-destructive')
  })

  it('does not render an error message when error is false', () => {
    render(<Field label="Subject" value="x" required error={false} onChange={() => {}} />)
    expect(screen.queryByText('Subject is required')).not.toBeInTheDocument()
  })

  it('forwards typed input to onChange', async () => {
    const onChange = vi.fn()
    render(<Field label="Ref No" value="" required error={false} onChange={onChange} />)
    await userEvent.type(screen.getByText('Ref No').parentElement!.querySelector('input')!, 'A')
    expect(onChange).toHaveBeenCalledWith('A')
  })

  it('ErrMsg renders its children', () => {
    render(<ErrMsg>Something went wrong</ErrMsg>)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})
