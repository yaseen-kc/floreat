import { apiFetch } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { amountKeys } from './queryKeys'

/* ──────────────────────────────────────────────────────────────────────────
 * Enum unions — mirror the backend Prisma enums (string literals over the wire).
 * ────────────────────────────────────────────────────────────────────────── */

/** Unit of measure for an amount line item. */
export type AmountUnit = 'KG' | 'RM' | 'SQM' | 'NOS'

/* ──────────────────────────────────────────────────────────────────────────
 * Response shapes.
 *
 * NOTE: Prisma `Decimal` columns serialize to JSON strings over HTTP
 * (`Decimal.prototype.toJSON`), so numeric-precision fields are typed as
 * `string | null` here even though the create/update payloads accept `number`.
 * ────────────────────────────────────────────────────────────────────────── */

/** A single line item in the bill-of-quantities cost summary. */
export interface AmountItem {
  id: string
  amountId: string
  description: string | null
  unit: AmountUnit | null
  quantity: string | null
  rateFabrication: string | null
  rateErection: string | null
  rateLoading: string | null
  amountFabrication: string | null
  amountErection: string | null
  amountLoading: string | null
}

/** Shape of a single Amount returned by the backend (with inline items array). */
export interface Amount {
  id: string
  jobId: string
  createdAt: string
  updatedAt: string
  items: AmountItem[]
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
