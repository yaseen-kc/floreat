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
import { deleteSpec, useDeleteSpec } from '@/api/quotation/spec/deleteSpec'

const mockedApiFetch = vi.mocked(apiFetch)

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper }
}

describe('deleteSpec', () => {
  beforeEach(() => mockedApiFetch.mockReset())

  it('calls apiFetch with DELETE, the nested spec path, and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)

    await deleteSpec('token-123', 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/spec', 'token-123', {
      method: 'DELETE',
    })
  })

  it('forwards null tokens and API errors', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(deleteSpec(null, 'missing')).rejects.toThrow('API error: 404')
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/missing/spec', null, {
      method: 'DELETE',
    })
  })
})

describe('useDeleteSpec', () => {
  beforeEach(() => mockedApiFetch.mockReset())

  it('deletes a spec and reaches success for a 204/null response', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useDeleteSpec(), { wrapper })
    result.current.mutate('job-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/spec', 'test-token', {
      method: 'DELETE',
    })
  })
})
