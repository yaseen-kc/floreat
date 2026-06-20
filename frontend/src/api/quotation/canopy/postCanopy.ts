import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateCanopyInput } from '@/schemas/canopy.schema'
import type { Canopy } from './getCanopy'
import { canopyKeys } from './queryKeys'

/** Payload for creating/upserting a canopy — the canonical canopy request contract. */
export type CreateCanopyPayload = CreateCanopyInput

/** Variables accepted by the {@link useUpsertCanopy} mutation. */
export interface UpsertCanopyVariables {
  jobId: string
  payload: CreateCanopyPayload
}

/**
 * Creates or updates the canopy for a job via POST /api/jobs/:jobId/canopy.
 * The backend treats this as an upsert and returns the full canopy (status 200).
 * Requires a Clerk session token for authentication.
 */
export async function upsertCanopy(
  token: string | null,
  jobId: string,
  payload: CreateCanopyPayload,
): Promise<Canopy> {
  return await apiFetch(`/api/jobs/${jobId}/canopy`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's canopy. On success it invalidates both
 * the single-canopy detail (keyed by `jobId`) and every paginated canopies
 * list, so the `/canopies` listing and the job's canopy view stay in sync.
 */
export function useUpsertCanopy() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertCanopyVariables) => {
      const token = await getToken()
      return upsertCanopy(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: canopyKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: canopyKeys.lists() })
    },
  })
}
