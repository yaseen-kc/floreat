import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { QuantityCanopy } from '../quantity/getQuantity'
import { quantityCanopyKeys } from './queryKeys'

export type { QuantityCanopy }

/** Paginated response shape from GET /api/quantity-canopies. */
export interface GetQuantityCanopiesResponse {
  data: QuantityCanopy[]
  total: number
  page: number
  pageSize: number
}

/**
 * Fetches a paginated list of canopy sections via GET /api/quantity-canopies.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityCanopies(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetQuantityCanopiesResponse> {
  return await apiFetch(`/api/quantity-canopies?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated canopy sections list.
 */
export function useQuantityCanopies(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityCanopyKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getQuantityCanopies(token, page, pageSize)
    },
  })
}

/**
 * Fetches the canopy section for a job via GET /api/jobs/:jobId/quantity/canopy.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityCanopyByJobId(
  token: string | null,
  jobId: string,
): Promise<QuantityCanopy> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/canopy`, token)
}

/**
 * React Query hook for a single job's canopy section. Disabled until a
 * `jobId` is available so it never fires with an empty path segment.
 */
export function useQuantityCanopy(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityCanopyKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getQuantityCanopyByJobId(token, jobId)
    },
  })
}
