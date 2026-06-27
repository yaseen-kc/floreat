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
import { updateLoad, useUpdateLoad } from '@/api/quotation/load/putLoad'
import type { UpdateLoadPayload } from '@/api/quotation/load/putLoad'
import type { Load } from '@/api/quotation/load/getLoad'
import { loadKeys } from '@/api/quotation/load/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const payload: UpdateLoadPayload = {
  snowLoad: 1.2,
  earthquakeLoad: 0.8,
}

const load: Load = {
  id: 'load-1',
  jobId: 'job-1',
  deadLoadOnRoofRafters: null,
  liveLoadOnRoofRafters: null,
  collateralLoadOnRoofRafters: null,
  windLoadOnRoofRaftersUpward: null,
  windLoadHorizontal: null,
  deadLoadOnRoofFloor: null,
  liveLoadOnRoofFloor: null,
  floorDeadLoad: null,
  floorFinishLoad: null,
  floorLiveLoad: null,
  snowLoad: '1.200',
  earthquakeLoad: '0.800',
  approvalDrawingsTime: null,
  approvalDrawingsUnit: null,
  supplyOfMaterialsDays: null,
  erectionOfStructureDays: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('updateLoad', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with PUT method, nested job load path, and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(load)

    const result = await updateLoad('token-123', 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/load', 'token-123', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    expect(result).toEqual(load)
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce(load)

    await updateLoad(null, 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/load', null, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(updateLoad('token', 'job-1', payload)).rejects.toThrow('API error: 404')
  })
})

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, queryClient }
}

describe('useUpdateLoad', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('updates the load and returns the typed load', async () => {
    mockedApiFetch.mockResolvedValueOnce(load)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useUpdateLoad(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(load)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/load', 'test-token', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  })

  it('invalidates the load detail and lists caches on success', async () => {
    mockedApiFetch.mockResolvedValueOnce(load)
    const { wrapper, queryClient } = makeWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateLoad(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: loadKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: loadKeys.lists() })
  })
})
