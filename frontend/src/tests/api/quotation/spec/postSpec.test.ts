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
import { upsertSpec, useUpsertSpec } from '@/api/quotation/spec/postSpec'
import type { CreateSpecPayload } from '@/api/quotation/spec/postSpec'
import type { Spec } from '@/api/quotation/spec/getSpec'

const mockedApiFetch = vi.mocked(apiFetch)

const payload: CreateSpecPayload = {
  description: 'Structural steel',
  specifications: ['IS 2062'],
  makeOrBrand: ['Tata'],
  yieldStrengthMpa: 345,
}

const spec: Spec = {
  id: 'spec-1',
  jobId: 'job-1',
  description: 'Structural steel',
  specifications: ['IS 2062'],
  makeOrBrand: ['Tata'],
  yieldStrengthMpa: 345,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper }
}

describe('upsertSpec', () => {
  beforeEach(() => mockedApiFetch.mockReset())

  it('calls apiFetch with POST, the nested spec path, token, and payload', async () => {
    mockedApiFetch.mockResolvedValueOnce(spec)

    const result = await upsertSpec('token-123', 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/spec', 'token-123', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    expect(result).toEqual(spec)
  })

  it('forwards null tokens and API errors', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 400'))

    await expect(upsertSpec(null, 'job-1', payload)).rejects.toThrow('API error: 400')
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/spec', null, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  })
})

describe('useUpsertSpec', () => {
  beforeEach(() => mockedApiFetch.mockReset())

  it("upserts a job's spec with the Clerk token", async () => {
    mockedApiFetch.mockResolvedValueOnce(spec)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useUpsertSpec(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(spec)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/spec', 'test-token', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  })
})
