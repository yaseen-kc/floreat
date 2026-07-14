import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TextListField } from '@/components/quotation/shared/TextListField'

describe('TextListField shared primitive', () => {
  it('renders the label and joins the value list one item per line', () => {
    render(<TextListField label="Specifications" value={['IS 2062', 'IS 800']} onChange={() => {}} />)
    expect(screen.getByText('Specifications')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('IS 2062\nIS 800')
  })

  it('emits a trimmed, blank-filtered array on change', () => {
    const onChange = vi.fn()
    render(<TextListField label="Make / Brand" value={[]} onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '  Tata  \n\n  JSW\n   ' } })
    expect(onChange).toHaveBeenCalledWith(['Tata', 'JSW'])
  })

  it('preserves an in-progress trailing newline in the visible text', () => {
    const onChange = vi.fn()
    render(<TextListField label="Specifications" value={[]} onChange={onChange} />)
    const box = screen.getByRole('textbox')
    fireEvent.change(box, { target: { value: 'IS 2062\n' } })
    // The emitted array drops the blank line...
    expect(onChange).toHaveBeenCalledWith(['IS 2062'])
    // ...but the textarea still shows the trailing newline so the user can type line 2.
    expect(box).toHaveValue('IS 2062\n')
  })
})
