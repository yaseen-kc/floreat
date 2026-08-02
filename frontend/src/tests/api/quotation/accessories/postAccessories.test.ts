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
import { upsertAccessories, useUpsertAccessories } from '@/api/quotation/accessories/postAccessories'
import type { CreateAccessoriesPayload } from '@/api/quotation/accessories/postAccessories'
import type { Accessories } from '@/api/quotation/accessories/getAccessories'
import { accessoriesKeys } from '@/api/quotation/accessories/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const payload: CreateAccessoriesPayload = {
  gutterType: 'PPGL',
  gutterSize: 'IN_6',
  doorHeight: 2, doorWidth: 1, doorNos: 1,
}

const accessories = {
  id: 'acc-1',
  jobId: 'job-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
} as unknown as Accessories

describe('upsertAccessories', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with POST method, nested job accessories path, and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(accessories)

    const result = await upsertAccessories('token-123', 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/accessories', 'token-123', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    expect(result).toEqual(accessories)
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 400'))

    await expect(upsertAccessories('token', 'job-1', payload)).rejects.toThrow('API error: 400')
  })
})

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, queryClient }
}

describe('useUpsertAccessories', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('upserts the accessories and returns the typed accessories', async () => {
    mockedApiFetch.mockResolvedValueOnce(accessories)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useUpsertAccessories(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(accessories)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/accessories', 'test-token', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  })

  it('invalidates the accessories detail and lists caches on success', async () => {
    mockedApiFetch.mockResolvedValueOnce(accessories)
    const { wrapper, queryClient } = makeWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpsertAccessories(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: accessoriesKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: accessoriesKeys.lists() })
  })
})
