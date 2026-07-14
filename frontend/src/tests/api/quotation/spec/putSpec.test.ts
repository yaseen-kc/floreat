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
import { updateSpec, useUpdateSpec } from '@/api/quotation/spec/putSpec'
import type { UpdateSpecPayload } from '@/api/quotation/spec/putSpec'
import type { Spec } from '@/api/quotation/spec/getSpec'

const mockedApiFetch = vi.mocked(apiFetch)

const payload: UpdateSpecPayload = { products: [{ code: 'PRODUCT-1', description: 'Updated steel' }] }
const spec: Spec = {
  id: 'spec-1',
  jobId: 'job-1',
  products: [
    { id: 'p1', code: 'PRODUCT-1', description: 'Updated steel', specification: 'IS 2062', makeOrBrand: 'Tata', yieldStrengthMpa: 345 },
  ],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
}

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper }
}

describe('updateSpec', () => {
  beforeEach(() => mockedApiFetch.mockReset())

  it('calls apiFetch with PUT, the nested spec path, token, and partial payload', async () => {
    mockedApiFetch.mockResolvedValueOnce(spec)

    const result = await updateSpec('token-123', 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/spec', 'token-123', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    expect(result).toEqual(spec)
  })

  it('forwards null tokens and API errors', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(updateSpec(null, 'missing', payload)).rejects.toThrow('API error: 404')
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/missing/spec', null, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  })
})

describe('useUpdateSpec', () => {
  beforeEach(() => mockedApiFetch.mockReset())

  it("updates a job's spec with the Clerk token", async () => {
    mockedApiFetch.mockResolvedValueOnce(spec)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useUpdateSpec(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(spec)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/spec', 'test-token', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  })
})
