import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mocks = vi.hoisted(() => ({
  rows: [] as Array<Record<string, unknown>>,
  isLoading: false,
  isError: false,
  createRateMutateAsync: vi.fn(),
  updateRateMutateAsync: vi.fn(),
}))

vi.mock('@/hooks/useRateHydration', () => ({
  useRateHydration: () => ({ rows: mocks.rows, isLoading: mocks.isLoading, isError: mocks.isError }),
}))

vi.mock('@/api/quotation/rate/postRate', () => ({
  useCreateRate: () => ({ mutateAsync: mocks.createRateMutateAsync, isPending: false }),
}))

vi.mock('@/api/quotation/rate/putRate', () => ({
  useUpdateRate: () => ({ mutateAsync: mocks.updateRateMutateAsync, isPending: false }),
}))

import { Step10Rate } from '@/components/quotation/steps/Step10Rate'

describe('Step10Rate', () => {
  beforeEach(() => {
    mocks.rows = [
      {
        item: 'STEEL STRUCTURE',
        unit: 'KG',
        material: 63,
        fabrication: 15,
        transportation: 1.5,
        installation: 8,
        loadingUnloading: 3,
        overheads: 0,
        others: 0,
        marginPercentage: 15,
      },
      { item: 'WIND BRACING - ROD', unit: 'RM' },
    ]
    mocks.isLoading = false
    mocks.isError = false
    mocks.createRateMutateAsync.mockReset()
    mocks.updateRateMutateAsync.mockReset()
    mocks.createRateMutateAsync.mockResolvedValue({ id: 'saved-1' })
  })

  it('renders the rate master heading and table rows', () => {
    render(<Step10Rate />)

    const headings = screen.getAllByRole('heading', { name: /Rate master/i })
    expect(headings[0]).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('STEEL STRUCTURE')).toBeInTheDocument()
    expect(screen.getByText('WIND BRACING - ROD')).toBeInTheDocument()
  })

  it('opens the editor modal when a row item is clicked', async () => {
    render(<Step10Rate />)

    await userEvent.click(screen.getByRole('button', { name: 'STEEL STRUCTURE' }))

    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: /STEEL STRUCTURE/i })).toBeInTheDocument()
    expect(within(dialog).getByLabelText('STEEL STRUCTURE Material')).toBeInTheDocument()
    expect(within(dialog).getByLabelText('STEEL STRUCTURE Margin %')).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: /Save changes/i })).toBeInTheDocument()
  })

  it('saves changes and closes the editor dialog', async () => {
    render(<Step10Rate />)

    await userEvent.click(screen.getByRole('button', { name: 'STEEL STRUCTURE' }))

    const dialog = screen.getByRole('alertdialog')
    await userEvent.click(within(dialog).getByRole('button', { name: /Save changes/i }))

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
    expect(mocks.createRateMutateAsync).toHaveBeenCalledWith({ item: 'STEEL STRUCTURE', unit: 'KG', material: 63, fabrication: 15, transportation: 1.5, installation: 8, loadingUnloading: 3, overheads: 0, others: 0, marginPercentage: 15 })
  })
})
