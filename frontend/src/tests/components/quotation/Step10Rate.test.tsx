import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useQuotationStore } from '@/stores/quotation-store'

const mocks = vi.hoisted(() => ({
  rows: [] as Array<Record<string, unknown>>,
  isLoading: false,
  isError: false,
  createRateMutateAsync: vi.fn(),
  updateRateMutateAsync: vi.fn(),
  replaceRatesMutateAsync: vi.fn(),
  getRates: vi.fn(),
  recentJobs: [] as Array<Record<string, unknown>>,
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

vi.mock('@/api/quotation/rate/putRatesBulk', () => ({
  useReplaceRates: () => ({ mutateAsync: mocks.replaceRatesMutateAsync, isPending: false }),
}))

vi.mock('@/api/quotation/rate/getRate', () => ({
  getRates: mocks.getRates,
}))

vi.mock('@/api/quotation/jobs/getJobs', () => ({
  useJobs: () => ({ data: { data: mocks.recentJobs }, isLoading: false, isError: false }),
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
    mocks.replaceRatesMutateAsync.mockReset()
    mocks.replaceRatesMutateAsync.mockResolvedValue([])
    mocks.getRates.mockReset()
    mocks.recentJobs = []
    useQuotationStore.setState({ jobId: 'job-1' })
  })

  it('renders the rate master heading and table rows', () => {
    render(<Step10Rate />)

    const headings = screen.getAllByRole('heading', { name: /Job rates/i })
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
    expect(mocks.createRateMutateAsync).not.toHaveBeenCalled()
    expect(mocks.replaceRatesMutateAsync).not.toHaveBeenCalled()
  })

  it('enables Recently Used and applies the selected job rates', async () => {
    mocks.recentJobs = [{
      id: 'job-2',
      projectNo: 'FL-002',
      subject: 'Recent job',
      firmName: 'Recent firm',
    }]
    mocks.getRates.mockResolvedValue({
      data: [{
        id: 'rate-2',
        jobId: 'job-2',
        item: 'STEEL STRUCTURE',
        unit: 'KG',
        material: '72',
        fabrication: null,
        transportation: null,
        installation: null,
        loadingUnloading: null,
        overheads: null,
        others: null,
        marginPercentage: null,
        fabricationRate: 0,
        erectionRate: 0,
        loadingRate: 0,
        totalRate: 72,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      }],
      total: 1,
      page: 1,
      pageSize: 100,
    })
    render(<Step10Rate />)

    const recentButton = await screen.findByRole('button', { name: /Use values from Recent firm/i })
    expect(recentButton).toBeEnabled()
    await userEvent.click(recentButton)

    await waitFor(() => expect(useQuotationStore.getState().rateRows[0]).toMatchObject({ material: 72 }))
    expect(mocks.getRates).toHaveBeenCalledWith('test-token', 'job-2', 1, 100)
    expect(recentButton).toBeEnabled()
  })

  it('shows an apply error and allows retrying after a rates fetch failure', async () => {
    mocks.recentJobs = [{
      id: 'job-2',
      projectNo: 'FL-002',
      subject: 'Recent job',
      firmName: 'Recent firm',
    }]
    mocks.getRates.mockRejectedValue(new Error('rates unavailable'))
    render(<Step10Rate />)

    const recentButton = await screen.findByRole('button', { name: /Use values from Recent firm/i })
    await userEvent.click(recentButton)

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load values from this job.')
    expect(recentButton).toBeEnabled()
  })
})
