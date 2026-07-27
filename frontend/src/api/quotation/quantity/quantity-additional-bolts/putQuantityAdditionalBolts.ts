import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { UpdateQuantityAdditionalBoltsInput } from '@floreat/shared/schemas'
import type { QuantityAdditionalBolts } from './getQuantityAdditionalBolts'
import { quantityAdditionalBoltsKeys } from './queryKeys'

export type UpdateQuantityAdditionalBoltsPayload = UpdateQuantityAdditionalBoltsInput

export interface UpdateQuantityAdditionalBoltsVariables {
  jobId: string
  payload: UpdateQuantityAdditionalBoltsPayload
}

/**
 * Partially updates the additionalBolts section for a job via PUT /api/jobs/:jobId/quantity/additional-bolts.
 * Requires a Clerk session token for authentication.
 */
export async function updateQuantityAdditionalBolts(
  token: string | null,
  jobId: string,
  payload: UpdateQuantityAdditionalBoltsPayload,
): Promise<QuantityAdditionalBolts> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/additional-bolts`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's additionalBolts section. On success invalidates
 * both the additionalBolts detail and every paginated list.
 */
export function useUpdateQuantityAdditionalBolts() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateQuantityAdditionalBoltsVariables) => {
      const token = await getToken()
      return updateQuantityAdditionalBolts(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityAdditionalBoltsKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityAdditionalBoltsKeys.lists() })
    },
  })
}
