import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { QuantityAdditionalBolts } from '../quantity/getQuantity'
import { quantityAdditionalBoltsKeys } from './queryKeys'

export type { QuantityAdditionalBolts }

/** Paginated response shape from GET /api/quantity-additional-bolts. */
export interface GetQuantityAdditionalBoltsResponse {
  data: QuantityAdditionalBolts[]
  total: number
  page: number
  pageSize: number
}

/**
 * Fetches a paginated list of additionalBolts sections via GET /api/quantity-additional-bolts.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityAdditionalBoltsList(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetQuantityAdditionalBoltsResponse> {
  return await apiFetch(`/api/quantity-additional-bolts?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated additionalBolts sections list.
 */
export function useQuantityAdditionalBoltsList(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityAdditionalBoltsKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getQuantityAdditionalBoltsList(token, page, pageSize)
    },
  })
}

/**
 * Fetches the additionalBolts section for a job via GET /api/jobs/:jobId/quantity/additional-bolts.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityAdditionalBoltsByJobId(
  token: string | null,
  jobId: string,
): Promise<QuantityAdditionalBolts> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/additional-bolts`, token)
}

/**
 * React Query hook for a single job's additionalBolts section. Disabled until a
 * `jobId` is available so it never fires with an empty path segment.
 */
export function useQuantityAdditionalBolts(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityAdditionalBoltsKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getQuantityAdditionalBoltsByJobId(token, jobId)
    },
  })
}
