import { apiFetch } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { amountKeys } from './queryKeys'

/* ──────────────────────────────────────────────────────────────────────────
 * Response shapes.
 *
 * NOTE: Prisma `Decimal` columns serialize to JSON strings over HTTP
 * (`Decimal.prototype.toJSON`), so numeric-precision fields are typed as
 * `string | null` here even though the create/update payloads accept `number`.
 * ────────────────────────────────────────────────────────────────────────── */

/** Shape of a single Amount returned by the backend (flat model). */
export interface Amount {
  id: string
  jobId: string
  createdAt: string
  updatedAt: string

  steelStructuresQuantity?: string | null
  steelStructuresFabricationRate?: string | null
  steelStructuresErrectionRate?: string | null
  steelStructuresLoadingRate?: string | null
  steelStructuresFabricationAmount?: string | null
  steelStructuresErrectionAmount?: string | null
  steelStructuresLoadingAmount?: string | null

  windBracingsQuantity?: string | null
  windBracingsFabricationRate?: string | null
  windBracingsErrectionRate?: string | null
  windBracingsLoadingRate?: string | null
  windBracingsFabricationAmount?: string | null
  windBracingsErrectionAmount?: string | null
  windBracingsLoadingAmount?: string | null

  sagRodQuantity?: string | null
  sagRodFabricationRate?: string | null
  sagRodErrectionRate?: string | null
  sagRodLoadingRate?: string | null
  sagRodFabricationAmount?: string | null
  sagRodErrectionAmount?: string | null
  sagRodLoadingAmount?: string | null

  flangeBraceQuantity?: string | null
  flangeBraceFabricationRate?: string | null
  flangeBraceErrectionRate?: string | null
  flangeBraceLoadingRate?: string | null
  flangeBraceFabricationAmount?: string | null
  flangeBraceErrectionAmount?: string | null
  flangeBraceLoadingAmount?: string | null

  zCPurlinsQuantity?: string | null
  zCPurlinsFabricationRate?: string | null
  zCPurlinsErrectionRate?: string | null
  zCPurlinsLoadingRate?: string | null
  zCPurlinsFabricationAmount?: string | null
  zCPurlinsErrectionAmount?: string | null
  zCPurlinsLoadingAmount?: string | null

  roofSheetQuantity?: string | null
  roofSheetFabricationRate?: string | null
  roofSheetErrectionRate?: string | null
  roofSheetLoadingRate?: string | null
  roofSheetFabricationAmount?: string | null
  roofSheetErrectionAmount?: string | null
  roofSheetLoadingAmount?: string | null

  claddingSheetQuantity?: string | null
  claddingSheetFabricationRate?: string | null
  claddingSheetErrectionRate?: string | null
  claddingSheetLoadingRate?: string | null
  claddingSheetFabricationAmount?: string | null
  claddingSheetErrectionAmount?: string | null
  claddingSheetLoadingAmount?: string | null

  canopySheetQuantity?: string | null
  canopySheetFabricationRate?: string | null
  canopySheetErrectionRate?: string | null
  canopySheetLoadingRate?: string | null
  canopySheetFabricationAmount?: string | null
  canopySheetErrectionAmount?: string | null
  canopySheetLoadingAmount?: string | null

  purlinBoltsQuantity?: string | null
  purlinBoltsFabricationRate?: string | null
  purlinBoltsErrectionRate?: string | null
  purlinBoltsLoadingRate?: string | null
  purlinBoltsFabricationAmount?: string | null
  purlinBoltsErrectionAmount?: string | null
  purlinBoltsLoadingAmount?: string | null

  jointBoltsQuantity?: string | null
  jointBoltsFabricationRate?: string | null
  jointBoltsErrectionRate?: string | null
  jointBoltsLoadingRate?: string | null
  jointBoltsFabricationAmount?: string | null
  jointBoltsErrectionAmount?: string | null
  jointBoltsLoadingAmount?: string | null

  foundationBoltsQuantity?: string | null
  foundationBoltsFabricationRate?: string | null
  foundationBoltsErrectionRate?: string | null
  foundationBoltsLoadingRate?: string | null
  foundationBoltsFabricationAmount?: string | null
  foundationBoltsErrectionAmount?: string | null
  foundationBoltsLoadingAmount?: string | null

  anchorBoltsQuantity?: string | null
  anchorBoltsFabricationRate?: string | null
  anchorBoltsErrectionRate?: string | null
  anchorBoltsLoadingRate?: string | null
  anchorBoltsFabricationAmount?: string | null
  anchorBoltsErrectionAmount?: string | null
  anchorBoltsLoadingAmount?: string | null

