import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { UpdateQuantityStairInput } from '@floreat/shared/schemas'
import type { QuantityStair } from './getQuantityStair'
import { quantityStairKeys } from './queryKeys'

export type UpdateQuantityStairPayload = UpdateQuantityStairInput

export interface UpdateQuantityStairVariables {
  jobId: string
  payload: UpdateQuantityStairPayload
}

/**
 * Partially updates the stair section for a job via PUT /api/jobs/:jobId/quantity/stair.
 * Requires a Clerk session token for authentication.
 */
export async function updateQuantityStair(
  token: string | null,
  jobId: string,
  payload: UpdateQuantityStairPayload,
): Promise<QuantityStair> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/stair`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's stair section. On success invalidates
 * both the stair detail and every paginated list.
 */
export function useUpdateQuantityStair() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateQuantityStairVariables) => {
      const token = await getToken()
      return updateQuantityStair(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityStairKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityStairKeys.lists() })
    },
  })
}
