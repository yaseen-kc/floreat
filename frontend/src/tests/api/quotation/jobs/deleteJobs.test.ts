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
import { deleteJob, useDeleteJob } from '@/api/quotation/jobs/deleteJobs'
import { jobKeys } from '@/api/quotation/jobs/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

describe('deleteJob', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with DELETE method, job path, and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)

    await deleteJob('token-123', 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1', 'token-123', {
      method: 'DELETE',
    })
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)

    await deleteJob(null, 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1', null, {
      method: 'DELETE',
    })
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(deleteJob('token', 'job-1')).rejects.toThrow('API error: 404')
  })
})

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, queryClient }
}

describe('useDeleteJob', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('deletes the job and reaches success state', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useDeleteJob(), { wrapper })
    result.current.mutate('job-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1', 'test-token', {
      method: 'DELETE',
    })
  })

  it('invalidates the job detail and lists caches on success', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)
    const { wrapper, queryClient } = makeWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useDeleteJob(), { wrapper })
    result.current.mutate('job-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: jobKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: jobKeys.lists() })
  })
})
