import { apiFetch } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { roofKeys } from './queryKeys'

/* ──────────────────────────────────────────────────────────────────────────
 * Enum unions — mirror the backend Prisma enums (string literals over the wire).
 * ────────────────────────────────────────────────────────────────────────── */

/** How the roof frame base is fixed to its support. */
export type RoofFrameBaseFixing = 'FOUNDATION_BOLT' | 'ANCHOR_BOLT' | 'JOINT_BOLT_ON_STEEL_COLUMN'

/** Purlin material profile. */
export type PurlinMaterialType = 'Z_C' | 'TUBE'

/** Roof/cladding covering material. */
export type CoveringType = 'BARE_GALVALUME' | 'PPGL' | 'PUFF_SHEET' | 'OTHER'

/** Wind bracing member type. */
export type TypeOfWindBracing = 'ROD' | 'TUBE'

/** Structural plate material grade. */
export type PlateMaterialGrade = 'FE_345' | 'FE_250' | 'FE_400'

/** Which side of the building a sidewall belongs to. */
export type SideWallSide = 'FRONT' | 'BACK' | 'RIGHT' | 'LEFT'

/** Sidewall construction type. */
export type TypeOfWall = 'BRICK' | 'PANEL' | 'LATERITE' | 'AAC' | 'BLOCK'

/* ──────────────────────────────────────────────────────────────────────────
 * Response shapes.
 *
 * NOTE: Prisma `Decimal` columns serialize to JSON strings over HTTP
 * (`Decimal.prototype.toJSON`), so numeric-precision fields are typed as
 * `string` here even though the create/update payloads accept `number`.
 * ────────────────────────────────────────────────────────────────────────── */

/** A single sidewall entry attached to a roof. */
export interface Sidewall {
  id: string
  roofId: string
  side: SideWallSide
  wallType: TypeOfWall
  thickness: string
  height: string
}

/** Shape of a single Roof returned by the backend (with inline sidewalls). */
export interface Roof {
  id: string
  jobId: string

  // ── Required core dimensions ──
  buildingOverallLength: string
  buildingOverallWidth: string
  eaveHeight: string
  roofSlope: string
  mainRoofFrames: number
  endRoofFrames: number
  roofPurlinSpacing: string
  claddingPurlins: number
  internalColumnsForMainRoofFrames: number
  internalColumnsForEndRoofFrames: number
  roofFrameBaseFixing: RoofFrameBaseFixing

  // ── Optional members ──
  columnSegmentsInMainFrame: number | null
  raftersInOneHalfOfMainFrame: number | null
  columnSegmentsInEndFrame: number | null
  raftersInOneHalfOfEndFrame: number | null
  endFrameHorizontalTieBeam: number | null

  // ── Optional purlin ──
  roofPurlinType: PurlinMaterialType | null
  roofPurlinDepth: string | null
  roofPurlinUnitWeight: string | null
  claddingPurlinType: PurlinMaterialType | null
  claddingPurlinDepth: string | null
  claddingPurlinUnitWeight: string | null

  // ── Optional covering ──
  roofCoveringType: CoveringType | null
  roofCoveringThickness: string | null
  claddingCoveringType: CoveringType | null
  claddingCoveringThickness: string | null
  roofAreaDeduction: string | null

  // ── Optional flange brace ──
  roofFlangeBraceAverageLength: string | null
  claddingFlangeBraceAverageLength: string | null
  endFrameFlangeBraceAverageLength: string | null

  // ── Optional polycarbonate ──
  polycarbonateRoofLength: string | null
  polycarbonateRoofWidth: string | null
  polycarbonateRoofCount: number | null

  // ── Optional wind bracing ──
  roofWindBracingSegmentsInOneHalf: number | null
  columnWindBracingSegments: number | null
  roofWindBracingProvidedBays: number | null
  columnWindBracingProvidedBays: number | null
  windBracingColumnHeight: string | null
  windBracingUnitWeight: string | null
  roofWindBracingBaySpacing: string | null
  columnWindBracingBaySpacing: string | null
  roofWindBracingLength: string | null
  columnWindBracingLength: string | null
  windBracingType: TypeOfWindBracing | null

  // ── Optional cladding opening ──
  frontCladdingOpeningArea: string | null
  backCladdingOpeningArea: string | null
  rightCladdingOpeningArea: string | null
  leftCladdingOpeningArea: string | null

  // ── Optional fascia board ──
  fasciaBoardArea: string | null
  fasciaMaterialWeightPerSqft: string | null

  // ── Optional side extension ──
  roofExtensionWidthHeight: string | null
  roofExtensionMidFrameCount: number | null
  roofExtensionEndFrameCount: number | null
  claddingExtensionWidthHeight: string | null
  claddingExtensionMidFrameCount: number | null
  claddingExtensionEndFrameCount: number | null
  sideColumnsWidthHeight: string | null
  sideColumnsMidFrameCount: number | null
  sideColumnsEndFrameCount: number | null

  // ── Optional material grade ──
  gradeOfPlateMaterial: PlateMaterialGrade | null

  // ── Optional material consumption ──
  materialConsumptionExcludingPurlin: string | null

  // ── Optional SAG rod ──
  diaOfRoofSagRod: string | null
  diaOfCladdingSagRod: string | null

  createdAt: string
  updatedAt: string

  sidewalls: Sidewall[]
}

/** Paginated response shape from GET /api/roofs. */
export interface GetRoofsResponse {
  data: Roof[]
  total: number
  page: number
  pageSize: number
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/roofs — paginated list.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches a paginated list of roofs from the backend.
 * Requires a Clerk session token for authentication.
 */
export async function getRoofs(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetRoofsResponse> {
  return await apiFetch(`/api/roofs?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated roofs list. Uses the shared `roofKeys`
 * factory so mutations can invalidate it reliably.
 */
export function useRoofs(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: roofKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getRoofs(token, page, pageSize)
    },
  })
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/jobs/:jobId/roof — single roof for a job.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches the roof belonging to a specific job.
 * Requires a Clerk session token for authentication.
 */
export async function getRoofByJobId(token: string | null, jobId: string): Promise<Roof> {
  return await apiFetch(`/api/jobs/${jobId}/roof`, token)
}

/**
 * React Query hook for a single job's roof. Disabled until a `jobId` is
 * available so it never fires with an empty path segment.
 */
export function useRoof(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: roofKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getRoofByJobId(token, jobId)
    },
  })
}
