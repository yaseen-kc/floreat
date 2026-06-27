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
import { getLoads, getLoadByJobId, useLoads, useLoad } from '@/api/quotation/load/getLoad'
import type { GetLoadsResponse, Load } from '@/api/quotation/load/getLoad'
import { loadKeys } from '@/api/quotation/load/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const load: Load = {
  id: 'load-1',
  jobId: 'job-1',
  deadLoadOnRoofRafters: '0.500',
  liveLoadOnRoofRafters: '0.750',
  collateralLoadOnRoofRafters: null,
  windLoadOnRoofRaftersUpward: null,
  windLoadHorizontal: null,
  deadLoadOnRoofFloor: null,
  liveLoadOnRoofFloor: null,
  floorDeadLoad: null,
  floorFinishLoad: null,
  floorLiveLoad: null,
  snowLoad: null,
  earthquakeLoad: null,
  approvalDrawingsTime: 2,
  approvalDrawingsUnit: 'WEEKS',
  supplyOfMaterialsDays: 30,
  erectionOfStructureDays: 15,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper }
}

describe('loadKeys factory', () => {
  it('roots everything under "loads"', () => {
    expect(loadKeys.all).toEqual(['loads'])
  })

  it('builds list keys with a stable prefix', () => {
    expect(loadKeys.lists()).toEqual(['loads', 'list'])
    expect(loadKeys.list(2, 25)).toEqual(['loads', 'list', { page: 2, pageSize: 25 }])
  })

  it('shares the list prefix so invalidating lists() matches list(...)', () => {
    const prefix = loadKeys.lists()
    const concrete = loadKeys.list(1, 10)
    expect(concrete.slice(0, prefix.length)).toEqual(prefix)
  })

  it('builds detail keys keyed by jobId', () => {
    expect(loadKeys.details()).toEqual(['loads', 'detail'])
    expect(loadKeys.detail('job-1')).toEqual(['loads', 'detail', 'job-1'])
  })
})

describe('getLoads', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the paginated /api/loads path and token', async () => {
    const response: GetLoadsResponse = { data: [load], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)

    const result = await getLoads('token-123', 1, 10)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/loads?page=1&pageSize=10', 'token-123')
    expect(result).toEqual(response)
  })

  it('applies default page/pageSize when omitted', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 1, pageSize: 10 })

    await getLoads('token')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/loads?page=1&pageSize=10', 'token')
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 2, pageSize: 5 })

    await getLoads(null, 2, 5)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/loads?page=2&pageSize=5', null)
  })
})

describe('getLoadByJobId', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the nested job load path and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(load)

    const result = await getLoadByJobId('token-123', 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/load', 'token-123')
    expect(result).toEqual(load)
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(getLoadByJobId('token', 'missing')).rejects.toThrow('API error: 404')
  })
})

describe('useLoads', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches and returns a typed paginated load list', async () => {
    const response: GetLoadsResponse = { data: [load], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useLoads(1, 10), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(response)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/loads?page=1&pageSize=10', 'test-token')
  })
})

describe('useLoad', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches the load for a given jobId', async () => {
    mockedApiFetch.mockResolvedValueOnce(load)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useLoad('job-1'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(load)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/load', 'test-token')
  })

  it('stays disabled and does not fetch when jobId is empty', async () => {
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useLoad(''), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockedApiFetch).not.toHaveBeenCalled()
  })
})
