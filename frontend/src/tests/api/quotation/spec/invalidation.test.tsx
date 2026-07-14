import { describe, expect, it, vi, beforeEach } from 'vitest'
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
import { useUpsertSpec } from '@/api/quotation/spec/postSpec'
import { useUpdateSpec } from '@/api/quotation/spec/putSpec'
import { useDeleteSpec } from '@/api/quotation/spec/deleteSpec'
import { specKeys } from '@/api/quotation/spec/queryKeys'
import type { CreateSpecPayload } from '@/api/quotation/spec/postSpec'

const mockedApiFetch = vi.mocked(apiFetch)

const createPayload: CreateSpecPayload = {
  description: 'Structural steel',
  specifications: ['IS 2062'],
  makeOrBrand: ['Tata'],
  yieldStrengthMpa: 345,
}

const response = {
  id: 'spec-1',
  jobId: 'job-1',
  ...createPayload,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, invalidateSpy }
}

describe('spec mutation cache invalidation', () => {
  beforeEach(() => mockedApiFetch.mockReset())

  it('useUpsertSpec invalidates the detail and specification lists', async () => {
    mockedApiFetch.mockResolvedValueOnce(response)
    const { wrapper, invalidateSpy } = makeWrapper()

    const { result } = renderHook(() => useUpsertSpec(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload: createPayload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: specKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: specKeys.lists() })
  })

  it('useUpdateSpec invalidates the detail and specification lists', async () => {
    mockedApiFetch.mockResolvedValueOnce(response)
    const { wrapper, invalidateSpy } = makeWrapper()

    const { result } = renderHook(() => useUpdateSpec(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload: { description: 'Updated' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: specKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: specKeys.lists() })
  })

  it('useDeleteSpec invalidates the detail and specification lists', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)
    const { wrapper, invalidateSpy } = makeWrapper()

    const { result } = renderHook(() => useDeleteSpec(), { wrapper })
    result.current.mutate('job-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: specKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: specKeys.lists() })
  })
})
