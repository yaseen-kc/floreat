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
import { getJobs, getJobById, useJobs, useJob } from '@/api/quotation/jobs/getJobs'
import type { GetJobsResponse, Job } from '@/api/quotation/jobs/getJobs'

const mockedApiFetch = vi.mocked(apiFetch)

const job: Job = {
  id: 'job-1',
  projectNo: 'P-001',
  subject: 'Test Subject',
  refNo: 'REF-001',
  date: '2026-01-01',
  designedByName: 'John',
  designedByMobile: '1234567890',
  clientName: null,
  estimationEngineerName: null,
  estimationEngineerMobile: null,
  headOfSalesName: null,
  headOfSalesMobile: null,
  firmName: null,
  buildingUsage: 'Commercial',
  numberOfBuilding: 1,
  frameType: 'Steel',
  configuration: 'Standard',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper }
}

describe('getJobs', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the paginated /api/jobs path and token', async () => {
    const response: GetJobsResponse = { data: [job], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)

    const result = await getJobs('token-123', 1, 10)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs?page=1&pageSize=10', 'token-123')
    expect(result).toEqual(response)
  })

  it('applies default page/pageSize when omitted', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 1, pageSize: 10 })

    await getJobs('token')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs?page=1&pageSize=10', 'token')
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 2, pageSize: 5 })

    await getJobs(null, 2, 5)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs?page=2&pageSize=5', null)
  })
})

describe('getJobById', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the job detail path and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(job)

    const result = await getJobById('token-123', 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1', 'token-123')
    expect(result).toEqual(job)
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce(job)

    await getJobById(null, 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1', null)
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(getJobById('token', 'missing')).rejects.toThrow('API error: 404')
  })
})

describe('useJobs', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches and returns a typed paginated job list', async () => {
    const response: GetJobsResponse = { data: [job], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useJobs(1, 10), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(response)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs?page=1&pageSize=10', 'test-token')
  })
})

describe('useJob', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches the job for a given id', async () => {
    mockedApiFetch.mockResolvedValueOnce(job)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useJob('job-1'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(job)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1', 'test-token')
  })

  it('stays disabled and does not fetch when id is empty', async () => {
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useJob(''), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockedApiFetch).not.toHaveBeenCalled()
  })
})
