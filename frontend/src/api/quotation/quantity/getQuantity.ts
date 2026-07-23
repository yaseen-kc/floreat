import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { quantityUnitEnum } from '@floreat/shared/schemas'
import type { DecimalString, Nullable } from '@floreat/shared/types'
import { quantityKeys } from './queryKeys'
import { z } from 'zod'

/** Units a quantity leaf can be measured in, derived from the shared quantity schema. */
export type QuantityUnit = z.infer<typeof quantityUnitEnum>

type DecimalField = Nullable<DecimalString>
type CountField = Nullable<number>
type TextField = Nullable<string>
type UnitField = Nullable<QuantityUnit>

interface QuantitySectionMeta {
  id: string
  quantityId: string
}

/**
 * Quantity pebRoof section as returned by the backend.
 *
 * NOTE: Prisma `Decimal` columns serialize to JSON strings over HTTP, so
 * numeric-precision fields are `DecimalString | null` even though payloads
 * accept numbers. Integer count fields stay `number | null`.
 */
export interface QuantityPebRoof extends QuantitySectionMeta {
  quantityPebRoofValue: Nullable<boolean>
  materialWithPurlinUnit: UnitField
  materialWithPurlinQuantity: DecimalField
  raftersAndColumnsSpecification: TextField
  raftersAndColumnsUnit: UnitField
  raftersAndColumnsQuantity: DecimalField
  raftersAndColumnsAdditionalQuantity: DecimalField
  raftersAndColumnsBuildingLength: DecimalField
  raftersAndColumnsBuildingLengthUnit: UnitField
  raftersAndColumnsInclinedLengthOneHalf: DecimalField
  raftersAndColumnsInclinedLengthUnit: UnitField
  raftersAndColumnsRoofArea: DecimalField
  raftersAndColumnsRoofAreaUnit: UnitField
  raftersAndColumnsMaterialConsumption: DecimalField
  raftersAndColumnsMaterialConsumptionUnit: UnitField
  roofPurlinesValue: DecimalField
  roofPurlinsSpecification: TextField
  roofPurlinsUnit: UnitField
  roofPurlinsQuantity: DecimalField
  roofPurlinsAdditionalQuantity: DecimalField
  roofPurlinsSinglePurlinLength: DecimalField
  roofPurlinsSinglePurlinLengthUnit: UnitField
  roofPurlinsPurlinsPerFrame: CountField
  roofPurlinsTotalPurlinBays: CountField
  roofPurlinsPurlinUnitWeight: DecimalField
  roofPurlinsPurlinUnitWeightUnit: UnitField
  roofPurlinsExtendedFramePurlins: CountField
  roofPurlinsExtendedPurlinBays: CountField
  roofSheetSpecification: TextField
  roofSheetUnit: UnitField
  roofSheetQuantity: DecimalField
  roofSheetPurchaseQuantity: DecimalField
  roofSheetAdditionalQuantity: DecimalField
  roofSheetExtendedRoofWidth: DecimalField
  roofSheetExtendedRoofWidthUnit: UnitField
  roofSheetExtendedRoofLength: DecimalField
  roofSheetExtendedRoofLengthUnit: UnitField
  roofSheetRoofAreaDeductions: DecimalField
  roofSheetRoofAreaDeductionsUnit: UnitField
  roofSheetPolycarbonateAreaDeduction: DecimalField
  roofSheetPolycarbonateAreaDeductionUnit: UnitField
  polycarbonateSheetUnit: UnitField
  polycarbonateSheetQuantity: DecimalField
  polycarbonateSheetPurchaseQuantity: DecimalField
  polycarbonateSheetAdditionalQuantity: DecimalField
  polycarbonateSheetSheetLength: DecimalField
  polycarbonateSheetSheetLengthUnit: UnitField
  polycarbonateSheetSheetWidth: DecimalField
  polycarbonateSheetSheetWidthUnit: UnitField
  polycarbonateSheetNumberOfSheets: CountField
  roofWindBracingsUnit: UnitField
  roofWindBracingsQuantity: DecimalField
  roofWindBracingsAdditionalQuantity: DecimalField
  roofWindBracingsSingleBracingLength: DecimalField
  roofWindBracingsSingleBracingLengthUnit: UnitField
  roofWindBracingsTotalBracings: CountField
  roofWindBracingsUnitWeight: DecimalField
  roofWindBracingsUnitWeightUnit: UnitField
  roofSagRodValue: DecimalField
  roofSagRodUnit: UnitField
  roofSagRodQuantity: DecimalField
  roofSagRodAdditionalQuantity: DecimalField
  roofSagRodSingleSagRodLength: DecimalField
  roofSagRodSingleSagRodLengthUnit: UnitField
  roofSagRodSagRodsPerFrame: CountField
  roofSagRodSagRodBays: CountField
  roofSagRodExtendedFrameSagRods: CountField
  roofSagRodExtendedSagRodBays: CountField
  roofSagRodUnitWeight: DecimalField
  roofSagRodUnitWeightUnit: UnitField
  roofFlangeBraceUnit: UnitField
  roofFlangeBraceQuantity: DecimalField
  roofFlangeBraceAdditionalQuantity: DecimalField
  roofFlangeBraceMidFrameBraceLength: DecimalField
  roofFlangeBraceMidFrameBraceLengthUnit: UnitField
  roofFlangeBraceMidFrameBraces: CountField
  roofFlangeBraceEndFrameBraces: CountField
  roofFlangeBraceMidFrames: CountField
  roofFlangeBraceEndFrames: CountField
  roofFlangeBraceExtendedFrameMidBraces: CountField
  roofFlangeBraceExtendedFrameEndBraces: CountField
  roofFlangeBraceExtendedMidFrames: CountField
  roofFlangeBraceExtendedEndFrames: CountField
  roofFlangeBraceEndFrameBraceLength: DecimalField
  roofFlangeBraceEndFrameBraceLengthUnit: UnitField
  purlinBoltsSpecification: TextField
  purlinBoltsUnit: UnitField
  purlinBoltsQuantity: DecimalField
  purlinBoltsPurlinJointsPerFrame: CountField
  purlinBoltsTotalFrames: CountField
  purlinBoltsExtendedFramePurlinNodes: CountField
  purlinBoltsExtendedFrames: CountField
  purlinBoltsBoltsPerPurlinJoint: CountField
  roofJointBoltsSpecification: TextField
  roofJointBoltsUnit: UnitField
  roofJointBoltsQuantity: DecimalField
  foundationBoltsSpecification: TextField
  foundationBoltsUnit: UnitField
  foundationBoltsQuantity: DecimalField
  anchorBoltsSpecification: TextField
  anchorBoltsUnit: UnitField
  anchorBoltsQuantity: DecimalField
}