  ridgeQuantity?: string | null
  ridgeFabricationRate?: string | null
  ridgeErrectionRate?: string | null
  ridgeLoadingRate?: string | null
  ridgeFabricationAmount?: string | null
  ridgeErrectionAmount?: string | null
  ridgeLoadingAmount?: string | null

  gutterQuantity?: string | null
  gutterFabricationRate?: string | null
  gutterErrectionRate?: string | null
  gutterLoadingRate?: string | null
  gutterFabricationAmount?: string | null
  gutterErrectionAmount?: string | null
  gutterLoadingAmount?: string | null

  downtakeQuantity?: string | null
  downtakeFabricationRate?: string | null
  downtakeErrectionRate?: string | null
  downtakeLoadingRate?: string | null
  downtakeFabricationAmount?: string | null
  downtakeErrectionAmount?: string | null
  downtakeLoadingAmount?: string | null

  dripTrimQuantity?: string | null
  dripTrimFabricationRate?: string | null
  dripTrimErrectionRate?: string | null
  dripTrimLoadingRate?: string | null
  dripTrimFabricationAmount?: string | null
  dripTrimErrectionAmount?: string | null
  dripTrimLoadingAmount?: string | null

  flashingQuantity?: string | null
  flashingFabricationRate?: string | null
  flashingErrectionRate?: string | null
  flashingLoadingRate?: string | null
  flashingFabricationAmount?: string | null
  flashingErrectionAmount?: string | null
  flashingLoadingAmount?: string | null

  rollingShutterQuantity?: string | null
  rollingShutterFabricationRate?: string | null
  rollingShutterErrectionRate?: string | null
  rollingShutterLoadingRate?: string | null
  rollingShutterFabricationAmount?: string | null
  rollingShutterErrectionAmount?: string | null
  rollingShutterLoadingAmount?: string | null

  louversQuantity?: string | null
  louversFabricationRate?: string | null
  louversErrectionRate?: string | null
  louversLoadingRate?: string | null
  louversFabricationAmount?: string | null
  louversErrectionAmount?: string | null
  louversLoadingAmount?: string | null

  skyLightQuantity?: string | null
  skyLightFabricationRate?: string | null
  skyLightErrectionRate?: string | null
  skyLightLoadingRate?: string | null
  skyLightFabricationAmount?: string | null
  skyLightErrectionAmount?: string | null
  skyLightLoadingAmount?: string | null

  wallLightQuantity?: string | null
  wallLightFabricationRate?: string | null
  wallLightErrectionRate?: string | null
  wallLightLoadingRate?: string | null
  wallLightFabricationAmount?: string | null
  wallLightErrectionAmount?: string | null
  wallLightLoadingAmount?: string | null

  roofInsulationQuantity?: string | null
  roofInsulationFabricationRate?: string | null
  roofInsulationErrectionRate?: string | null
  roofInsulationLoadingRate?: string | null
  roofInsulationFabricationAmount?: string | null
  roofInsulationErrectionAmount?: string | null
  roofInsulationLoadingAmount?: string | null

  wallInsulationQuantity?: string | null
  wallInsulationFabricationRate?: string | null
  wallInsulationErrectionRate?: string | null
  wallInsulationLoadingRate?: string | null
  wallInsulationFabricationAmount?: string | null
  wallInsulationErrectionAmount?: string | null
  wallInsulationLoadingAmount?: string | null

  turboVentilatorsQuantity?: string | null
  turboVentilatorsFabricationRate?: string | null
  turboVentilatorsErrectionRate?: string | null
  turboVentilatorsLoadingRate?: string | null
  turboVentilatorsFabricationAmount?: string | null
  turboVentilatorsErrectionAmount?: string | null
  turboVentilatorsLoadingAmount?: string | null

  deckingSheetQuantity?: string | null
  deckingSheetFabricationRate?: string | null
  deckingSheetErrectionRate?: string | null
  deckingSheetLoadingRate?: string | null
  deckingSheetFabricationAmount?: string | null
  deckingSheetErrectionAmount?: string | null
  deckingSheetLoadingAmount?: string | null

  shearStudsQuantity?: string | null
  shearStudsFabricationRate?: string | null
  shearStudsErrectionRate?: string | null
  shearStudsLoadingRate?: string | null
  shearStudsFabricationAmount?: string | null
  shearStudsErrectionAmount?: string | null
  shearStudsLoadingAmount?: string | null

