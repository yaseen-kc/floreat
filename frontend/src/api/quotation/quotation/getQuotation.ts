import { apiFetch } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { quotationKeys } from './queryKeys'

/* ──────────────────────────────────────────────────────────────────────────
 * Response shapes.
 *
 * NOTE: Int columns remain `number` (not string like Decimal).
 * Quotation is a flat 1:1-per-job resource with no child arrays.
 * ────────────────────────────────────────────────────────────────────────── */

/** Shape of a single Quotation returned by the backend. */
export interface Quotation {
  id: string
  jobId: string
  fabricationAmount: number | null
  installationAmount: number | null
  grandTotal: number | null
  qtyRoofStructure: number | null
  qtyRoofPurlins: number | null
  qtyMezzanineStructure: number | null
  qtyCladdingStructure: number | null
  qtyBracings: number | null
  qtyCanopyStructure: number | null
  qtyCanopyPurlins: number | null
  qtyStair: number | null
  qtyPlinthArea: number | null
  qtyRoofSheetArea: number | null
  qtyDeckingSheet: number | null
  qtyCladdingSheetArea: number | null
  qtyCanopySheetArea: number | null
  qtySheetAccessories: number | null
  qtyDoors: number | null
  qtyWindows: number | null
  qtyRollingShutter: number | null
  qtyLouvers: number | null
  qtyTurboVentilators: number | null
  qtySkyLights: number | null
  qtyWallLights: number | null
  qtyRoofInsulation: number | null
  qtyWallInsulation: number | null
  qtyPolycarbonateSheet: number | null
  qtyFasciaStructure: number | null
  createdAt: string
  updatedAt: string
}

/** Paginated response shape from GET /api/quotations. */
export interface GetQuotationsResponse {
  data: Quotation[]
  total: number
  page: number
  pageSize: number
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/quotations — paginated list.
 * ────────────────────────────────────────────────────────────────────────── */

export async function getQuotations(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetQuotationsResponse> {
  return await apiFetch(`/api/quotations?page=${page}&pageSize=${pageSize}`, token)
}

export function useQuotations(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quotationKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getQuotations(token, page, pageSize)
    },
  })
}

/* ──────────────────────────────────────────────────────────────────────────
 * GET /api/jobs/:jobId/quotation — single quotation for a job.
 * ────────────────────────────────────────────────────────────────────────── */

export async function getQuotationByJobId(token: string | null, jobId: string): Promise<Quotation> {
  return await apiFetch(`/api/jobs/${jobId}/quotation`, token)
}

export function useQuotation(jobId: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: quotationKeys.detail(jobId),
    enabled: !!jobId,
    queryFn: async () => {
      const token = await getToken()
      return getQuotationByJobId(token, jobId)
    },
  })
}
