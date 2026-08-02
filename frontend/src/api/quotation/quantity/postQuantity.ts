import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateQuantityInput } from '@floreat/shared/schemas'
import type { Quantity } from './getQuantity'
import { quantityKeys } from './queryKeys'

/** Payload for creating/upserting a quantity, using the canonical shared request contract. */
export type CreateQuantityPayload = CreateQuantityInput

/** Variables accepted by the {@link useUpsertQuantity} mutation. */
export interface UpsertQuantityVariables {
  jobId: string
  payload: CreateQuantityPayload
}

/**
 * Creates or updates the quantity for a job via POST /api/jobs/:jobId/quantity.
 * The backend treats this as an upsert and returns the full quantity (status 200).
 * Requires a Clerk session token for authentication.
 */
export async function upsertQuantity(
  token: string | null,
  jobId: string,
  payload: CreateQuantityPayload,
): Promise<Quantity> {
  return await apiFetch(`/api/jobs/${jobId}/quantity`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's quantity. On success it invalidates
 * both the single-quantity detail and every paginated quantities list.
 */
export function useUpsertQuantity() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertQuantityVariables) => {
      const token = await getToken()
      return upsertQuantity(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityKeys.lists() })
    },
  })
}
