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
import { upsertLoad, useUpsertLoad } from '@/api/quotation/load/postLoad'
import type { CreateLoadPayload } from '@/api/quotation/load/postLoad'
import type { Load } from '@/api/quotation/load/getLoad'
import { loadKeys } from '@/api/quotation/load/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const payload: CreateLoadPayload = {
  deadLoadOnRoofRafters: 0.5,
  liveLoadOnRoofRafters: 0.75,
  approvalDrawingsTime: 2,
  approvalDrawingsUnit: 'WEEKS',
  supplyOfMaterialsDays: 30,
  erectionOfStructureDays: 15,
}

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

describe('upsertLoad', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with POST method, nested job load path, and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(load)

    const result = await upsertLoad('token-123', 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/load', 'token-123', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    expect(result).toEqual(load)
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce(load)

    await upsertLoad(null, 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/load', null, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 400'))

    await expect(upsertLoad('token', 'job-1', payload)).rejects.toThrow('API error: 400')
  })
})

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, queryClient }
}

describe('useUpsertLoad', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('upserts the load and returns the typed load', async () => {
    mockedApiFetch.mockResolvedValueOnce(load)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useUpsertLoad(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(load)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/load', 'test-token', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  })

  it('invalidates the load detail and lists caches on success', async () => {
    mockedApiFetch.mockResolvedValueOnce(load)
    const { wrapper, queryClient } = makeWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpsertLoad(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: loadKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: loadKeys.lists() })
  })
})
