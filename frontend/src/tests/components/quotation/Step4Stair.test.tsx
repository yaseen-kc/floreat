import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mocks = vi.hoisted(() => ({ stairData: undefined as unknown }))

vi.mock('@/api/quotation/stair/getStairs', () => ({
  useStair: () => ({ data: mocks.stairData }),
}))

import { Step4Stair } from '@/components/quotation/steps/Step4Stair'
import { useQuotationStore } from '@/stores/quotation-store'

describe('Step4Stair', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    mocks.stairData = undefined
  })

  it('renders the heading and the stair toggle', () => {
    render(<Step4Stair />)
    expect(screen.getByRole('heading', { name: 'Stair' })).toBeInTheDocument()
    expect(screen.getByText('This job has a stair')).toBeInTheDocument()
  })

  it('hides the editors until the toggle is on', () => {
    render(<Step4Stair />)
    expect(screen.queryByText('Staircases')).not.toBeInTheDocument()
    expect(screen.queryByText('Area Deductions')).not.toBeInTheDocument()
  })

  it('reveals the staircases/area-deductions editors when the toggle is enabled', async () => {
    const user = userEvent.setup()
    render(<Step4Stair />)
    await user.click(screen.getByRole('switch', { name: 'This job has a stair' }))
    expect(screen.getByText('Staircases')).toBeInTheDocument()
    expect(screen.getByText('Area Deductions')).toBeInTheDocument()
  })

  it('adds a staircase row with an auto-assigned code', async () => {
    const user = userEvent.setup()
    useQuotationStore.getState().setHasStair(true)
    render(<Step4Stair />)

    await user.click(screen.getByRole('button', { name: /add staircase/i }))
    expect(screen.getByText('Staircase 1')).toBeInTheDocument()
    await waitFor(() => expect(useQuotationStore.getState().stair.stairs).toHaveLength(1))
    expect(useQuotationStore.getState().stair.stairs[0].code).toBe('STAIR-1')
  })
})
