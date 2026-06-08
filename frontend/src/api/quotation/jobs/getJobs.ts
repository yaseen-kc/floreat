import { apiFetch } from '@/lib/api'

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
