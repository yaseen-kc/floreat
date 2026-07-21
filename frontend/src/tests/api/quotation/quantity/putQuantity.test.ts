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
import { updateQuantity, useUpdateQuantity } from '@/api/quotation/quantity/putQuantity'
import type { UpdateQuantityPayload } from '@/api/quotation/quantity/putQuantity'
import type { Quantity } from '@/api/quotation/quantity/getQuantity'
import { quantityKeys } from '@/api/quotation/quantity/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const payload: UpdateQuantityPayload = {
  cladding: {
    claddingStructureQuantity: 80,
    claddingStructureUnit: 'KG',
  },
}

const quantity: Quantity = {
  id: 'quantity-1',
  jobId: 'job-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  pebRoof: null,
  cladding: null,
  canopy: null,
  accessories: null,
  mezzanine: null,
  stair: null,
  additionalBolts: null,
}

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, queryClient }
}

describe('updateQuantity', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with PUT method, nested job quantity path, token, and payload', async () => {
    mockedApiFetch.mockResolvedValueOnce(quantity)

    const result = await updateQuantity('token-123', 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/quantity', 'token-123', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    expect(result).toEqual(quantity)
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(updateQuantity('token', 'job-1', payload)).rejects.toThrow('API error: 404')
  })
})

describe('useUpdateQuantity', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('updates the quantity and invalidates detail and lists caches', async () => {
    mockedApiFetch.mockResolvedValueOnce(quantity)
    const { wrapper, queryClient } = makeWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateQuantity(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/quantity', 'test-token', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: quantityKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: quantityKeys.lists() })
  })
})
