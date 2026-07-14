import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { specKeys } from './queryKeys'

/** A job-owned product specification returned by the backend. */
export interface Spec {
  id: string
  jobId: string
  description: string
  specifications: string[]
  makeOrBrand: string[]
  yieldStrengthMpa: number
  createdAt: string
  updatedAt: string
}

/** Paginated response returned by GET /api/specs. */
export interface GetSpecsResponse {
  data: Spec[]
  total: number
  page: number
  pageSize: number
}

/**
 * Fetches a paginated list of the user's specs.
 * Requires a Clerk session token for authentication.
 */
export async function getSpecs(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetSpecsResponse> {
  return await apiFetch(`/api/specs?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated specs list.
 * Requires a Clerk session and keys the query by page and page size.
 */
export function useSpecs(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: specKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getSpecs(token, page, pageSize)
    },
  })
}

/**
 * Fetches the spec belonging to a specific job.
 * Requires a Clerk session token for authentication.
 */
export async function getSpecByJobId(token: string | null, jobId: string): Promise<Spec> {
  return await apiFetch(`/api/jobs/${jobId}/spec`, token)
}

/**
 * React Query hook for a single job's spec. Disabled until a `jobId` is
 * available so it never fires with an empty path segment.
 */
export function useSpec(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: specKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getSpecByJobId(token, jobId)
    },
  })
}
