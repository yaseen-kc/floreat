import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { UpdateQuantityCladdingInput } from '@floreat/shared/schemas'
import type { QuantityCladding } from './getQuantityCladding'
import { quantityCladdingKeys } from './queryKeys'

export type UpdateQuantityCladdingPayload = UpdateQuantityCladdingInput

export interface UpdateQuantityCladdingVariables {
  jobId: string
  payload: UpdateQuantityCladdingPayload
}

/**
 * Partially updates the cladding section for a job via PUT /api/jobs/:jobId/quantity/cladding.
 * Requires a Clerk session token for authentication.
 */
export async function updateQuantityCladding(
  token: string | null,
  jobId: string,
  payload: UpdateQuantityCladdingPayload,
): Promise<QuantityCladding> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/cladding`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's cladding section. On success invalidates
 * both the cladding detail and every paginated cladding list.
 */
export function useUpdateQuantityCladding() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateQuantityCladdingVariables) => {
      const token = await getToken()
      return updateQuantityCladding(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityCladdingKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityCladdingKeys.lists() })
    },
  })
}
