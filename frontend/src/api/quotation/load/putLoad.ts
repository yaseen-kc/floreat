import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateLoadInput } from '@/schemas/load.schema'
import type { Load } from './getLoad'
import { loadKeys } from './queryKeys'

/** Payload for updating a load — partial of the canonical load create contract. */
export type UpdateLoadPayload = Partial<CreateLoadInput>

/** Variables accepted by the {@link useUpdateLoad} mutation. */
export interface UpdateLoadVariables {
  jobId: string
  payload: UpdateLoadPayload
}

/**
 * Partially updates the load for a job via PUT /api/jobs/:jobId/load.
 * The backend validates the partial payload and returns the full updated load.
 * Requires a Clerk session token for authentication.
 */
export async function updateLoad(
  token: string | null,
  jobId: string,
  payload: UpdateLoadPayload,
): Promise<Load> {
  return await apiFetch(`/api/jobs/${jobId}/load`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's load. On success it invalidates both
 * the single-load detail (keyed by `jobId`) and every paginated loads list, so
 * the `/loads` listing and the job's load view stay in sync.
 */
export function useUpdateLoad() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateLoadVariables) => {
      const token = await getToken()
      return updateLoad(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: loadKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: loadKeys.lists() })
    },
  })
}
