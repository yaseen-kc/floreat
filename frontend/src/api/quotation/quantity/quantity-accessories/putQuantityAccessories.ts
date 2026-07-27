import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { UpdateQuantityAccessoriesInput } from '@floreat/shared/schemas'
import type { QuantityAccessories } from './getQuantityAccessories'
import { quantityAccessoriesKeys } from './queryKeys'

export type UpdateQuantityAccessoriesPayload = UpdateQuantityAccessoriesInput

export interface UpdateQuantityAccessoriesVariables {
  jobId: string
  payload: UpdateQuantityAccessoriesPayload
}

/**
 * Partially updates the accessories section for a job via PUT /api/jobs/:jobId/quantity/accessories.
 * Requires a Clerk session token for authentication.
 */
export async function updateQuantityAccessories(
  token: string | null,
  jobId: string,
  payload: UpdateQuantityAccessoriesPayload,
): Promise<QuantityAccessories> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/accessories`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's accessories section. On success invalidates
 * both the accessories detail and every paginated list.
 */
export function useUpdateQuantityAccessories() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateQuantityAccessoriesVariables) => {
      const token = await getToken()
      return updateQuantityAccessories(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityAccessoriesKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityAccessoriesKeys.lists() })
    },
  })
}
