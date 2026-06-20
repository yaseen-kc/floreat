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
import { updateCanopy, useUpdateCanopy } from '@/api/quotation/canopy/putCanopy'
import type { UpdateCanopyPayload } from '@/api/quotation/canopy/putCanopy'
import type { Canopy } from '@/api/quotation/canopy/getCanopy'
import { canopyKeys } from '@/api/quotation/canopy/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const payload: UpdateCanopyPayload = {
  canopies: [{ code: 'CANOPY-1', length: 12 }],
}

const canopy: Canopy = {
  id: 'canopy-1',
  jobId: 'job-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  canopies: [],
}

describe('updateCanopy', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with PUT method, nested job canopy path, and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(canopy)

    const result = await updateCanopy('token-123', 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/canopy', 'token-123', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    expect(result).toEqual(canopy)
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce(canopy)

    await updateCanopy(null, 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/canopy', null, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(updateCanopy('token', 'job-1', payload)).rejects.toThrow('API error: 404')
  })
})

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, queryClient }
}

describe('useUpdateCanopy', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('updates the canopy and returns the typed canopy', async () => {
    mockedApiFetch.mockResolvedValueOnce(canopy)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useUpdateCanopy(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(canopy)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/canopy', 'test-token', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  })

  it('invalidates the canopy detail and lists caches on success', async () => {
    mockedApiFetch.mockResolvedValueOnce(canopy)
    const { wrapper, queryClient } = makeWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateCanopy(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: canopyKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: canopyKeys.lists() })
  })
})
