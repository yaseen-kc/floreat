import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { JointFrameDiagram } from '@/components/quotation/sections/joint/JointFrameDiagram'
import type { FrameDiagram } from '@/components/quotation/sections/joint/frameData'

const frame: FrameDiagram = {
  id: 'test-frame',
  title: 'Test Frame',
  caption: 'A tiny test frame.',
  viewBox: '0 0 200 200',
  edges: [{ x1: 10, y1: 10, x2: 190, y2: 190 }],
  nodes: [
    { x: 50, y: 50, label: 'A', group: 'roof', jointId: 'A' },
    { x: 100, y: 100, label: 'A_1', group: 'roof', jointId: 'A_1' },
    { x: 150, y: 150, label: 'FB4', group: 'foundation', jointId: 'FB4' },
  ],
}

describe('JointFrameDiagram', () => {
  it('renders a labelled, focusable node per joint', () => {
    render(<JointFrameDiagram frame={frame} onSelectJoint={() => {}} />)
    expect(screen.getByText('A_1')).toBeInTheDocument()
    expect(screen.getByText('FB4')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Joint A_1' })).toBeInTheDocument()
  })

  it('reports the store group + enum jointId on click', async () => {
    const onSelect = vi.fn()
    render(<JointFrameDiagram frame={frame} onSelectJoint={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: 'Joint A_1' }))
    expect(onSelect).toHaveBeenCalledWith('roof', 'A_1')
  })

  it('activates a node with the keyboard', async () => {
    const onSelect = vi.fn()
    render(<JointFrameDiagram frame={frame} onSelectJoint={onSelect} />)
    screen.getByRole('button', { name: 'Joint FB4' }).focus()
    await userEvent.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledWith('foundation', 'FB4')
  })
})
