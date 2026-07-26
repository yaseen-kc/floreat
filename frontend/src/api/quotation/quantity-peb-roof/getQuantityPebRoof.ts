import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { QuantityPebRoof } from '../quantity/getQuantity'
import { quantityPebRoofKeys } from './queryKeys'

export type { QuantityPebRoof }

/** Paginated response shape from GET /api/quantity-peb-roofs. */
export interface GetQuantityPebRoofsResponse {
  data: QuantityPebRoof[]
  total: number
  page: number
  pageSize: number
}

/**
 * Fetches a paginated list of pebRoof sections via GET /api/quantity-peb-roofs.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityPebRoofs(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetQuantityPebRoofsResponse> {
  return await apiFetch(`/api/quantity-peb-roofs?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated pebRoof sections list.
 */
export function useQuantityPebRoofs(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityPebRoofKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getQuantityPebRoofs(token, page, pageSize)
    },
  })
}

/**
 * Fetches the pebRoof section for a job via GET /api/jobs/:jobId/quantity/peb-roof.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityPebRoofByJobId(
  token: string | null,
  jobId: string,
): Promise<QuantityPebRoof> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/peb-roof`, token)
}

/**
 * React Query hook for a single job's pebRoof section. Disabled until a
 * `jobId` is available so it never fires with an empty path segment.
 */
export function useQuantityPebRoof(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityPebRoofKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getQuantityPebRoofByJobId(token, jobId)
    },
  })
}
