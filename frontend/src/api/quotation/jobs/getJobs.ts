import { apiFetch } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { jobKeys } from './queryKeys'

/** Shape of a single Job returned by the backend. */
export interface Job {
  id: string
  projectNo: string
  subject: string
  refNo: string
  date: string
  designedByName: string
  designedByMobile: string
  clientName: string | null
  estimationEngineerName: string | null
  estimationEngineerMobile: string | null
  headOfSalesName: string | null
  headOfSalesMobile: string | null
  firmName: string | null
  buildingUsage: string
  numberOfBuilding: number
  frameType: string
  configuration: string
  createdAt: string
  updatedAt: string
}

/** Paginated response shape from GET /api/jobs. */
export interface GetJobsResponse {
  data: Job[]
  total: number
  page: number
  pageSize: number
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/jobs — paginated list.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches a paginated list of jobs from the backend.
 * Requires a Clerk session token for authentication.
 */
export async function getJobs(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetJobsResponse> {
  return await apiFetch(`/api/jobs?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated jobs list. Uses the shared `jobKeys`
 * factory so mutations can invalidate it reliably.
 */
export function useJobs(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: jobKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getJobs(token, page, pageSize)
    },
  })
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/jobs/:id — single job.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches a single job by its id.
 * Requires a Clerk session token for authentication.
 */
export async function getJobById(token: string | null, id: string): Promise<Job> {
  return await apiFetch(`/api/jobs/${id}`, token)
}

/**
 * React Query hook for a single job. Disabled until an `id` is available so it
 * never fires with an empty path segment. Uses the shared `jobKeys` factory so
 * mutations can invalidate the detail reliably.
 */
export function useJob(id: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: jobKeys.detail(id),
    enabled: !!id,
    queryFn: async () => {
      const token = await getToken()
      return getJobById(token, id)
    },
  })
}
