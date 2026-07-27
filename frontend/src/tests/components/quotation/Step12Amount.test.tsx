import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/api/quotation/amount/getAmount', () => ({
  useAmount: () => ({ data: undefined }),
}))

vi.mock('@/api/quotation/rate/getRate', () => ({
  useRates: () => ({ data: { data: [] } }),
}))

import { Step12Amount } from '@/components/quotation/steps/Step12Amount'
import { useQuotationStore } from '@/stores/quotation-store'

describe('Step12Amount', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    useQuotationStore.setState({ jobId: 'job-123' })
  })

  it('renders the amount heading and table', () => {
    render(<Step12Amount />)

    expect(screen.getAllByRole('heading', { name: 'Amount' })).toHaveLength(2)
    expect(screen.getByRole('columnheader', { name: 'Description' })).toBeInTheDocument()
  })
})
