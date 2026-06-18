import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateMezzanineInput } from '@/schemas/mezzanine.schema'
import type { Mezzanine } from './getMezz'
import { mezzanineKeys } from './queryKeys'

/** Payload for creating/upserting a mezzanine — the canonical mezzanine request contract. */
export type CreateMezzaninePayload = CreateMezzanineInput

/** Variables accepted by the {@link useUpsertMezzanine} mutation. */
export interface UpsertMezzanineVariables {
  jobId: string
  payload: CreateMezzaninePayload
}

/**
 * Creates or updates the mezzanine for a job via POST /api/jobs/:jobId/mezzanine.
 * The backend treats this as an upsert and returns the full mezzanine (status 200).
 * Requires a Clerk session token for authentication.
 */
export async function upsertMezzanine(
  token: string | null,
  jobId: string,
  payload: CreateMezzaninePayload,
): Promise<Mezzanine> {
  return await apiFetch(`/api/jobs/${jobId}/mezzanine`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's mezzanine. On success it invalidates
 * both the single-mezzanine detail (keyed by `jobId`) and every paginated
 * mezzanines list, so the `/mezzanines` listing and the job's mezzanine view
 * stay in sync.
 */
export function useUpsertMezzanine() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertMezzanineVariables) => {
      const token = await getToken()
      return upsertMezzanine(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: mezzanineKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: mezzanineKeys.lists() })
    },
  })
}
