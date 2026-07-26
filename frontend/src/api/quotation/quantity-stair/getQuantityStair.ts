import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { QuantityStair } from '../quantity/getQuantity'
import { quantityStairKeys } from './queryKeys'

export type { QuantityStair }

/** Paginated response shape from GET /api/quantity-stairs. */
export interface GetQuantityStairsResponse {
  data: QuantityStair[]
  total: number
  page: number
  pageSize: number
}

/**
 * Fetches a paginated list of stair sections via GET /api/quantity-stairs.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityStairs(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetQuantityStairsResponse> {
  return await apiFetch(`/api/quantity-stairs?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated stair sections list.
 */
export function useQuantityStairs(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityStairKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getQuantityStairs(token, page, pageSize)
    },
  })
}

/**
 * Fetches the stair section for a job via GET /api/jobs/:jobId/quantity/stair.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityStairByJobId(
  token: string | null,
  jobId: string,
): Promise<QuantityStair> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/stair`, token)
}

/**
 * React Query hook for a single job's stair section. Disabled until a
 * `jobId` is available so it never fires with an empty path segment.
 */
export function useQuantityStair(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityStairKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getQuantityStairByJobId(token, jobId)
    },
  })
}
