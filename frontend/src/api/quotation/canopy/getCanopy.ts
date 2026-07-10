import { apiFetch } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { canopyKeys } from './queryKeys'

/* ──────────────────────────────────────────────────────────────────────────
 * Enum unions — mirror the backend Prisma enums (string literals over the wire).
 * ────────────────────────────────────────────────────────────────────────── */

/** Floor level a canopy starts from. */
export type CanopyHeightFrom = 'GROUND' | 'FF' | 'SF' | 'FLOOR_3' | 'FLOOR_4' | 'FLOOR_5'

/** Canopy sheet covering type. */
export type CanopySheetType = 'NCGL' | 'PPGL' | 'PUFF' | 'OTHER'

/* ──────────────────────────────────────────────────────────────────────────
 * Response shapes.
 *
 * NOTE: Prisma `Decimal` columns serialize to JSON strings over HTTP
 * (`Decimal.prototype.toJSON`), so numeric-precision fields are typed as
 * `string` here even though the create/update payloads accept `number`.
 * `Int` columns stay `number`; enums are string-literal unions.
 * ────────────────────────────────────────────────────────────────────────── */

/** A single canopy entry attached to a canopy container. */
export interface CanopyItem {
  id: string
  canopyId: string

  code: string | null
  heightFrom: CanopyHeightFrom | null

  // ── Dimensions ──
  length: string | null
  width: string | null
  height: string | null
  materialConsumptionKgPerSqft: string | null

  // ── Members ──
  numberOfBeams: number | null
  numberOfPurlins: number | null
  purlinDepth: string | null
  unitWeightOfPurlin: string | null

  // ── Covering ──
  canopySheet: CanopySheetType | null
  sheetThick: string | null
  canopySideCoveringHeight: string | null

  // ── Accessories ──
  gutter: boolean | null
  downTake: boolean | null
  flashing: boolean | null
}

/** Shape of a single Canopy returned by the backend (with inline canopies). */
export interface Canopy {
  id: string
  jobId: string
  createdAt: string
  updatedAt: string
  canopies: CanopyItem[]
}

/** Paginated response shape from GET /api/canopies. */
export interface GetCanopiesResponse {
  data: Canopy[]
  total: number
  page: number
  pageSize: number
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/canopies — paginated list.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches a paginated list of canopies from the backend.
 * Requires a Clerk session token for authentication.
 */
export async function getCanopies(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetCanopiesResponse> {
  return await apiFetch(`/api/canopies?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated canopies list. Uses the shared `canopyKeys`
 * factory so mutations can invalidate it reliably.
 */
export function useCanopies(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: canopyKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getCanopies(token, page, pageSize)
    },
  })
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/jobs/:jobId/canopy — single canopy for a job.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches the canopy belonging to a specific job.
 * Requires a Clerk session token for authentication.
 */
export async function getCanopyByJobId(token: string | null, jobId: string): Promise<Canopy> {
  return await apiFetch(`/api/jobs/${jobId}/canopy`, token)
}

/**
 * React Query hook for a single job's canopy. Disabled until a `jobId` is
 * available so it never fires with an empty path segment.
 */
export function useCanopy(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: canopyKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getCanopyByJobId(token, jobId)
    },
  })
}
