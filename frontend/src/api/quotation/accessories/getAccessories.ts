import { apiFetch } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { accessoriesKeys } from './queryKeys'

/* ──────────────────────────────────────────────────────────────────────────
 * Enum unions — mirror the backend Prisma enums (string literals over the wire).
 * ────────────────────────────────────────────────────────────────────────── */

/** Drainage material for gutters and down takes. */
export type DrainageMaterial = 'PPGL' | 'UPVC' | 'ALUMINIUM' | 'GI' | 'COPPER' | 'TIN'

/** Nominal drainage sizes (inches). */
export type DrainageSize = 'IN_4' | 'IN_6' | 'IN_8' | 'IN_10' | 'IN_12' | 'IN_18' | 'IN_24'

/** Flashing material used for drip trims, gable ends, corner flash and ridges. */
export type FlashingType = 'PPGL' | 'NCGL' | 'GI'

/** Flashing sheet thickness (mm). */
export type FlashingThickness =
  | 'MM_0_30' | 'MM_0_35' | 'MM_0_40' | 'MM_0_45' | 'MM_0_47' | 'MM_0_50' | 'MM_0_55'
  | 'MM_0_80' | 'MM_1_00' | 'MM_1_20' | 'MM_1_60' | 'MM_1_80' | 'MM_2_00'

/** Partition wall construction type. */
export type PartitionType = 'AEROCON_PANEL' | 'CEMENT_BOARD' | 'PPGL_SHEET' | 'PUFF_SHEET' | 'PLY_BOARD'

/** Partition thickness (mm). */
export type PartitionThickness =
  | 'MM_0_40' | 'MM_0_45' | 'MM_0_47' | 'MM_6' | 'MM_8' | 'MM_12'
  | 'MM_16' | 'MM_18' | 'MM_30' | 'MM_40' | 'MM_50' | 'MM_75'

/** Roof/wall insulation material. */
export type InsulationType = 'XLPE' | 'ROCK_WOOL' | 'GLASS_WOOL' | 'ALUMINIUM_BUBBLE' | 'COOL_BOARD'

/** Turbo ventilator diameter. */
export type TurboVentilatorDiameter = 'IN_6' | 'FT_1' | 'IN_18' | 'FT_2'


/** Paint/primer product type for frames. */
export type PaintType = 'EPOXY_PRIMER' | 'EPOXY_PAINT'

/** Purlins & girts protective finish. */
export type PurlinsGirtsFinish = 'PRE_GALVANISED'

/** Whether purlins & girts are painted. */
export type PurlinsGirtsPaint = 'UNPAINTED' | 'PAINTED'

/** Foundation bolt finish. */
export type FoundationBoltFinish = 'BLACK_UNPAINTED'

/* ──────────────────────────────────────────────────────────────────────────
 * Response shapes.
 *
 * NOTE: Prisma `Decimal` columns serialize to JSON strings over HTTP
 * (`Decimal.prototype.toJSON`), so numeric-precision fields are typed as
 * `string` here even though the create/update payloads accept `number`.
 * `Int` columns stay `number`; enums are string-literal unions. Every line
 * item's `quantity` is server-derived (advisory) and returned as a Decimal
 * string.
 * ────────────────────────────────────────────────────────────────────────── */

/** A door line item attached to an accessories container. */
export interface AccessoryDoor {
  id: string
  accessoriesId: string
  height: string | null
  width: string | null
  nos: number | null
  quantity: string | null
}

/** A window line item attached to an accessories container. */
export interface AccessoryWindow {
  id: string
  accessoriesId: string
  height: string | null
  width: string | null
  nos: number | null
  quantity: string | null
}

/** A folded-plate line item attached to an accessories container. */
export interface AccessoryFoldedPlate {
  id: string
  accessoriesId: string
  length: string | null
  width: string | null
  nos: number | null
  quantity: string | null
}


/** Shape of a single Accessories returned by the backend (with inline arrays). */
export interface Accessories {
  id: string
  jobId: string
  createdAt: string
  updatedAt: string

  // ── Gutter ──
  gutterType: DrainageMaterial | null
  gutterSize: DrainageSize | null
  gutterQuantity: string | null
  gutterQuantityManual: boolean | null

