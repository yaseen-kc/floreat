import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { UpdateQuantityInput } from '@floreat/shared/schemas'
import type { Quantity } from './getQuantity'
import { quantityKeys } from './queryKeys'

/** Payload for updating a quantity, using the canonical shared request contract. */
export type UpdateQuantityPayload = UpdateQuantityInput

/** Variables accepted by the {@link useUpdateQuantity} mutation. */
export interface UpdateQuantityVariables {
  jobId: string
  payload: UpdateQuantityPayload
}

/**
 * Partially updates the quantity for a job via PUT /api/jobs/:jobId/quantity.
 * The backend validates the partial payload and returns the full updated quantity.
 * Requires a Clerk session token for authentication.
 */
export async function updateQuantity(
  token: string | null,
  jobId: string,
  payload: UpdateQuantityPayload,
): Promise<Quantity> {
  return await apiFetch(`/api/jobs/${jobId}/quantity`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's quantity. On success it invalidates
 * both the single-quantity detail and every paginated quantities list.
 */
export function useUpdateQuantity() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateQuantityVariables) => {
      const token = await getToken()
      return updateQuantity(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityKeys.lists() })
    },
  })
}
