import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateRateInput } from '@floreat/shared/schemas'
import type { Rate } from './getRate'
import { rateKeys } from './queryKeys'

/** Payload for creating a rate master item — the canonical create contract. */
export type CreateRatePayload = CreateRateInput

/**
 * Creates a new rate master item via POST /api/rates.
 * The backend responds with 201 and the created rate (with derived rates).
 * Requires a Clerk session token for authentication.
 */
export async function createRate(
  token: string | null,
  payload: CreateRatePayload,
): Promise<Rate> {
  return await apiFetch('/api/rates', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for creating a rate item. On success it invalidates every
 * paginated rates list so the `/rates` listing reflects the new row.
 */
export function useCreateRate() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateRatePayload) => {
      const token = await getToken()
      return createRate(token, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rateKeys.lists() })
    },
  })
}
