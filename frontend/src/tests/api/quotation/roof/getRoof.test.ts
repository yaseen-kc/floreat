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
import { getRoofs, getRoofByJobId, useRoofs, useRoof } from '@/api/quotation/roof/getRoof'
import type { GetRoofsResponse, Roof } from '@/api/quotation/roof/getRoof'
import { roofKeys } from '@/api/quotation/roof/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const roof: Roof = {
  id: 'roof-1',
  jobId: 'job-1',
  buildingOverallLength: '100.000',
  buildingOverallWidth: '50.000',
  eaveHeight: '6.000',
  roofSlope: '10.000',
  mainRoofFrames: 5,
  endRoofFrames: 2,
  roofPurlinSpacing: '1.500',
  claddingPurlins: 4,
  internalColumnsForMainRoofFrames: 0,
  internalColumnsForEndRoofFrames: 0,
  roofFrameBaseFixing: 'FOUNDATION_BOLT',
  columnSegmentsInMainFrame: null,
  raftersInOneHalfOfMainFrame: null,
  columnSegmentsInEndFrame: null,
  raftersInOneHalfOfEndFrame: null,
  endFrameHorizontalTieBeam: null,
  roofPurlinType: null,
  roofPurlinDepth: null,
  roofPurlinUnitWeight: null,
  claddingPurlinType: null,
  claddingPurlinDepth: null,
  claddingPurlinUnitWeight: null,
  roofCoveringType: null,
  roofCoveringThickness: null,
  claddingCoveringType: null,
  claddingCoveringThickness: null,
  roofAreaDeduction: null,
  roofFlangeBraceAverageLength: null,
  claddingFlangeBraceAverageLength: null,
  endFrameFlangeBraceAverageLength: null,
  polycarbonateRoofLength: null,
  polycarbonateRoofWidth: null,
  polycarbonateRoofCount: null,
  roofWindBracingSegmentsInOneHalf: null,
  columnWindBracingSegments: null,
  roofWindBracingProvidedBays: null,
  columnWindBracingProvidedBays: null,
  windBracingColumnHeight: null,
  windBracingUnitWeight: null,
  roofWindBracingBaySpacing: null,
  columnWindBracingBaySpacing: null,
  roofWindBracingLength: null,
  columnWindBracingLength: null,
  windBracingType: null,
  frontCladdingOpeningArea: null,
  backCladdingOpeningArea: null,
  rightCladdingOpeningArea: null,
  leftCladdingOpeningArea: null,
  fasciaBoardArea: null,
  fasciaMaterialWeightPerSqft: null,
  roofExtensionWidthHeight: null,
  roofExtensionMidFrameCount: null,
  roofExtensionEndFrameCount: null,
  claddingExtensionWidthHeight: null,
  claddingExtensionMidFrameCount: null,
  claddingExtensionEndFrameCount: null,
  sideColumnsWidthHeight: null,
  sideColumnsMidFrameCount: null,
  sideColumnsEndFrameCount: null,
  gradeOfPlateMaterial: null,
  materialConsumptionExcludingPurlin: null,
  DiaOfRoofSagRod: null,
  DiaOfCladdingSagRod: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  sidewalls: [],
}

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper }
}

describe('roofKeys factory', () => {
  it('roots everything under "roofs"', () => {
    expect(roofKeys.all).toEqual(['roofs'])
  })

  it('builds list keys with a stable prefix', () => {
    expect(roofKeys.lists()).toEqual(['roofs', 'list'])
    expect(roofKeys.list(2, 25)).toEqual(['roofs', 'list', { page: 2, pageSize: 25 }])
  })

  it('shares the list prefix so invalidating lists() matches list(...)', () => {
    const prefix = roofKeys.lists()
    const concrete = roofKeys.list(1, 10)
    expect(concrete.slice(0, prefix.length)).toEqual(prefix)
  })

  it('builds detail keys keyed by jobId', () => {
    expect(roofKeys.details()).toEqual(['roofs', 'detail'])
    expect(roofKeys.detail('job-1')).toEqual(['roofs', 'detail', 'job-1'])
  })
})

describe('getRoofs', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the paginated /api/roofs path and token', async () => {
    const response: GetRoofsResponse = { data: [roof], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)

    const result = await getRoofs('token-123', 1, 10)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/roofs?page=1&pageSize=10', 'token-123')
    expect(result).toEqual(response)
  })

  it('applies default page/pageSize when omitted', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 1, pageSize: 10 })

    await getRoofs('token')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/roofs?page=1&pageSize=10', 'token')
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce({ data: [], total: 0, page: 2, pageSize: 5 })

    await getRoofs(null, 2, 5)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/roofs?page=2&pageSize=5', null)
  })
})

describe('getRoofByJobId', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with the nested job roof path and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(roof)

    const result = await getRoofByJobId('token-123', 'job-1')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/roof', 'token-123')
    expect(result).toEqual(roof)
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(getRoofByJobId('token', 'missing')).rejects.toThrow('API error: 404')
  })
})

describe('useRoofs', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches and returns a typed paginated roof list', async () => {
    const response: GetRoofsResponse = { data: [roof], total: 1, page: 1, pageSize: 10 }
    mockedApiFetch.mockResolvedValueOnce(response)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useRoofs(1, 10), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(response)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/roofs?page=1&pageSize=10', 'test-token')
  })
})

describe('useRoof', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('fetches the roof for a given jobId', async () => {
    mockedApiFetch.mockResolvedValueOnce(roof)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useRoof('job-1'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(roof)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/roof', 'test-token')
  })

  it('stays disabled and does not fetch when jobId is empty', async () => {
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useRoof(''), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockedApiFetch).not.toHaveBeenCalled()
  })
})
