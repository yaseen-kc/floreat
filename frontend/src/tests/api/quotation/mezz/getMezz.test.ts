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
import { getMezzanines, getMezzanineByJobId, useMezzanines, useMezzanine } from '@/api/quotation/mezz/getMezz'
import type { GetMezzaninesResponse, Mezzanine } from '@/api/quotation/mezz/getMezz'
import { mezzanineKeys } from '@/api/quotation/mezz/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const mezzanine: Mezzanine = {
  id: 'mezz-1',
  jobId: 'job-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  floors: [
    {
      id: 'floor-1',
      mezzanineId: 'mezz-1',
      code: 'MEZ-1',
      floor: 'FLOOR_1',
      type: 'DECK_SHEET',
      heightFrom: 'GROUND',
      thicknessMm: '120.000',
      lengthM: '10.000',
      widthM: '5.000',
      heightM: '3.000',
      materialConsumptionKgPerSqft: '12.500',
      beamsMidPrimary: 2,
      beamsEndPrimary: 1,
      beamsSecondary: 4,
      jointsMidPrimary: 1,
      jointsEndPrimary: 0,
      internalColumnsMidPrimary: 0,
      internalColumnsEndPrimary: 0,
    },
  ],
  extensions: [
    {
      id: 'ext-1',
      mezzanineId: 'mezz-1',
      type: 'PANEL',
      heightFrom: 'FIRST_FLOOR',
      typicalTo: 'FLOOR_3',
      thicknessMm: null,
      lengthM: '8.000',
      widthM: '4.000',
      heightM: '3.000',
      beamsMidPrimary: null,
      beamsEndPrimary: null,
      beamsSecondary: null,
      jointsMidPrimary: null,
      jointsEndPrimary: null,
      extendedColumnsMidPrimary: null,
      extendedColumnsEndPrimary: null,
    },
  ],
}

// A mezzanine whose floor/extension fields are all null — proves the response
// types accept nullable columns (every optional Prisma column serialised null).
const nullableMezzanine: Mezzanine = {
  id: 'mezz-2',
  jobId: 'job-2',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  floors: [
    {
      id: 'floor-null',
      mezzanineId: 'mezz-2',
      code: null,
      floor: null,
      type: null,
      heightFrom: null,
      thicknessMm: null,
      lengthM: null,
      widthM: null,
      heightM: null,
      materialConsumptionKgPerSqft: null,
      beamsMidPrimary: null,
      beamsEndPrimary: null,
      beamsSecondary: null,
      jointsMidPrimary: null,
      jointsEndPrimary: null,
      internalColumnsMidPrimary: null,
      internalColumnsEndPrimary: null,
    },
  ],
  extensions: [
    {
      id: 'ext-null',
      mezzanineId: 'mezz-2',
      type: null,
      heightFrom: null,
      typicalTo: null,
      thicknessMm: null,
      lengthM: null,
      widthM: null,
      heightM: null,
      beamsMidPrimary: null,
      beamsEndPrimary: null,
      beamsSecondary: null,
      jointsMidPrimary: null,
      jointsEndPrimary: null,
      extendedColumnsMidPrimary: null,
      extendedColumnsEndPrimary: null,
    },
  ],
}

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper }
}

describe('mezzanineKeys factory', () => {
  it('roots everything under "mezzanines"', () => {
    expect(mezzanineKeys.all).toEqual(['mezzanines'])
  })

  it('builds list keys with a stable prefix', () => {
    expect(mezzanineKeys.lists()).toEqual(['mezzanines', 'list'])
    expect(mezzanineKeys.list(2, 25)).toEqual(['mezzanines', 'list', { page: 2, pageSize: 25 }])
  })

  it('shares the list prefix so invalidating lists() matches list(...)', () => {
    const prefix = mezzanineKeys.lists()
    const concrete = mezzanineKeys.list(1, 10)
    expect(concrete.slice(0, prefix.length)).toEqual(prefix)
  })

  it('builds detail keys keyed by jobId', () => {
    expect(mezzanineKeys.details()).toEqual(['mezzanines', 'detail'])
    expect(mezzanineKeys.detail('job-1')).toEqual(['mezzanines', 'detail', 'job-1'])
  })
})

describe('getMezzanines', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the paginated /api/mezzanines path and token', async () => {
    const response: GetMezzaninesResponse = { data: [mezzanine], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)

    const result = await getMezzanines('token-123', 1, 10)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/mezzanines?page=1&pageSize=10', 'token-123')
    expect(result).toEqual(response)
  })

  it('applies default page/pageSize when omitted', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 1, pageSize: 10 })

    await getMezzanines('token')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/mezzanines?page=1&pageSize=10', 'token')
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 2, pageSize: 5 })

    await getMezzanines(null, 2, 5)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/mezzanines?page=2&pageSize=5', null)
  })
})

describe('getMezzanineByJobId', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the nested job mezzanine path and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(mezzanine)

    const result = await getMezzanineByJobId('token-123', 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/mezzanine', 'token-123')
    expect(result).toEqual(mezzanine)
  })

  it('returns a mezzanine whose floor/extension fields are all null', async () => {
    mockedApiFetch.mockResolvedValueOnce(nullableMezzanine)

    const result = await getMezzanineByJobId('token-123', 'job-2')

    expect(result).toEqual(nullableMezzanine)
    expect(result!.floors[0].code).toBeNull()
    expect(result!.floors[0].beamsSecondary).toBeNull()
    expect(result!.extensions[0].type).toBeNull()
    expect(result!.extensions[0].widthM).toBeNull()
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(getMezzanineByJobId('token', 'missing')).rejects.toThrow('API error: 404')
  })
})

describe('useMezzanines', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches and returns a typed paginated mezzanine list', async () => {
    const response: GetMezzaninesResponse = { data: [mezzanine], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useMezzanines(1, 10), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(response)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/mezzanines?page=1&pageSize=10', 'test-token')
  })
})

describe('useMezzanine', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches the mezzanine for a given jobId', async () => {
    mockedApiFetch.mockResolvedValueOnce(mezzanine)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useMezzanine('job-1'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mezzanine)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/mezzanine', 'test-token')
  })

  it('stays disabled and does not fetch when jobId is empty', async () => {
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useMezzanine(''), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockedApiFetch).not.toHaveBeenCalled()
  })
})
