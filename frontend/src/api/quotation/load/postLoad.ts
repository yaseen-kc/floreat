import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateLoadInput } from '@/schemas/load.schema'
import type { Load } from './getLoad'
import { loadKeys } from './queryKeys'

/** Payload for creating/upserting a load — the canonical load request contract. */
export type CreateLoadPayload = CreateLoadInput

/** Variables accepted by the {@link useUpsertLoad} mutation. */
export interface UpsertLoadVariables {
  jobId: string
  payload: CreateLoadPayload
}

/**
 * Creates or updates the load for a job via POST /api/jobs/:jobId/load.
 * The backend treats this as an upsert and returns the full load (status 200).
 * Requires a Clerk session token for authentication.
 */
export async function upsertLoad(
  token: string | null,
  jobId: string,
  payload: CreateLoadPayload,
): Promise<Load> {
  return await apiFetch(`/api/jobs/${jobId}/load`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's load. On success it invalidates both
 * the single-load detail (keyed by `jobId`) and every paginated loads list, so
 * the `/loads` listing and the job's load view stay in sync.
 */
export function useUpsertLoad() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertLoadVariables) => {
      const token = await getToken()
      return upsertLoad(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: loadKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: loadKeys.lists() })
    },
  })
}
