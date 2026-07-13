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
import { upsertJoint, useUpsertJoint } from '@/api/quotation/joint/postJoint'
import type { CreateJointPayload } from '@/api/quotation/joint/postJoint'
import type { Joint } from '@/api/quotation/joint/getJoint'
import { jointKeys } from '@/api/quotation/joint/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const payload: CreateJointPayload = {
  secondaryBeamsBoltType: 'HSFG',
  secondaryBeamsBoltDiameter: 12,
  secondaryBeamsNumberOfBolts: 4,
  jointBoltRoof: [{ roofJointId: 'A_1', boltDiameter: 20, numberOfBolts: 6 }],
  jointBoltMezzanine: [{ mezzanineJointId: 'M', boltDiameter: 16, numberOfBolts: 8 }],
  foundationBoltRoof: [{ foundationJointId: 'FB4', boltDiameter: 24, numberOfBolts: 4 }],
}

const joint: Joint = {
  id: 'joint-1',
  jobId: 'job-1',
  secondaryBeamsBoltType: null,
  secondaryBeamsBoltDiameter: null,
  secondaryBeamsNumberOfBolts: null,
  purlinFlangeBraceBoltType: null,
  purlinFlangeBraceBoltDiameter: null,
  purlinFlangeBraceNumberOfBolts: null,
  claddingPurlinsBoltType: null,
  claddingPurlinsBoltDiameter: null,
  claddingPurlinsNumberOfBolts: null,
  canopyBoltType: null,
  canopyBoltDiameter: null,
  canopyNumberOfBolts: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  jointBoltRoof: [],
  jointBoltMezzanine: [],
  foundationBoltRoof: [],
}

describe('upsertJoint', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with POST method, nested job joint path, and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(joint)

    const result = await upsertJoint('token-123', 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/joint', 'token-123', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    expect(result).toEqual(joint)
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce(joint)

    await upsertJoint(null, 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/joint', null, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 400'))

    await expect(upsertJoint('token', 'job-1', payload)).rejects.toThrow('API error: 400')
  })
})

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, queryClient }
}

describe('useUpsertJoint', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('upserts the joint and returns the typed joint', async () => {
    mockedApiFetch.mockResolvedValueOnce(joint)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useUpsertJoint(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(joint)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/joint', 'test-token', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  })

  it('invalidates the joint detail and lists caches on success', async () => {
    mockedApiFetch.mockResolvedValueOnce(joint)
    const { wrapper, queryClient } = makeWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpsertJoint(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: jointKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: jointKeys.lists() })
  })
})