  // ── Down Take ──
  downTakeType: DrainageMaterial | null
  downTakeSize: DrainageSize | null
  downTakeQuantity: string | null
  downTakeQuantityManual: boolean | null

  // ── Drip Trim ──
  dripTrimType: FlashingType | null
  dripTrimThickness: FlashingThickness | null
  dripTrimQuantity: string | null
  dripTrimQuantityManual: boolean | null

  // ── Gable End Flashing ──
  gableEndFlashingType: FlashingType | null
  gableEndFlashingThickness: FlashingThickness | null
  gableEndFlashingQuantity: string | null
  gableEndFlashingQuantityManual: boolean | null

  // ── Corner Flash ──
  cornerFlashType: FlashingType | null
  cornerFlashThickness: FlashingThickness | null
  cornerFlashQuantity: string | null
  cornerFlashQuantityManual: boolean | null

  // ── Ridge ──
  ridgeType: FlashingType | null
  ridgeThickness: FlashingThickness | null
  ridgeQuantity: string | null
  ridgeQuantityManual: boolean | null

  // ── Partition ──
  partitionType: PartitionType | null
  partitionThickness: PartitionThickness | null
  partitionQuantity: number | null

  // ── Openings ──
  rollingShutterLength: string | null
  rollingShutterWidth: string | null
  rollingShutterNos: number | null
  rollingShutterQuantity: string | null

  louverLength: string | null
  louverWidth: string | null
  louverNos: number | null
  louverQuantity: string | null

  skyLightLength: string | null
  skyLightWidth: string | null
  skyLightNos: number | null
  skyLightQuantity: string | null

  wallLightLength: string | null
  wallLightWidth: string | null
  wallLightNos: number | null
  wallLightQuantity: string | null

  // ── Insulation ──
  roofInsulationType: InsulationType | null
  wallInsulationType: InsulationType | null

  // ── Turbo Ventilator ──
  turboVentilatorDiameter: TurboVentilatorDiameter | null
  turboVentilatorNos: number | null

  // ── Handrail ──
  handrailWeightKg: string | null

  // ── Feature toggles ──
  deckSheetFlashingEnabled: boolean | null
  gantryGirderEnabled: boolean | null
  liftStructureEnabled: boolean | null

  // ── Paint & Primer: Frames ──
  framesPrimerCoats: number | null
  framesPrimerType: PaintType | null
  framesPaintCoats: number | null
  framesPaintType: PaintType | null

  // ── Paint & Primer: Purlins & Girts ──
  purlinsGirtsFinish: PurlinsGirtsFinish | null
  purlinsGirtsGsm: number | null
  purlinsGirtsPaint: PurlinsGirtsPaint | null

  // ── Paint & Primer: Foundation Bolt ──
  foundationBoltFinish: FoundationBoltFinish | null

  // ── Inline line-item arrays ──
  doors: AccessoryDoor[]
  windows: AccessoryWindow[]
  foldedPlates: AccessoryFoldedPlate[]
}

/** Paginated response shape from GET /api/accessories. */
export interface GetAccessoriesResponse {
  data: Accessories[]
  total: number
  page: number
  pageSize: number
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/accessories — paginated list.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches a paginated list of accessories from the backend.
 * Requires a Clerk session token for authentication.
 */
export async function getAccessories(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetAccessoriesResponse> {
  return await apiFetch(`/api/accessories?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated accessories list. Uses the shared
 * `accessoriesKeys` factory so mutations can invalidate it reliably.
 */
export function useAccessories(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: accessoriesKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getAccessories(token, page, pageSize)
    },
  })
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/jobs/:jobId/accessories — single accessories for a job.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches the accessories belonging to a specific job.
 * Requires a Clerk session token for authentication.
 */
export async function getAccessoriesByJobId(token: string | null, jobId: string): Promise<Accessories> {
  return await apiFetch(`/api/jobs/${jobId}/accessories`, token)
}

/**
 * React Query hook for a single job's accessories. Disabled until a `jobId` is
 * available so it never fires with an empty path segment.
 */
export function useAccessory(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: accessoriesKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getAccessoriesByJobId(token, jobId)
    },
  })
}
