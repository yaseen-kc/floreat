import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { UpdateQuantityCanopyInput } from '@floreat/shared/schemas'
import type { QuantityCanopy } from './getQuantityCanopy'
import { quantityCanopyKeys } from './queryKeys'

export type UpdateQuantityCanopyPayload = UpdateQuantityCanopyInput

export interface UpdateQuantityCanopyVariables {
  jobId: string
  payload: UpdateQuantityCanopyPayload
}

/**
 * Partially updates the canopy section for a job via PUT /api/jobs/:jobId/quantity/canopy.
 * Requires a Clerk session token for authentication.
 */
export async function updateQuantityCanopy(
  token: string | null,
  jobId: string,
  payload: UpdateQuantityCanopyPayload,
): Promise<QuantityCanopy> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/canopy`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's canopy section. On success invalidates
 * both the canopy detail and every paginated canopy list.
 */
export function useUpdateQuantityCanopy() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateQuantityCanopyVariables) => {
      const token = await getToken()
      return updateQuantityCanopy(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityCanopyKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityCanopyKeys.lists() })
    },
  })
}
