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
import { upsertRoof, useUpsertRoof } from '@/api/quotation/roof/postRoof'
import type { CreateRoofPayload } from '@/api/quotation/roof/postRoof'
import type { Roof } from '@/api/quotation/roof/getRoof'
import { roofKeys } from '@/api/quotation/roof/queryKeys'

const mockedApiFetch = vi.mocked(apiFetch)

const payload: CreateRoofPayload = {
  buildingOverallLength: 100,
  buildingOverallWidth: 50,
  eaveHeight: 6,
  roofSlope: 10,
  mainRoofFrames: 5,
  endRoofFrames: 2,
  roofPurlinSpacing: 1.5,
  claddingPurlins: 4,
  internalColumnsForMainRoofFrames: 0,
  internalColumnsForEndRoofFrames: 0,
  roofFrameBaseFixing: 'FOUNDATION_BOLT',
}

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
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  sidewalls: [],
}

describe('upsertRoof', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with POST method, nested job roof path, and token', async () => {
    mockedApiFetch.mockResolvedValueOnce(roof)

    const result = await upsertRoof('token-123', 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/roof', 'token-123', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    expect(result).toEqual(roof)
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce(roof)

    await upsertRoof(null, 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/roof', null, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 400'))

    await expect(upsertRoof('token', 'job-1', payload)).rejects.toThrow('API error: 400')
  })
})

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper, queryClient }
}

describe('useUpsertRoof', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('upserts the roof and returns the typed roof', async () => {
    mockedApiFetch.mockResolvedValueOnce(roof)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useUpsertRoof(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(roof)
    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1/roof', 'test-token', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  })

  it('invalidates the roof detail and lists caches on success', async () => {
    mockedApiFetch.mockResolvedValueOnce(roof)
    const { wrapper, queryClient } = makeWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpsertRoof(), { wrapper })
    result.current.mutate({ jobId: 'job-1', payload })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roofKeys.detail('job-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roofKeys.lists() })
  })
})
