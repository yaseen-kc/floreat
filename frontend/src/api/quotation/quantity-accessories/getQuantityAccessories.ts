import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { QuantityAccessories } from '../quantity/getQuantity'
import { quantityAccessoriesKeys } from './queryKeys'

export type { QuantityAccessories }

/** Paginated response shape from GET /api/quantity-accessories. */
export interface GetQuantityAccessoriesResponse {
  data: QuantityAccessories[]
  total: number
  page: number
  pageSize: number
}

/**
 * Fetches a paginated list of accessories sections via GET /api/quantity-accessories.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityAccessoriesList(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetQuantityAccessoriesResponse> {
  return await apiFetch(`/api/quantity-accessories?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated accessories sections list.
 */
export function useQuantityAccessoriesList(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityAccessoriesKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getQuantityAccessoriesList(token, page, pageSize)
    },
  })
}

/**
 * Fetches the accessories section for a job via GET /api/jobs/:jobId/quantity/accessories.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityAccessoriesByJobId(
  token: string | null,
  jobId: string,
): Promise<QuantityAccessories> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/accessories`, token)
}

/**
 * React Query hook for a single job's accessories section. Disabled until a
 * `jobId` is available so it never fires with an empty path segment.
 */
export function useQuantityAccessories(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityAccessoriesKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getQuantityAccessoriesByJobId(token, jobId)
    },
  })
}
