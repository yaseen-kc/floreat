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
import { deleteRoof, useDeleteRoof } from '@/api/quotation/roof/deleteRoof'
import { roofKeys } from '@/api/quotation/roof/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

describe('deleteRoof', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with DELETE method, nested job roof path, and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)

    await deleteRoof('token-123', 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/roof', 'token-123', {
      method: 'DELETE',
    })
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)

    await deleteRoof(null, 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/roof', null, {
      method: 'DELETE',
    })
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(deleteRoof('token', 'job-1')).rejects.toThrow('API error: 404')
  })
})

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, queryClient }
}

describe('useDeleteRoof', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('deletes the roof and reaches success state', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useDeleteRoof(), { wrapper })
    result.current.mutate('job-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/roof', 'test-token', {
      method: 'DELETE',
    })
  })

  it('invalidates the roof detail and lists caches on success', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)
    const { wrapper, queryClient } = makeWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useDeleteRoof(), { wrapper })
    result.current.mutate('job-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roofKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roofKeys.lists() })
  })
})
