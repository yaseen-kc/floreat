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

  it('renders the heading', () => {
    render(<Step3Mezzanine />)
    expect(screen.getByRole('heading', { name: 'Mezzanine' })).toBeInTheDocument()
  })

  it('always shows the floors and floor extensions editors', () => {
    render(<Step3Mezzanine />)
    expect(screen.getByText('Floors')).toBeInTheDocument()
    expect(screen.getByText('Floor Extensions')).toBeInTheDocument()
  })

  it('adds a floor row with an auto-assigned code', async () => {
    const user = userEvent.setup()
    render(<Step3Mezzanine />)

    await user.click(screen.getByRole('button', { name: /add floor/i }))
    expect(screen.getByText('Floor 1')).toBeInTheDocument()
    await waitFor(() => expect(useQuotationStore.getState().mezzanine.floors).toHaveLength(1))
    expect(useQuotationStore.getState().mezzanine.floors[0].code).toBe('MEZ_1')
  })
})
