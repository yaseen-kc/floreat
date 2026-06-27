import { apiFetch } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { loadKeys } from './queryKeys'

/* ──────────────────────────────────────────────────────────────────────────
 * Enum unions — mirror the backend Prisma enums (string literals over the wire).
 * ────────────────────────────────────────────────────────────────────────── */

/** Time unit for the approval-drawings completion period. */
export type ApprovalDrawingsTimeUnit = 'DAYS' | 'WEEKS' | 'MONTHS'

/* ──────────────────────────────────────────────────────────────────────────
 * Response shapes.
 *
 * NOTE: Prisma `Decimal` columns serialize to JSON strings over HTTP
 * (`Decimal.prototype.toJSON`), so numeric-precision fields are typed as
 * `string` here even though the create/update payloads accept `number`.
 * `Int` columns remain `number`. Load is a flat 1:1-per-job resource with no
 * child arrays.
 * ────────────────────────────────────────────────────────────────────────── */

/** Shape of a single Load returned by the backend. */
export interface Load {
  id: string
  jobId: string

  // ── Load details (Decimal → string; units implied: KN/M²; wind = KMPH) ──
  deadLoadOnRoofRafters: string | null
  liveLoadOnRoofRafters: string | null
  collateralLoadOnRoofRafters: string | null
  windLoadOnRoofRaftersUpward: string | null
  windLoadHorizontal: string | null
  deadLoadOnRoofFloor: string | null
  liveLoadOnRoofFloor: string | null
  floorDeadLoad: string | null
  floorFinishLoad: string | null
  floorLiveLoad: string | null
  snowLoad: string | null
  earthquakeLoad: string | null

  // ── Completion period ──
  approvalDrawingsTime: number | null
  approvalDrawingsUnit: ApprovalDrawingsTimeUnit | null
  supplyOfMaterialsDays: number | null
  erectionOfStructureDays: number | null

  createdAt: string
  updatedAt: string
}

/** Paginated response shape from GET /api/loads. */
export interface GetLoadsResponse {
  data: Load[]
  total: number
  page: number
  pageSize: number
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/loads — paginated list.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches a paginated list of loads from the backend.
 * Requires a Clerk session token for authentication.
 */
export async function getLoads(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetLoadsResponse> {
  return await apiFetch(`/api/loads?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated loads list. Uses the shared `loadKeys`
 * factory so mutations can invalidate it reliably.
 */
export function useLoads(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: loadKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getLoads(token, page, pageSize)
    },
  })
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/jobs/:jobId/load — single load for a job.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches the load belonging to a specific job.
 * Requires a Clerk session token for authentication.
 */
export async function getLoadByJobId(token: string | null, jobId: string): Promise<Load> {
  return await apiFetch(`/api/jobs/${jobId}/load`, token)
}

/**
 * React Query hook for a single job's load. Disabled until a `jobId` is
 * available so it never fires with an empty path segment.
 */
export function useLoad(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: loadKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getLoadByJobId(token, jobId)
    },
  })
}
