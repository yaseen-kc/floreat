import { describe, it, expect, vi, beforeEach } from 'vitest'
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
import { deleteQuantity, useDeleteQuantity } from '@/api/quotation/quantity/deleteQuantity'
import { quantityKeys } from '@/api/quotation/quantity/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, queryClient }
}

describe('deleteQuantity', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with DELETE method, nested job quantity path, and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)

    await deleteQuantity('token-123', 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/quantity', 'token-123', {
      method: 'DELETE',
    })
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(deleteQuantity('token', 'job-1')).rejects.toThrow('API error: 404')
  })
})

describe('useDeleteQuantity', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('deletes the quantity and invalidates detail and lists caches', async () => {
    mockedApiFetch.mockResolvedValueOnce(null)
    const { wrapper, queryClient } = makeWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useDeleteQuantity(), { wrapper })
    result.current.mutate('job-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/quantity', 'test-token', {
      method: 'DELETE',
    })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: quantityKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: quantityKeys.lists() })
  })
})
