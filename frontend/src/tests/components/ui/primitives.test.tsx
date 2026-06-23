import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Segmented } from '@/components/ui/segmented'
import { Num } from '@/components/ui/num'

describe('Segmented', () => {
  const options = [
    { label: 'Metric', value: 'metric' },
    { label: 'Imperial', value: 'imperial' },
  ] as const

  it('marks the active option as checked and the others as not', () => {
    render(<Segmented options={[...options]} value="metric" onChange={() => {}} />)
    expect(screen.getByRole('radio', { name: 'Metric' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Imperial' })).toHaveAttribute('aria-checked', 'false')
  })

  it('emits the chosen value on click', async () => {
    const onChange = vi.fn()
    render(<Segmented options={[...options]} value="metric" onChange={onChange} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Imperial' }))
    expect(onChange).toHaveBeenCalledWith('imperial')
  })
})

describe('Num', () => {
  it('renders its figure with the mono + tabular-nums data styling', () => {
    render(<Num>1,240</Num>)
    const el = screen.getByText('1,240')
    expect(el.className).toContain('font-mono')
    expect(el.className).toContain('tabular-nums')
  })
})
