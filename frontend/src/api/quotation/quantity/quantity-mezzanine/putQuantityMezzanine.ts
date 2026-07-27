import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { UpdateQuantityMezzanineInput } from '@floreat/shared/schemas'
import type { QuantityMezzanine } from './getQuantityMezzanine'
import { quantityMezzanineKeys } from './queryKeys'

export type UpdateQuantityMezzaninePayload = UpdateQuantityMezzanineInput

export interface UpdateQuantityMezzanineVariables {
  jobId: string
  payload: UpdateQuantityMezzaninePayload
}

/**
 * Partially updates the mezzanine section for a job via PUT /api/jobs/:jobId/quantity/mezzanine.
 * Requires a Clerk session token for authentication.
 */
export async function updateQuantityMezzanine(
  token: string | null,
  jobId: string,
  payload: UpdateQuantityMezzaninePayload,
): Promise<QuantityMezzanine> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/mezzanine`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's mezzanine section. On success invalidates
 * both the mezzanine detail and every paginated list.
 */
export function useUpdateQuantityMezzanine() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateQuantityMezzanineVariables) => {
      const token = await getToken()
      return updateQuantityMezzanine(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityMezzanineKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityMezzanineKeys.lists() })
    },
  })
}
