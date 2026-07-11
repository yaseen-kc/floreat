import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Clerk's useAuth -> a getToken stub returning a fixed token.
vi.mock('@clerk/react', () => ({
  useAuth: () => ({ getToken: vi.fn().mockResolvedValue('test-token') }),
}))

vi.mock('@/lib/api', () => ({
  apiFetch: vi.fn(),
}))

import { apiFetch } from '@/lib/api'
import {
  getAccessories,
  getAccessoriesByJobId,
  useAccessories,
  useAccessory,
} from '@/api/quotation/accessories/getAccessories'
import type { GetAccessoriesResponse, Accessories } from '@/api/quotation/accessories/getAccessories'
import { accessoriesKeys } from '@/api/quotation/accessories/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const accessories = {
  id: 'acc-1',
  jobId: 'job-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  gutterQuantity: '200.000',
  gutterQuantityManual: false,
  doors: [],
  windows: [],
  foldedPlates: [],
  openings: [],
} as unknown as Accessories

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper }
}

describe('accessoriesKeys factory', () => {
  it('roots everything under "accessories"', () => {
    expect(accessoriesKeys.all).toEqual(['accessories'])
  })

  it('builds list keys with a stable prefix', () => {
    expect(accessoriesKeys.lists()).toEqual(['accessories', 'list'])
    expect(accessoriesKeys.list(2, 25)).toEqual(['accessories', 'list', { page: 2, pageSize: 25 }])
  })

  it('builds detail keys keyed by jobId', () => {
    expect(accessoriesKeys.details()).toEqual(['accessories', 'detail'])
    expect(accessoriesKeys.detail('job-1')).toEqual(['accessories', 'detail', 'job-1'])
  })
})

describe('getAccessories', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the paginated /api/accessories path and token', async () => {
    const response: GetAccessoriesResponse = { data: [accessories], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)

    const result = await getAccessories('token-123', 1, 10)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/accessories?page=1&pageSize=10', 'token-123')
    expect(result).toEqual(response)
  })

  it('applies default page/pageSize when omitted', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 1, pageSize: 10 })

    await getAccessories('token')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/accessories?page=1&pageSize=10', 'token')
  })
})

describe('getAccessoriesByJobId', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the nested job accessories path and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(accessories)

    const result = await getAccessoriesByJobId('token-123', 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/accessories', 'token-123')
    expect(result).toEqual(accessories)
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(getAccessoriesByJobId('token', 'missing')).rejects.toThrow('API error: 404')
  })
})

describe('useAccessories', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches and returns a typed paginated accessories list', async () => {
    const response: GetAccessoriesResponse = { data: [accessories], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useAccessories(1, 10), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(response)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/accessories?page=1&pageSize=10', 'test-token')
  })
})

describe('useAccessory', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches the accessories for a given jobId', async () => {
    mockedApiFetch.mockResolvedValueOnce(accessories)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useAccessory('job-1'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(accessories)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/accessories', 'test-token')
  })

  it('stays disabled and does not fetch when jobId is empty', async () => {
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useAccessory(''), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockedApiFetch).not.toHaveBeenCalled()
  })
})
