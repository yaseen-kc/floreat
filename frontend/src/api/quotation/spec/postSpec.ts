import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateSpecInput } from '@floreat/shared/schemas'
import type { Spec } from './getSpec'
import { specKeys } from './queryKeys'

/** Payload for creating/upserting a spec — the canonical spec request contract. */
export type CreateSpecPayload = CreateSpecInput

/** Variables accepted by the {@link useUpsertSpec} mutation. */
export interface UpsertSpecVariables {
  jobId: string
  payload: CreateSpecPayload
}

/**
 * Creates or updates the spec for a job via POST /api/jobs/:jobId/spec.
 * The backend treats this as an upsert and returns the full spec (status 200).
 * Requires a Clerk session token for authentication.
 */
export async function upsertSpec(
  token: string | null,
  jobId: string,
  payload: CreateSpecPayload,
): Promise<Spec> {
  return await apiFetch(`/api/jobs/${jobId}/spec`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's spec. On success it invalidates both
 * the single-spec detail (keyed by `jobId`) and every paginated specs list, so
 * the `/specs` listing and the job's spec view stay in sync.
 */
export function useUpsertSpec() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertSpecVariables) => {
      const token = await getToken()
      return upsertSpec(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: specKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: specKeys.lists() })
    },
  })
}
