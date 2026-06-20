import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateCanopyInput } from '@/schemas/canopy.schema'
import type { Canopy } from './getCanopy'
import { canopyKeys } from './queryKeys'

/** Payload for updating a canopy — partial of the canonical canopy create contract. */
export type UpdateCanopyPayload = Partial<CreateCanopyInput>

/** Variables accepted by the {@link useUpdateCanopy} mutation. */
export interface UpdateCanopyVariables {
  jobId: string
  payload: UpdateCanopyPayload
}

/**
 * Partially updates the canopy for a job via PUT /api/jobs/:jobId/canopy.
 * The backend validates the partial payload and returns the full updated canopy.
 * Requires a Clerk session token for authentication.
 */
export async function updateCanopy(
  token: string | null,
  jobId: string,
  payload: UpdateCanopyPayload,
): Promise<Canopy> {
  return await apiFetch(`/api/jobs/${jobId}/canopy`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's canopy. On success it invalidates both
 * the single-canopy detail (keyed by `jobId`) and every paginated canopies
 * list, so the `/canopies` listing and the job's canopy view stay in sync.
 */
export function useUpdateCanopy() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateCanopyVariables) => {
      const token = await getToken()
      return updateCanopy(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: canopyKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: canopyKeys.lists() })
    },
  })
}
