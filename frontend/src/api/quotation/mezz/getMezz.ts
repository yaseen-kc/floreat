import { apiFetch, ApiError } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { mezzanineKeys } from './queryKeys'

/* ──────────────────────────────────────────────────────────────────────────
 * Enum unions — mirror the backend Prisma enums (string literals over the wire).
 * ────────────────────────────────────────────────────────────────────────── */

/** Mezzanine deck/slab construction type. */
export type MezzanineType = 'DECK_SHEET' | 'FOLDED_PLATE' | 'PANEL' | 'BOARD' | 'RCC_SLAB'

/** Mezzanine extension code identifier. */
export type MezzanineFloorCodeExt = 'EXT_1' | 'EXT_2' | 'EXT_3'

/** Mezzanine floor level (1st through 10th). */
export type MezzanineFloorLevel =
  | 'FLOOR_1'
  | 'FLOOR_2'
  | 'FLOOR_3'
  | 'FLOOR_4'
  | 'FLOOR_5'
  | 'FLOOR_6'
  | 'FLOOR_7'
  | 'FLOOR_8'
  | 'FLOOR_9'
  | 'FLOOR_10'

/** Reference level a mezzanine height is measured from. */
export type MezzanineHeightFrom = 'GROUND' | 'FIRST_FLOOR' | 'FLOOR_2' | 'FLOOR_3' | 'FLOOR_4' | 'FLOOR_5'

/* ──────────────────────────────────────────────────────────────────────────
 * Response shapes.
 *
 * NOTE: Prisma `Decimal` columns serialize to JSON strings over HTTP
 * (`Decimal.prototype.toJSON`), so numeric-precision fields are typed as
 * `string` here even though the create/update payloads accept `number`.
 * ────────────────────────────────────────────────────────────────────────── */

/** A single mezzanine floor entry — all fields nullable (backend columns are optional). */
export interface MezzanineFloor {
  id: string
  mezzanineId: string

  code: string | null
  floor: MezzanineFloorLevel | null
  type: MezzanineType | null
  heightFrom: MezzanineHeightFrom | null

  // ── Dimensions ──
  thicknessMm: string | null
  lengthM: string | null
  widthM: string | null
  heightM: string | null
  materialConsumptionKgPerSqft: string | null

  // ── Beams ──
  beamsMidPrimary: number | null
  beamsEndPrimary: number | null
  beamsSecondary: number | null

  // ── Joints in beams ──
  jointsMidPrimary: number | null
  jointsEndPrimary: number | null

  // ── Internal columns ──
  internalColumnsMidPrimary: number | null
  internalColumnsEndPrimary: number | null
}

/** A single mezzanine floor-extension entry — all fields nullable. */
export interface MezzanineFloorExtension {
  id: string
  mezzanineId: string

  code: MezzanineFloorCodeExt | null
  type: MezzanineType | null
  heightFrom: MezzanineHeightFrom | null
  typicalTo: MezzanineFloorLevel | null

  // ── Dimensions ──
  thicknessMm: string | null
  lengthM: string | null
  widthM: string | null
  heightM: string | null

  // ── Beams ──
  beamsMidPrimary: number | null
  beamsEndPrimary: number | null
  beamsSecondary: number | null

  // ── Joints in beams ──
  jointsMidPrimary: number | null
  jointsEndPrimary: number | null

  // ── Extended columns ──
  extendedColumnsMidPrimary: number | null
  extendedColumnsEndPrimary: number | null
}

/** Shape of a single Mezzanine returned by the backend (with inline floors/extensions). */
export interface Mezzanine {
  id: string
  jobId: string
  createdAt: string
  updatedAt: string

  floors: MezzanineFloor[]
  extensions: MezzanineFloorExtension[]
}

/** Paginated response shape from GET /api/mezzanines. */
export interface GetMezzaninesResponse {
  data: Mezzanine[]
  total: number
  page: number
  pageSize: number
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/mezzanines — paginated list.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches a paginated list of mezzanines from the backend.
 * Requires a Clerk session token for authentication.
 */
export async function getMezzanines(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetMezzaninesResponse> {
  return await apiFetch(`/api/mezzanines?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated mezzanines list. Uses the shared
 * `mezzanineKeys` factory so mutations can invalidate it reliably.
 */
export function useMezzanines(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: mezzanineKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getMezzanines(token, page, pageSize)
    },
  })
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/jobs/:jobId/mezzanine — single mezzanine for a job.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches the mezzanine belonging to a specific job.
 * Returns `null` when no mezzanine exists yet (404) — this is the expected
 * empty state for a new job, not an error.
 * Requires a Clerk session token for authentication.
 */
export async function getMezzanineByJobId(token: string | null, jobId: string): Promise<Mezzanine | null> {
  try {
    return await apiFetch(`/api/jobs/${jobId}/mezzanine`, token)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}

/**
 * React Query hook for a single job's mezzanine. Disabled until a `jobId` is
 * available so it never fires with an empty path segment. Returns `null` when
 * no mezzanine exists yet; `retry: false` prevents retry storms on 404.
 */
export function useMezzanine(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: mezzanineKeys.detail(jobId),
    enabled: !!jobId,
    retry: false,
    queryFn: async () => {
      const token = await getToken()
      return getMezzanineByJobId(token, jobId)
    },
  })
}