  polyCarbonateSheetQuantity?: string | null
  polyCarbonateSheetFabricationRate?: string | null
  polyCarbonateSheetErrectionRate?: string | null
  polyCarbonateSheetLoadingRate?: string | null
  polyCarbonateSheetFabricationAmount?: string | null
  polyCarbonateSheetErrectionAmount?: string | null
  polyCarbonateSheetLoadingAmount?: string | null

  stair1Quantity?: string | null
  stair1FabricationRate?: string | null
  stair1ErrectionRate?: string | null
  stair1LoadingRate?: string | null
  stair1FabricationAmount?: string | null
  stair1ErrectionAmount?: string | null
  stair1LoadingAmount?: string | null

  stair2Quantity?: string | null
  stair2FabricationRate?: string | null
  stair2ErrectionRate?: string | null
  stair2LoadingRate?: string | null
  stair2FabricationAmount?: string | null
  stair2ErrectionAmount?: string | null
  stair2LoadingAmount?: string | null

  handrailQuantity?: string | null
  handrailFabricationRate?: string | null
  handrailErrectionRate?: string | null
  handrailLoadingRate?: string | null
  handrailFabricationAmount?: string | null
  handrailErrectionAmount?: string | null
  handrailLoadingAmount?: string | null

  canopySideCoveringQuantity?: string | null
  canopySideCoveringFabricationRate?: string | null
  canopySideCoveringErrectionRate?: string | null
  canopySideCoveringLoadingRate?: string | null
  canopySideCoveringFabricationAmount?: string | null
  canopySideCoveringErrectionAmount?: string | null
  canopySideCoveringLoadingAmount?: string | null

  doorsQuantity?: string | null
  doorsFabricationRate?: string | null
  doorsErrectionRate?: string | null
  doorsLoadingRate?: string | null
  doorsFabricationAmount?: string | null
  doorsErrectionAmount?: string | null
  doorsLoadingAmount?: string | null

  windowsQuantity?: string | null
  windowsFabricationRate?: string | null
  windowsErrectionRate?: string | null
  windowsLoadingRate?: string | null
  windowsFabricationAmount?: string | null
  windowsErrectionAmount?: string | null
  windowsLoadingAmount?: string | null

  fasciaStructureQuantity?: string | null
  fasciaStructureFabricationRate?: string | null
  fasciaStructureErrectionRate?: string | null
  fasciaStructureLoadingRate?: string | null
  fasciaStructureFabricationAmount?: string | null
  fasciaStructureErrectionAmount?: string | null
  fasciaStructureLoadingAmount?: string | null

  fasciaCoveringSheetBoardQuantity?: string | null
  fasciaCoveringSheetBoardFabricationRate?: string | null
  fasciaCoveringSheetBoardErrectionRate?: string | null
  fasciaCoveringSheetBoardLoadingRate?: string | null
  fasciaCoveringSheetBoardFabricationAmount?: string | null
  fasciaCoveringSheetBoardErrectionAmount?: string | null
  fasciaCoveringSheetBoardLoadingAmount?: string | null

  internalPartitionsQuantity?: string | null
  internalPartitionsFabricationRate?: string | null
  internalPartitionsErrectionRate?: string | null
  internalPartitionsLoadingRate?: string | null
  internalPartitionsFabricationAmount?: string | null
  internalPartitionsErrectionAmount?: string | null
  internalPartitionsLoadingAmount?: string | null

  totalFabricationAmount?: string | null
  totalErrectionAmount?: string | null
  totalLoadingAmount?: string | null
}

/** Paginated response shape from GET /api/amounts. */
export interface GetAmountsResponse {
  data: Amount[]
  total: number
  page: number
  pageSize: number
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/amounts — paginated list.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches a paginated list of amounts from the backend.
 * Requires a Clerk session token for authentication.
 */
export async function getAmounts(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetAmountsResponse> {
  return await apiFetch(`/api/amounts?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated amounts list. Uses the shared
 * `amountKeys` factory so mutations can invalidate it reliably.
 */
export function useAmounts(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: amountKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getAmounts(token, page, pageSize)
    },
  })
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/jobs/:jobId/amount — single amount for a job.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Fetches the amount belonging to a specific job.
 * Requires a Clerk session token for authentication.
 */
export async function getAmountByJobId(token: string | null, jobId: string): Promise<Amount> {
  return await apiFetch(`/api/jobs/${jobId}/amount`, token)
}

/**
 * React Query hook for a single job's amount. Disabled until a `jobId` is
 * available so it never fires with an empty path segment.
 */
export function useAmount(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: amountKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getAmountByJobId(token, jobId)
    },
  })
}
