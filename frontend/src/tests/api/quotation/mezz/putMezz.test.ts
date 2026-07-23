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
import { updateMezzanine, useUpdateMezzanine } from '@/api/quotation/mezz/putMezz'
import type { UpdateMezzaninePayload } from '@/api/quotation/mezz/putMezz'
import type { Mezzanine } from '@/api/quotation/mezz/getMezz'
import { mezzanineKeys } from '@/api/quotation/mezz/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const payload: UpdateMezzaninePayload = {
  floors: [
    {
      code: 'MEZ_1',
      floor: 'FLOOR_2',
      type: 'RCC_SLAB',
      heightFrom: 'GROUND',
      thicknessMm: 150,
      lengthM: 12,
      widthM: 6,
      heightM: 3.5,
      materialConsumptionKgPerSqft: 14,
      beamsMidPrimary: 3,
      beamsEndPrimary: 2,
      beamsSecondary: 5,
      jointsMidPrimary: 2,
      jointsEndPrimary: 1,
      internalColumnsMidPrimary: 1,
      internalColumnsEndPrimary: 1,
    },
  ],
}

const mezzanine: Mezzanine = {
  id: 'mezz-1',
  jobId: 'job-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
  floors: [],
  extensions: [],
}

describe('updateMezzanine', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with PUT method, nested job mezzanine path, and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(mezzanine)

    const result = await updateMezzanine('token-123', 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/mezzanine', 'token-123', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    expect(result).toEqual(mezzanine)
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce(mezzanine)

    await updateMezzanine(null, 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/mezzanine', null, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(updateMezzanine('token', 'job-1', payload)).rejects.toThrow('API error: 404')
  })
})

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, queryClient }
}

describe('useUpdateMezzanine', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('updates the mezzanine and returns the typed mezzanine', async () => {
    mockedApiFetch.mockResolvedValueOnce(mezzanine)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useUpdateMezzanine(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mezzanine)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/mezzanine', 'test-token', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  })

  it('invalidates the mezzanine detail and lists caches on success', async () => {
    mockedApiFetch.mockResolvedValueOnce(mezzanine)
    const { wrapper, queryClient } = makeWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateMezzanine(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: mezzanineKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: mezzanineKeys.lists() })
  })
})