/** Cladding quantity section returned by the backend. */
export interface QuantityCladding extends QuantitySectionMeta {
  claddingStructureUnit: UnitField
  claddingStructureQuantity: DecimalField
  claddingStructureAdditionalQuantity: DecimalField
  claddingStructureFrontEaveHeight: DecimalField
  claddingStructureBackEaveHeight: DecimalField
  claddingStructureRightEaveHeight: DecimalField
  claddingStructureLeftEaveHeight: DecimalField
  claddingStructureEaveHeightUnit: UnitField
  claddingStructureExtendedColumnHeight: DecimalField
  claddingStructureExtendedColumnHeightUnit: UnitField
  claddingStructureExtendedFrameWidth: DecimalField
  claddingStructureExtendedFrameWidthUnit: UnitField
  claddingStructureSideCladdingPurlins: CountField
  claddingStructureFaceCladdingPurlins: CountField
  claddingStructureTotalCladdingPurlinLength: DecimalField
  claddingStructureTotalCladdingPurlinLengthUnit: UnitField
  claddingStructureTotalCladdingPurlinWeight: DecimalField
  claddingStructureTotalCladdingPurlinWeightUnit: UnitField
  claddingStructureCladdingArea: DecimalField
  claddingStructureCladdingAreaUnit: UnitField
  claddingStructureAverageMaterialConsumption: DecimalField
  claddingStructureAverageMaterialConsumptionUnit: UnitField
  claddingStructureTotalOpenings: DecimalField
  claddingStructureTotalOpeningsUnit: UnitField
  claddingStructureFasciaOpening: DecimalField
  claddingStructureFasciaOpeningUnit: UnitField
  claddingSheetUnit: UnitField
  claddingSheetQuantity: DecimalField
  claddingSheetPurchaseQuantity: DecimalField
  columnWindBracingsUnit: UnitField
  columnWindBracingsQuantity: DecimalField
  claddingSagRodUnit: UnitField
  claddingSagRodQuantity: DecimalField
  claddingFlangeBraceUnit: UnitField
  claddingFlangeBraceQuantity: DecimalField
  claddingPurlinBoltsUnit: UnitField
  claddingPurlinBoltsQuantity: DecimalField
}

