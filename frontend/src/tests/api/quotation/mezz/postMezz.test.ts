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
import { upsertMezzanine, useUpsertMezzanine } from '@/api/quotation/mezz/postMezz'
import type { CreateMezzaninePayload } from '@/api/quotation/mezz/postMezz'
import type { Mezzanine } from '@/api/quotation/mezz/getMezz'
import { mezzanineKeys } from '@/api/quotation/mezz/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const payload: CreateMezzaninePayload = {
  floors: [
    {
      code: 'MEZ-1',
      floor: 'FLOOR_1',
      type: 'DECK_SHEET',
      heightFrom: 'GROUND',
      thicknessMm: 120,
      lengthM: 10,
      widthM: 5,
      heightM: 3,
      materialConsumptionKgPerSqft: 12.5,
      beamsMidPrimary: 2,
      beamsEndPrimary: 1,
      beamsSecondary: 4,
      jointsMidPrimary: 1,
      jointsEndPrimary: 0,
      internalColumnsMidPrimary: 0,
      internalColumnsEndPrimary: 0,
    },
  ],
  extensions: [
    {
      type: 'PANEL',
      heightFrom: 'FIRST_FLOOR',
      typicalTo: 'FLOOR_3',
      thicknessMm: 100,
      lengthM: 8,
      widthM: 4,
      heightM: 3,
    },
  ],
}

const mezzanine: Mezzanine = {
  id: 'mezz-1',
  jobId: 'job-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  floors: [],
  extensions: [],
}

describe('upsertMezzanine', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with POST method, nested job mezzanine path, and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(mezzanine)

    const result = await upsertMezzanine('token-123', 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/mezzanine', 'token-123', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    expect(result).toEqual(mezzanine)
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce(mezzanine)

    await upsertMezzanine(null, 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/mezzanine', null, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 400'))

    await expect(upsertMezzanine('token', 'job-1', payload)).rejects.toThrow('API error: 400')
  })
})

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, queryClient }
}

describe('useUpsertMezzanine', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('upserts the mezzanine and returns the typed mezzanine', async () => {
    mockedApiFetch.mockResolvedValueOnce(mezzanine)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useUpsertMezzanine(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mezzanine)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/mezzanine', 'test-token', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  })

  it('invalidates the mezzanine detail and lists caches on success', async () => {
    mockedApiFetch.mockResolvedValueOnce(mezzanine)
    const { wrapper, queryClient } = makeWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpsertMezzanine(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: mezzanineKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: mezzanineKeys.lists() })
  })
})
