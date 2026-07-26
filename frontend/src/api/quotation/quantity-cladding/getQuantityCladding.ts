import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { QuantityCladding } from '../quantity/getQuantity'
import { quantityCladdingKeys } from './queryKeys'

export type { QuantityCladding }

/** Paginated response shape from GET /api/quantity-claddings. */
export interface GetQuantityCladdingsResponse {
  data: QuantityCladding[]
  total: number
  page: number
  pageSize: number
}

/**
 * Fetches a paginated list of cladding sections via GET /api/quantity-claddings.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityCladdings(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetQuantityCladdingsResponse> {
  return await apiFetch(`/api/quantity-claddings?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated cladding sections list.
 */
export function useQuantityCladdings(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityCladdingKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getQuantityCladdings(token, page, pageSize)
    },
  })
}

/**
 * Fetches the cladding section for a job via GET /api/jobs/:jobId/quantity/cladding.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityCladdingByJobId(
  token: string | null,
  jobId: string,
): Promise<QuantityCladding> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/cladding`, token)
}

/**
 * React Query hook for a single job's cladding section. Disabled until a
 * `jobId` is available so it never fires with an empty path segment.
 */
export function useQuantityCladding(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityCladdingKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getQuantityCladdingByJobId(token, jobId)
    },
  })
}
