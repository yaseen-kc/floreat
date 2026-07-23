import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Bolt } from 'lucide-react'
import { JointBoltTable } from '@/components/quotation/sections/joint/JointBoltTable'
import { useQuotationStore } from '@/stores/quotation-store'

describe('JointBoltTable', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('renders one addressable row per roof joint code', () => {
    render(<JointBoltTable group="roof" title="Roof Joints" icon={<Bolt />} columns="diameterAndCount" />)
    // 22 roof enum members, each wrapped with id="joint-roof-{code}".
    expect(document.getElementById('joint-roof-A')).toBeInTheDocument()
    expect(document.getElementById('joint-roof-A_1')).toBeInTheDocument()
    expect(document.getElementById('joint-roof-L_1')).toBeInTheDocument()
    // Hyphenated UI label for underscore member.
    expect(screen.getByText('A_1')).toBeInTheDocument()
  })

  it('emits a store patch when a bolt count is typed', async () => {
    render(<JointBoltTable group="mezzanine" title="Mezzanine Joints" icon={<Bolt />} columns="count" />)
    const row = document.getElementById('joint-mezzanine-M') as HTMLElement
    const input = row.querySelector('input') as HTMLInputElement
    await userEvent.type(input, '8')

    const rowM = useQuotationStore
      .getState()
      .joint.jointBoltMezzanine.find((r) => r.mezzanineJointId === 'M')
    expect(rowM?.numberOfBolts).toBe(8)
  })

  it('renders count-only rows for the mezzanine group (no diameter field)', () => {
    render(<JointBoltTable group="mezzanine" title="Mezzanine Joints" icon={<Bolt />} columns="count" />)
    const row = document.getElementById('joint-mezzanine-M') as HTMLElement
    expect(row.querySelectorAll('input')).toHaveLength(1)
  })
})
