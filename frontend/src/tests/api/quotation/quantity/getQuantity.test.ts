import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

vi.mock('@clerk/react', () => ({
  useAuth: () => ({ getToken: vi.fn().mockResolvedValue('test-token') }),
}))

vi.mock('@/lib/api', () => ({
  apiFetch: vi.fn(),
}))

import { apiFetch } from '@/lib/api'
import { getQuantities, getQuantityByJobId, useQuantities, useQuantity } from '@/api/quotation/quantity/getQuantity'
import type { GetQuantitiesResponse, Quantity } from '@/api/quotation/quantity/getQuantity'
import { quantityKeys } from '@/api/quotation/quantity/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const quantity: Quantity = {
  id: 'quantity-1',
  jobId: 'job-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  pebRoof: null,
  cladding: null,
  canopy: null,
  accessories: null,
  mezzanine: null,
  stair: null,
  additionalBolts: null,
}

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper }
}

describe('quantityKeys factory', () => {
  it('roots everything under "quantities"', () => {
    expect(quantityKeys.all).toEqual(['quantities'])
  })

  it('builds list keys with a stable prefix', () => {
    expect(quantityKeys.lists()).toEqual(['quantities', 'list'])
    expect(quantityKeys.list(2, 25)).toEqual(['quantities', 'list', { page: 2, pageSize: 25 }])
  })

  it('builds detail keys keyed by jobId', () => {
    expect(quantityKeys.details()).toEqual(['quantities', 'detail'])
    expect(quantityKeys.detail('job-1')).toEqual(['quantities', 'detail', 'job-1'])
  })
})

describe('getQuantities', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the paginated /api/quantities path and token', async () => {
    const response: GetQuantitiesResponse = { data: [quantity], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)

    const result = await getQuantities('token-123', 1, 10)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/quantities?page=1&pageSize=10', 'token-123')
    expect(result).toEqual(response)
  })

  it('applies default page/pageSize when omitted', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 1, pageSize: 10 })

    await getQuantities('token')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/quantities?page=1&pageSize=10', 'token')
  })
})

describe('getQuantityByJobId', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the nested job quantity path and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(quantity)

    const result = await getQuantityByJobId('token-123', 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/quantity', 'token-123')
    expect(result).toEqual(quantity)
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(getQuantityByJobId('token', 'missing')).rejects.toThrow('API error: 404')
  })
})

describe('useQuantities', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches and returns a typed paginated quantity list', async () => {
    const response: GetQuantitiesResponse = { data: [quantity], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useQuantities(1, 10), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(response)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/quantities?page=1&pageSize=10', 'test-token')
  })
})

describe('useQuantity', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches the quantity for a given jobId', async () => {
    mockedApiFetch.mockResolvedValueOnce(quantity)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useQuantity('job-1'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(quantity)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/quantity', 'test-token')
  })

  it('stays disabled and does not fetch when jobId is empty', async () => {
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useQuantity(''), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockedApiFetch).not.toHaveBeenCalled()
  })
})
