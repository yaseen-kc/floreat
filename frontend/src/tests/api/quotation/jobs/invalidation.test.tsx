import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Clerk's useAuth -> a getToken stub.
vi.mock('@clerk/react', () => ({
  useAuth: () => ({ getToken: vi.fn().mockResolvedValue('test-token') }),
}))

vi.mock('@/lib/api', () => ({
  apiFetch: vi.fn(),
}))

import { apiFetch } from '@/lib/api'
import { useCreateJob } from '@/api/quotation/jobs/postJobs'
import { useUpdateJob } from '@/api/quotation/jobs/putJobs'
import { jobKeys } from '@/api/quotation/jobs/queryKeys'
import type { JobInput } from '@/schemas/job.schema'

const mockedApiFetch = vi.mocked(apiFetch)

const payload: JobInput = {
  projectNo: 'P-001',
  subject: 'Subject',
  refNo: 'REF-001',
  date: '2026-01-01',
  designedByName: 'John',
  designedByMobile: '1234567890',
  clientName: '',
  estimationEngineerName: '',
  estimationEngineerMobile: '',
  headOfSalesName: '',
  headOfSalesMobile: '',
  firmName: '',
  buildingUsage: 'Commercial',
  numberOfBuilding: 1,
  frameType: 'Steel',
  configuration: 'Standard',
}

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, invalidateSpy }
}

describe('job mutation cache invalidation', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('useCreateJob invalidates the jobs list on success', async () => {
    mockedApiFetch.mockResolvedValueOnce({ id: 'job-1', ...payload })
    const { wrapper, invalidateSpy } = makeWrapper()

    const { result } = renderHook(() => useCreateJob(), { wrapper })
    result.current.mutate(payload)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: jobKeys.lists() })
  })

  it('useUpdateJob invalidates the list and the job detail on success', async () => {
    mockedApiFetch.mockResolvedValueOnce({ id: 'job-1', ...payload })
    const { wrapper, invalidateSpy } = makeWrapper()

    const { result } = renderHook(() => useUpdateJob(), { wrapper })
    result.current.mutate({ id: 'job-1', ...payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: jobKeys.lists() })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: jobKeys.detail('job-1') })
  })
})
