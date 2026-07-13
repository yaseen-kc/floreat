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
import { deleteJoint, useDeleteJoint } from '@/api/quotation/joint/deleteJoint'
import { jointKeys } from '@/api/quotation/joint/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

describe('deleteJoint', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with DELETE method, nested job joint path, and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)

    await deleteJoint('token-123', 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/joint', 'token-123', {
      method: 'DELETE',
    })
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)

    await deleteJoint(null, 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/joint', null, {
      method: 'DELETE',
    })
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(deleteJoint('token', 'job-1')).rejects.toThrow('API error: 404')
  })
})

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, queryClient }
}

describe('useDeleteJoint', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('deletes the joint and reaches success state', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useDeleteJoint(), { wrapper })
    result.current.mutate('job-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/joint', 'test-token', {
      method: 'DELETE',
    })
  })

  it('invalidates the joint detail and lists caches on success', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)
    const { wrapper, queryClient } = makeWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useDeleteJoint(), { wrapper })
    result.current.mutate('job-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: jointKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: jointKeys.lists() })
  })
})
