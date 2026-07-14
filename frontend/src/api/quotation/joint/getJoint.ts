import { apiFetch } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { jointKeys } from './queryKeys'

/* ──────────────────────────────────────────────────────────────────────────
 * Enum unions — mirror the backend Prisma enums (string literals over the wire).
 *
 * NOTE: `RoofJointId` uses the Prisma enum *member names* (e.g. `A_1`), not the
 * `@map`'d hyphenated DB/UI form (`A-1`) — Prisma serializes enums to their
 * member name in JSON, matching the shared `roofJointIdEnum` values.
 * ────────────────────────────────────────────────────────────────────────── */

/** Bolt type: high-strength friction grip or ordinary. */
export type BoltType = 'HSFG' | 'ORD'

/** Closed set of roof joint codes. */
export type RoofJointId =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'
  | 'A_1' | 'B_1' | 'B_2' | 'C_1' | 'D_1' | 'G_1' | 'H_1' | 'I_1' | 'K_1' | 'L_1'

/** Closed set of mezzanine joint codes. */
export type MezzanineJointId = 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'SEC'

/** Closed set of foundation bolt joint codes. */
export type FoundationBoltJointId = 'FB4' | 'FB5' | 'FB6'

/* ──────────────────────────────────────────────────────────────────────────
 * Response shapes.
 *
 * NOTE: Prisma `Decimal` columns serialize to JSON strings over HTTP
 * (`Decimal.prototype.toJSON`), so numeric-precision fields (`*BoltDiameter`)
 * are typed as `string` here even though the create/update payloads accept
 * `number`. `Int` counts stay `number`; enums are string-literal unions.
 * ────────────────────────────────────────────────────────────────────────── */

/** A roof joint bolt row attached to a joint container. */
export interface JointBoltRoofItem {
  id: string
  jointId: string
  roofJointId: RoofJointId
  boltDiameter: string | null
  numberOfBolts: number | null
}

/** A mezzanine joint bolt row attached to a joint container. */
export interface JointBoltMezzanineItem {
  id: string
  jointId: string
  mezzanineJointId: MezzanineJointId
  boltDiameter: string | null
  numberOfBolts: number | null
}

/** A foundation bolt row attached to a joint container. */
export interface FoundationBoltRoofItem {
  id: string
  jointId: string
  foundationJointId: FoundationBoltJointId
  boltDiameter: string | null
  numberOfBolts: number | null
}

/** Shape of a single Joint returned by the backend (with inline child arrays). */
export interface Joint {
  id: string
  jobId: string

  // ── Secondary beams ──
  secondaryBeamsBoltType: BoltType | null
  secondaryBeamsBoltDiameter: string | null
  secondaryBeamsNumberOfBolts: number | null

  // ── Purlins & flange brace ──
  purlinFlangeBraceBoltType: BoltType | null
  purlinFlangeBraceBoltDiameter: string | null
  purlinFlangeBraceNumberOfBolts: number | null

  // ── Cladding purlins ──
  claddingPurlinsBoltType: BoltType | null
  claddingPurlinsBoltDiameter: string | null
  claddingPurlinsNumberOfBolts: number | null

  // ── Canopy ──
  canopyBoltType: BoltType | null
  canopyBoltDiameter: string | null
  canopyNumberOfBolts: number | null

  createdAt: string
  updatedAt: string

  jointBoltRoof: JointBoltRoofItem[]
  jointBoltMezzanine: JointBoltMezzanineItem[]
  foundationBoltRoof: FoundationBoltRoofItem[]
}

/** Paginated response shape from GET /api/joints. */
export interface GetJointsResponse {
  data: Joint[]
  total: number
  page: number
  pageSize: number
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/joints — paginated list.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches a paginated list of joints from the backend.
 * Requires a Clerk session token for authentication.
 */
export async function getJoints(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetJointsResponse> {
  return await apiFetch(`/api/joints?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated joints list. Uses the shared `jointKeys`
 * factory so mutations can invalidate it reliably.
 */
export function useJoints(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: jointKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getJoints(token, page, pageSize)
    },
  })
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/jobs/:jobId/joint — single joint for a job.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches the joint belonging to a specific job.
 * Requires a Clerk session token for authentication.
 */
export async function getJointByJobId(token: string | null, jobId: string): Promise<Joint> {
  return await apiFetch(`/api/jobs/${jobId}/joint`, token)
}

/**
 * React Query hook for a single job's joint. Disabled until a `jobId` is
 * available so it never fires with an empty path segment.
 */
export function useJoint(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: jointKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getJointByJobId(token, jobId)
    },
  })
}
