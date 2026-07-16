import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateRateInput } from '@floreat/shared/schemas'
import { rateKeys } from './queryKeys'

/** Unit of measure for a rate item — mirrors the backend `RateUnit` enum. */
export type RateUnit = CreateRateInput['unit']

/**
 * A rate master item as returned by the backend.
 *
 * NOTE: Prisma `Decimal` columns serialize to JSON strings over HTTP, so every
 * raw pricing component is `string | null` here even though the create/update
 * payloads accept `number`. The four *derived* rates (`fabricationRate`,
 * `erectionRate`, `loadingRate`, `totalRate`) are computed server-side and
 * always come back as plain numbers.
 */
export interface Rate {
  id: string
  item: string
  unit: RateUnit
  material: string | null
  fabrication: string | null
  transportation: string | null
  installation: string | null
  loadingUnloading: string | null
  overheads: string | null
  others: string | null
  marginPercentage: string | null
  fabricationRate: number
  erectionRate: number
  loadingRate: number
  totalRate: number
  createdAt: string
  updatedAt: string
}

/** Paginated response returned by GET /api/rates. */
export interface GetRatesResponse {
  data: Rate[]
  total: number
  page: number
  pageSize: number
}

/**
 * Fetches a paginated list of rate master items.
 * Requires a Clerk session token for authentication.
 */
export async function getRates(
  token: string | null,
  page = 1,
  pageSize = 10,
): Promise<GetRatesResponse> {
  return await apiFetch(`/api/rates?page=${page}&pageSize=${pageSize}`, token)
}

/**
 * React Query hook for a paginated rates list.
 * Requires a Clerk session and keys the query by page and page size.
 */
export function useRates(page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: rateKeys.list(page, pageSize),
    queryFn: async () => {
      const token = await getToken()
      return getRates(token, page, pageSize)
    },
  })
}

/**
 * Fetches a single rate master item by id.
 * Requires a Clerk session token for authentication.
 */
export async function getRateById(token: string | null, id: string): Promise<Rate> {
  return await apiFetch(`/api/rates/${id}`, token)
}

/**
 * React Query hook for a single rate item. Disabled until an `id` is available
 * so it never fires with an empty path segment.
 */
export function useRate(id: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: rateKeys.detail(id),
    enabled: !!id,
    queryFn: async () => {
      const token = await getToken()
      return getRateById(token, id)
    },
  })
}
