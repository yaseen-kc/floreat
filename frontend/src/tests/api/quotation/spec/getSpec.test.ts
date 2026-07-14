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
import { getSpecByJobId, getSpecs, useSpec, useSpecs } from '@/api/quotation/spec/getSpec'
import type { GetSpecsResponse, Spec } from '@/api/quotation/spec/getSpec'

const mockedApiFetch = vi.mocked(apiFetch)

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
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper }
}

describe('getSpecs', () => {
  beforeEach(() => mockedApiFetch.mockReset())

  it('fetches a paginated specs list', async () => {
    const response: GetSpecsResponse = { data: [spec], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)

    const result = await getSpecs('token-123', 1, 10)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/specs?page=1&pageSize=10', 'token-123')
    expect(result).toEqual(response)
  })

  it('applies default pagination and forwards null tokens', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 1, pageSize: 10 })

    await getSpecs(null)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/specs?page=1&pageSize=10', null)
  })
})

describe('getSpecByJobId', () => {
  beforeEach(() => mockedApiFetch.mockReset())

  it("fetches a job's spec", async () => {
    mockedApiFetch.mockResolvedValueOnce(spec)

    const result = await getSpecByJobId('token-123', 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/spec', 'token-123')
    expect(result).toEqual(spec)
  })

  it('propagates API errors', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(getSpecByJobId('token', 'missing')).rejects.toThrow('API error: 404')
  })
})

describe('spec read hooks', () => {
  beforeEach(() => mockedApiFetch.mockReset())

  it('fetches a paginated list with the Clerk token', async () => {
    const response: GetSpecsResponse = { data: [spec], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useSpecs(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(response)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/specs?page=1&pageSize=10', 'test-token')
  })

  it("fetches a job's spec with the Clerk token", async () => {
    mockedApiFetch.mockResolvedValueOnce(spec)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useSpec('job-1'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(spec)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/spec', 'test-token')
  })

  it('stays disabled when the jobId is empty', () => {
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useSpec(''), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockedApiFetch).not.toHaveBeenCalled()
  })
})
