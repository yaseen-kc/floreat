import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mocks = vi.hoisted(() => ({ mezzData: undefined as unknown }))

vi.mock('@/api/quotation/mezz/getMezz', () => ({
  useMezzanine: () => ({ data: mocks.mezzData }),
}))

import { Step3Mezzanine } from '@/components/quotation/steps/Step3Mezzanine'
import { useQuotationStore } from '@/stores/quotation-store'

describe('Step3Mezzanine', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    mocks.mezzData = undefined
  })

  it('renders the heading and the mezzanine toggle', () => {
    render(<Step3Mezzanine />)
    expect(screen.getByRole('heading', { name: 'Mezzanine' })).toBeInTheDocument()
    expect(screen.getByText('This job has a mezzanine')).toBeInTheDocument()
  })

  it('hides the editors until the toggle is on', () => {
    render(<Step3Mezzanine />)
    expect(screen.queryByText('Floors')).not.toBeInTheDocument()
    expect(screen.queryByText('Floor Extensions')).not.toBeInTheDocument()
  })

  it('reveals the floors/extensions editors when the toggle is enabled', async () => {
    const user = userEvent.setup()
    render(<Step3Mezzanine />)
    await user.click(screen.getByRole('switch', { name: 'This job has a mezzanine' }))
    expect(screen.getByText('Floors')).toBeInTheDocument()
    expect(screen.getByText('Floor Extensions')).toBeInTheDocument()
  })

  it('adds a floor row with an auto-assigned code', async () => {
    const user = userEvent.setup()
    useQuotationStore.getState().setHasMezzanine(true)
    render(<Step3Mezzanine />)

    await user.click(screen.getByRole('button', { name: /add floor/i }))
    expect(screen.getByText('Floor 1')).toBeInTheDocument()
    await waitFor(() => expect(useQuotationStore.getState().mezzanine.floors).toHaveLength(1))
    expect(useQuotationStore.getState().mezzanine.floors[0].code).toBe('MEZ-1')
  })
})
