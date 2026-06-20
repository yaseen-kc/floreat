import { apiFetch } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { stairKeys } from './queryKeys'

/* ──────────────────────────────────────────────────────────────────────────
 * Enum unions — mirror the backend Prisma enums (string literals over the wire).
 * ────────────────────────────────────────────────────────────────────────── */

export type StairStepType = 'CHQ_PLATE_6MM' | 'CHQ_PLATE_4MM' | 'TUBE'
export type StairFloorLevel = 'GROUND' | 'FIRST_FLOOR' | 'SECOND_FLOOR' | 'THIRD_FLOOR' | 'FOURTH_FLOOR' | 'FIFTH_FLOOR' | 'SIXTH_FLOOR'
export type StairStringerType = 'HR_SECTION' | 'FAB_SECTION'
export type AreaDeductionType = 'LIFT' | 'DUCT' | 'CUT_OUT'
export type AreaDeductionFor = 'STRUCTURE_DEDUCTION' | 'COVERING_DEDUCTION' | 'BOTH'

/* ──────────────────────────────────────────────────────────────────────────
 * Response shapes.
 *
 * NOTE: Prisma `Decimal` columns serialize to JSON strings over HTTP
 * (`Decimal.prototype.toJSON`), so numeric-precision fields are typed as
 * `string` here even though the create/update payloads accept `number`.
 * ────────────────────────────────────────────────────────────────────────── */

export interface StairItem {
  id: string
  stairId: string
  code: string | null
  typeOfStep: StairStepType | null
  location: string | null
  startingFrom: StairFloorLevel | null
  endingUpTo: StairFloorLevel | null
  length: string | null
  width: string | null
  height: string | null
  numberOfMidLanding: number | null
  typeOfStringer: StairStringerType | null
  unitWeightOfStringer: string | null
}

export interface AreaDeduction {
  id: string
  stairId: string
  type: AreaDeductionType | null
  location: string | null
  areaM2: string | null
  numbers: number | null
  deductionFor: AreaDeductionFor | null
}

export interface Stair {
  id: string
  jobId: string
  createdAt: string
  updatedAt: string
  stairs: StairItem[]
  areaDeductions: AreaDeduction[]
}

export interface GetStairsResponse {
  data: Stair[]
  total: number
  page: number
  pageSize: number
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/stairs — paginated list.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches a paginated list of stairs from the backend via GET /api/stairs.
 * Requires a Clerk session token for authentication.
 */
export async function getStairs(token: string | null, page = 1, pageSize = 10): Promise<GetStairsResponse> {
  return await apiFetch(`/api/stairs?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated stairs list. Uses the shared `stairKeys`
 * factory so mutations can invalidate it reliably.
 */
export function useStairs(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: stairKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getStairs(token, page, pageSize)
    },
  })
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/jobs/:jobId/stair — single stair for a job.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches the stair belonging to a specific job via GET /api/jobs/:jobId/stair.
 * Requires a Clerk session token for authentication.
 */
export async function getStairByJobId(token: string | null, jobId: string): Promise<Stair> {
  return await apiFetch(`/api/jobs/${jobId}/stair`, token)
}

/**
 * React Query hook for a single job's stair. Disabled until a `jobId` is
 * available so it never fires with an empty path segment.
 */
export function useStair(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: stairKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getStairByJobId(token, jobId)
    },
  })
}
