import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { UpdateQuantityPebRoofInput } from '@floreat/shared/schemas'
import type { QuantityPebRoof } from './getQuantityPebRoof'
import { quantityPebRoofKeys } from './queryKeys'

export type UpdateQuantityPebRoofPayload = UpdateQuantityPebRoofInput

export interface UpdateQuantityPebRoofVariables {
  jobId: string
  payload: UpdateQuantityPebRoofPayload
}

/**
 * Partially updates the pebRoof section for a job via PUT /api/jobs/:jobId/quantity/peb-roof.
 * Requires a Clerk session token for authentication.
 */
export async function updateQuantityPebRoof(
  token: string | null,
  jobId: string,
  payload: UpdateQuantityPebRoofPayload,
): Promise<QuantityPebRoof> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/peb-roof`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's pebRoof section. On success invalidates
 * both the pebRoof detail and every paginated pebRoof list.
 */
export function useUpdateQuantityPebRoof() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateQuantityPebRoofVariables) => {
      const token = await getToken()
      return updateQuantityPebRoof(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityPebRoofKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityPebRoofKeys.lists() })
    },
  })
}
