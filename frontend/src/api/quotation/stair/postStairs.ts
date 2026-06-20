import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateStairInput } from '@/schemas/stair.schema'
import type { Stair } from './getStairs'
import { stairKeys } from './queryKeys'

/** Payload for creating/upserting a stair — the canonical stair request contract. */
export type CreateStairPayload = CreateStairInput

/** Variables accepted by the {@link useUpsertStair} mutation. */
export interface UpsertStairVariables {
  jobId: string
  payload: CreateStairPayload
}

/**
 * Creates or updates the stair for a job via POST /api/jobs/:jobId/stair.
 * The backend treats this as an upsert and returns the full stair (status 200).
 * Requires a Clerk session token for authentication.
 */
export async function upsertStair(token: string | null, jobId: string, payload: CreateStairPayload): Promise<Stair> {
  return await apiFetch(`/api/jobs/${jobId}/stair`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's stair. On success it invalidates both
 * the single-stair detail (keyed by `jobId`) and every paginated stairs list,
 * so the `/stairs` listing and the job's stair view stay in sync.
 */
export function useUpsertStair() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertStairVariables) => {
      const token = await getToken()
      return upsertStair(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: stairKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: stairKeys.lists() })
    },
  })
}