/** Canopy quantity section returned by the backend. */
export interface QuantityCanopy extends QuantitySectionMeta {
  structureUnit: UnitField
  structureQuantity: DecimalField
  structureCanopyArea: DecimalField
  structureCanopyAreaUnit: UnitField
  purlinUnit: UnitField
  purlinQuantity: DecimalField
  sheetUnit: UnitField
  sheetQuantity: DecimalField
  sheetPurchaseQuantity: DecimalField
  gutterUnit: UnitField
  gutterQuantity: DecimalField
  downTakeUnit: UnitField
  downTakeQuantity: DecimalField
  sideCoveringUnit: UnitField
  sideCoveringQuantity: DecimalField
  flashingUnit: UnitField
  flashingQuantity: DecimalField
  purlinBoltsUnit: UnitField
  purlinBoltsQuantity: DecimalField
  jointBoltsUnit: UnitField
  jointBoltsQuantity: DecimalField
}

/** Accessories quantity section returned by the backend. */
export interface QuantityAccessories extends QuantitySectionMeta {
  doorsCount: CountField
  doorsCountUnit: UnitField
  doorsArea: DecimalField
  doorsAreaUnit: UnitField
  windowsCount: CountField
  windowsCountUnit: UnitField
  windowsArea: DecimalField
  windowsAreaUnit: UnitField
  fasciaStructureUnit: UnitField
  fasciaStructureQuantity: DecimalField
  fasciaCoveringSheetUnit: UnitField
  fasciaCoveringSheetQuantity: DecimalField
  internalPartitionsUnit: UnitField
  internalPartitionsQuantity: DecimalField
  ridgeUnit: UnitField
  ridgeQuantity: DecimalField
  gutterUnit: UnitField
  gutterQuantity: DecimalField
  downTakeUnit: UnitField
  downTakeQuantity: DecimalField
  dripTrimUnit: UnitField
  dripTrimQuantity: DecimalField
  gableEndFlashingUnit: UnitField
  gableEndFlashingQuantity: DecimalField
  cornerFlashCount: CountField
  cornerFlashCountUnit: UnitField
  cornerFlashLength: DecimalField
  cornerFlashLengthUnit: UnitField
  rollingShutterCount: CountField
  rollingShutterCountUnit: UnitField
  rollingShutterArea: DecimalField
  rollingShutterAreaUnit: UnitField
  louversCount: CountField
  louversCountUnit: UnitField
  louversArea: DecimalField
  louversAreaUnit: UnitField
  skyLightCount: CountField
  skyLightCountUnit: UnitField
  skyLightArea: DecimalField
  skyLightAreaUnit: UnitField
  wallLightCount: CountField
  wallLightCountUnit: UnitField
  wallLightArea: DecimalField
  wallLightAreaUnit: UnitField
  roofInsulationType: TextField
  roofInsulationUnit: UnitField
  roofInsulationQuantity: DecimalField
  wallInsulationType: TextField
  wallInsulationUnit: UnitField
  wallInsulationQuantity: DecimalField
  turboVentilatorsUnit: UnitField
  turboVentilatorsQuantity: DecimalField
  handrailUnit: UnitField
  handrailQuantity: DecimalField
}

