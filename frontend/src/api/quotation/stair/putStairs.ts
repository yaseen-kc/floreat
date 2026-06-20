import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { UpdateStairInput } from '@/schemas/stair.schema'
import type { Stair } from './getStairs'
import { stairKeys } from './queryKeys'

/** Payload for updating a stair — partial of the canonical stair create contract. */
export type UpdateStairPayload = UpdateStairInput

/** Variables accepted by the {@link useUpdateStair} mutation. */
export interface UpdateStairVariables {
  jobId: string
  payload: UpdateStairPayload
}

/**
 * Partially updates the stair for a job via PUT /api/jobs/:jobId/stair.
 * The backend validates the partial payload and returns the full updated stair.
 * Requires a Clerk session token for authentication.
 */
export async function updateStair(token: string | null, jobId: string, payload: UpdateStairPayload): Promise<Stair> {
  return await apiFetch(`/api/jobs/${jobId}/stair`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's stair. On success it invalidates both
 * the single-stair detail (keyed by `jobId`) and every paginated stairs list,
 * so the `/stairs` listing and the job's stair view stay in sync.
 */
export function useUpdateStair() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateStairVariables) => {
      const token = await getToken()
      return updateStair(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: stairKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: stairKeys.lists() })
    },
  })
}
