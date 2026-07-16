import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { UpdateRateInput } from '@floreat/shared/schemas'
import type { Rate } from './getRate'
import { rateKeys } from './queryKeys'

/** Partial payload accepted when updating a rate master item. */
export type UpdateRatePayload = UpdateRateInput

/** Variables accepted by the {@link useUpdateRate} mutation. */
export interface UpdateRateVariables {
  id: string
  payload: UpdateRatePayload
}

/**
 * Partially updates a rate master item via PUT /api/rates/:id.
 * Requires a Clerk session token for authentication.
 */
export async function updateRate(
  token: string | null,
  id: string,
  payload: UpdateRatePayload,
): Promise<Rate> {
  return await apiFetch(`/api/rates/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a rate item. On success it invalidates both the
 * single-rate detail (keyed by `id`) and every paginated rates list.
 */
export function useUpdateRate() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: UpdateRateVariables) => {
      const token = await getToken()
      return updateRate(token, id, payload)
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: rateKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: rateKeys.lists() })
    },
  })
}
