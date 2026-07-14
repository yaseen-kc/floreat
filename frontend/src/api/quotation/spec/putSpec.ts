import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { UpdateSpecInput } from '@floreat/shared/schemas'
import type { Spec } from './getSpec'
import { specKeys } from './queryKeys'

/** Partial payload accepted when updating a job's spec. */
export type UpdateSpecPayload = UpdateSpecInput

/** Variables accepted by the {@link useUpdateSpec} mutation. */
export interface UpdateSpecVariables {
  jobId: string
  payload: UpdateSpecPayload
}

/**
 * Partially updates the spec for a job via PUT /api/jobs/:jobId/spec.
 * Requires a Clerk session token for authentication.
 */
export async function updateSpec(
  token: string | null,
  jobId: string,
  payload: UpdateSpecPayload,
): Promise<Spec> {
  return await apiFetch(`/api/jobs/${jobId}/spec`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's spec. On success it invalidates both
 * the single-spec detail (keyed by `jobId`) and every paginated specs list.
 */
export function useUpdateSpec() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateSpecVariables) => {
      const token = await getToken()
      return updateSpec(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: specKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: specKeys.lists() })
    },
  })
}
