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
import { getJoints, getJointByJobId, useJoints, useJoint } from '@/api/quotation/joint/getJoint'
import type { GetJointsResponse, Joint } from '@/api/quotation/joint/getJoint'
import { jointKeys } from '@/api/quotation/joint/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const joint: Joint = {
  id: 'joint-1',
  jobId: 'job-1',
  secondaryBeamsBoltType: 'HSFG',
  secondaryBeamsBoltDiameter: '12.000',
  secondaryBeamsNumberOfBolts: 4,
  purlinFlangeBraceBoltType: 'ORD',
  purlinFlangeBraceBoltDiameter: '10.000',
  purlinFlangeBraceNumberOfBolts: 2,
  claddingPurlinsBoltType: null,
  claddingPurlinsBoltDiameter: null,
  claddingPurlinsNumberOfBolts: null,
  canopyBoltType: null,
  canopyBoltDiameter: null,
  canopyNumberOfBolts: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  jointBoltRoof: [
    { id: 'jbr-1', jointId: 'joint-1', roofJointId: 'A_1', boltDiameter: '20.000', numberOfBolts: 6 },
  ],
  jointBoltMezzanine: [
    { id: 'jbm-1', jointId: 'joint-1', mezzanineJointId: 'M', boltDiameter: '16.000', numberOfBolts: 8 },
  ],
  foundationBoltRoof: [
    { id: 'fbr-1', jointId: 'joint-1', foundationJointId: 'FB4', boltDiameter: '24.000', numberOfBolts: 4 },
  ],
}

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper }
}

describe('jointKeys factory', () => {
  it('roots everything under "joints"', () => {
    expect(jointKeys.all).toEqual(['joints'])
  })

  it('builds list keys with a stable prefix', () => {
    expect(jointKeys.lists()).toEqual(['joints', 'list'])
    expect(jointKeys.list(2, 25)).toEqual(['joints', 'list', { page: 2, pageSize: 25 }])
  })

  it('shares the list prefix so invalidating lists() matches list(...)', () => {
    const prefix = jointKeys.lists()
    const concrete = jointKeys.list(1, 10)
    expect(concrete.slice(0, prefix.length)).toEqual(prefix)
  })

  it('builds detail keys keyed by jobId', () => {
    expect(jointKeys.details()).toEqual(['joints', 'detail'])
    expect(jointKeys.detail('job-1')).toEqual(['joints', 'detail', 'job-1'])
  })
})

describe('getJoints', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the paginated /api/joints path and token', async () => {
    const response: GetJointsResponse = { data: [joint], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)

    const result = await getJoints('token-123', 1, 10)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/joints?page=1&pageSize=10', 'token-123')
    expect(result).toEqual(response)
  })

  it('applies default page/pageSize when omitted', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 1, pageSize: 10 })

    await getJoints('token')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/joints?page=1&pageSize=10', 'token')
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 2, pageSize: 5 })

    await getJoints(null, 2, 5)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/joints?page=2&pageSize=5', null)
  })
})

describe('getJointByJobId', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the nested job joint path and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(joint)

    const result = await getJointByJobId('token-123', 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/joint', 'token-123')
    expect(result).toEqual(joint)
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(getJointByJobId('token', 'missing')).rejects.toThrow('API error: 404')
  })
})

describe('useJoints', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches and returns a typed paginated joint list', async () => {
    const response: GetJointsResponse = { data: [joint], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useJoints(1, 10), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(response)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/joints?page=1&pageSize=10', 'test-token')
  })
})

describe('useJoint', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches the joint for a given jobId', async () => {
    mockedApiFetch.mockResolvedValueOnce(joint)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useJoint('job-1'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(joint)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/joint', 'test-token')
  })

  it('stays disabled and does not fetch when jobId is empty', async () => {
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useJoint(''), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockedApiFetch).not.toHaveBeenCalled()
  })
})
