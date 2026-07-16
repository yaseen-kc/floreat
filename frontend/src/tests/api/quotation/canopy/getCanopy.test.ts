import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Clerk's useAuth -> a getToken stub returning a fixed token.
vi.mock('@clerk/react', () => ({
  useAuth: () => ({ getToken: vi.fn().mockResolvedValue('test-token') }),
}))

vi.mock('@/lib/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/api')>()),
  apiFetch: vi.fn(),
}))

import { apiFetch } from '@/lib/api'
import { getCanopies, getCanopyByJobId, useCanopies, useCanopy } from '@/api/quotation/canopy/getCanopy'
import type { GetCanopiesResponse, Canopy } from '@/api/quotation/canopy/getCanopy'
import { canopyKeys } from '@/api/quotation/canopy/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const canopy: Canopy = {
  id: 'canopy-1',
  jobId: 'job-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  canopies: [
    {
      id: 'item-1',
      canopyId: 'canopy-1',
      code: 'CANOPY-1',
      heightFrom: 'GROUND',
      length: '10.000',
      width: '5.000',
      height: '3.000',
      materialConsumptionKgPerSqft: '2.500',
      numberOfBeams: 4,
      numberOfPurlins: 8,
      purlinDepth: '150.000',
      unitWeightOfPurlin: '5.000',
      canopySheet: 'NCGL',
      sheetThick: '0.500',
      canopySideCoveringHeight: '1.200',
      gutter: true,
      downTake: false,
      flashing: true,
    },
  ],
}

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper }
}

describe('canopyKeys factory', () => {
  it('roots everything under "canopies"', () => {
    expect(canopyKeys.all).toEqual(['canopies'])
  })

  it('builds list keys with a stable prefix', () => {
    expect(canopyKeys.lists()).toEqual(['canopies', 'list'])
    expect(canopyKeys.list(2, 25)).toEqual(['canopies', 'list', { page: 2, pageSize: 25 }])
  })

  it('shares the list prefix so invalidating lists() matches list(...)', () => {
    const prefix = canopyKeys.lists()
    const concrete = canopyKeys.list(1, 10)
    expect(concrete.slice(0, prefix.length)).toEqual(prefix)
  })

  it('builds detail keys keyed by jobId', () => {
    expect(canopyKeys.details()).toEqual(['canopies', 'detail'])
    expect(canopyKeys.detail('job-1')).toEqual(['canopies', 'detail', 'job-1'])
  })
})

describe('getCanopies', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the paginated /api/canopies path and token', async () => {
    const response: GetCanopiesResponse = { data: [canopy], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)

    const result = await getCanopies('token-123', 1, 10)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/canopies?page=1&pageSize=10', 'token-123')
    expect(result).toEqual(response)
  })

  it('applies default page/pageSize when omitted', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 1, pageSize: 10 })

    await getCanopies('token')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/canopies?page=1&pageSize=10', 'token')
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 2, pageSize: 5 })

    await getCanopies(null, 2, 5)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/canopies?page=2&pageSize=5', null)
  })
})

describe('getCanopyByJobId', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the nested job canopy path and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(canopy)

    const result = await getCanopyByJobId('token-123', 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/canopy', 'token-123')
    expect(result).toEqual(canopy)
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(getCanopyByJobId('token', 'missing')).rejects.toThrow('API error: 404')
  })
})

describe('useCanopies', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches and returns a typed paginated canopy list', async () => {
    const response: GetCanopiesResponse = { data: [canopy], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useCanopies(1, 10), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(response)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/canopies?page=1&pageSize=10', 'test-token')
  })
})

describe('useCanopy', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches the canopy for a given jobId', async () => {
    mockedApiFetch.mockResolvedValueOnce(canopy)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useCanopy('job-1'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(canopy)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/canopy', 'test-token')
  })

  it('stays disabled and does not fetch when jobId is empty', async () => {
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useCanopy(''), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockedApiFetch).not.toHaveBeenCalled()
  })
})
