import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { QuantityMezzanine } from '../quantity/getQuantity'
import { quantityMezzanineKeys } from './queryKeys'

export type { QuantityMezzanine }

/** Paginated response shape from GET /api/quantity-mezzanines. */
export interface GetQuantityMezzaninesResponse {
  data: QuantityMezzanine[]
  total: number
  page: number
  pageSize: number
}

/**
 * Fetches a paginated list of mezzanine sections via GET /api/quantity-mezzanines.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityMezzanines(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetQuantityMezzaninesResponse> {
  return await apiFetch(`/api/quantity-mezzanines?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated mezzanine sections list.
 */
export function useQuantityMezzanines(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityMezzanineKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getQuantityMezzanines(token, page, pageSize)
    },
  })
}

/**
 * Fetches the mezzanine section for a job via GET /api/jobs/:jobId/quantity/mezzanine.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityMezzanineByJobId(
  token: string | null,
  jobId: string,
): Promise<QuantityMezzanine> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/mezzanine`, token)
}

/**
 * React Query hook for a single job's mezzanine section. Disabled until a
 * `jobId` is available so it never fires with an empty path segment.
 */
export function useQuantityMezzanine(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityMezzanineKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getQuantityMezzanineByJobId(token, jobId)
    },
  })
}