/** Mezzanine quantity section returned by the backend. */
export interface QuantityMezzanine extends QuantitySectionMeta {
  structureUnit: UnitField
  structureQuantity: DecimalField
  structureAdditionalQuantity: DecimalField
  structureTotalArea: DecimalField
  structureTotalAreaUnit: UnitField
  structureMaterialConsumption: DecimalField
  structureMaterialConsumptionUnit: UnitField
  deckSheetUnit: UnitField
  deckSheetQuantity: DecimalField
  deckSheetPurchaseQuantity: DecimalField
  deckSheetAdditionalQuantity: DecimalField
  shearStudsUnit: UnitField
  shearStudsQuantity: DecimalField
  concreteFlashingUnit: UnitField
  concreteFlashingQuantity: DecimalField
  jointBoltsSpecification: TextField
  jointBoltsQuantity: DecimalField
  foundationBoltsQuantity: DecimalField
}

/** Stair quantity section returned by the backend. */
export interface QuantityStair extends QuantitySectionMeta {
  totalAreaUnit: UnitField
  totalAreaQuantity: DecimalField
  stringerBeamsSection: TextField
  stringerBeamsUnit: UnitField
  stringerBeamsQuantity: DecimalField
  stringerBeamsAdditionalQuantity: DecimalField
  stepsSpecification: TextField
  stepsUnit: UnitField
  stepsQuantity: DecimalField
  stepsAdditionalQuantity: DecimalField
}

/** Additional-bolts quantity section returned by the backend. */
export interface QuantityAdditionalBolts extends QuantitySectionMeta {
  jointBolt24mmHsfgUnit: UnitField
  jointBolt24mmHsfgQuantity: DecimalField
  jointBolt20mmHsfgUnit: UnitField
  jointBolt20mmHsfgQuantity: DecimalField
  jointBolt16mmHsfgUnit: UnitField
  jointBolt16mmHsfgQuantity: DecimalField
  purlinBolt12mmOrdinaryUnit: UnitField
  purlinBolt12mmOrdinaryQuantity: DecimalField
  anchorBoltUnit: UnitField
  anchorBoltQuantity: DecimalField
  foundationBoltUnit: UnitField
  foundationBoltQuantity: DecimalField
}

/** Shape of a single Quantity returned by the backend with all optional sections included. */
export interface Quantity {
  id: string
  jobId: string
  createdAt: string
  updatedAt: string
  pebRoof: Nullable<QuantityPebRoof>
  cladding: Nullable<QuantityCladding>
  canopy: Nullable<QuantityCanopy>
  accessories: Nullable<QuantityAccessories>
  mezzanine: Nullable<QuantityMezzanine>
  stair: Nullable<QuantityStair>
  additionalBolts: Nullable<QuantityAdditionalBolts>
}

/** Paginated response shape from GET /api/quantities. */
export interface GetQuantitiesResponse {
  data: Quantity[]
  total: number
  page: number
  pageSize: number
}

/**
 * Fetches a paginated list of quantities from the backend via GET /api/quantities.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantities(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetQuantitiesResponse> {
  return await apiFetch(`/api/quantities?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated quantities list. Uses the shared
 * `quantityKeys` factory so mutations can invalidate it reliably.
 */
export function useQuantities(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getQuantities(token, page, pageSize)
    },
  })
}

/**
 * Fetches the quantity belonging to a specific job via GET /api/jobs/:jobId/quantity.
 * Requires a Clerk session token for authentication.
 */
export async function getQuantityByJobId(token: string | null, jobId: string): Promise<Quantity> {
  return await apiFetch(`/api/jobs/${jobId}/quantity`, token)
}

/**
 * React Query hook for a single job's quantity. Disabled until a `jobId` is
 * available so it never fires with an empty path segment.
 */
export function useQuantity(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quantityKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getQuantityByJobId(token, jobId)
    },
  })
}
