import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { UpdateMezzanineInput } from '@/schemas/mezzanine.schema'
import type { Mezzanine } from './getMezz'
import { mezzanineKeys } from './queryKeys'

/** Payload for updating a mezzanine — partial of the canonical mezzanine create contract. */
export type UpdateMezzaninePayload = UpdateMezzanineInput

/** Variables accepted by the {@link useUpdateMezzanine} mutation. */
export interface UpdateMezzanineVariables {
  jobId: string
  payload: UpdateMezzaninePayload
}

/**
 * Partially updates the mezzanine for a job via PUT /api/jobs/:jobId/mezzanine.
 * The backend validates the partial payload and returns the full updated mezzanine.
 * Requires a Clerk session token for authentication.
 */
export async function updateMezzanine(
  token: string | null,
  jobId: string,
  payload: UpdateMezzaninePayload,
): Promise<Mezzanine> {
  return await apiFetch(`/api/jobs/${jobId}/mezzanine`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's mezzanine. On success it invalidates
 * both the single-mezzanine detail (keyed by `jobId`) and every paginated
 * mezzanines list, so the `/mezzanines` listing and the job's mezzanine view
 * stay in sync.
 */
export function useUpdateMezzanine() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateMezzanineVariables) => {
      const token = await getToken()
      return updateMezzanine(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: mezzanineKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: mezzanineKeys.lists() })
    },
  })
}
