import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateRoofInput } from '@/schemas/roof.schema'
import type { Roof } from './getRoof'
import { roofKeys } from './queryKeys'

/** Payload for creating/upserting a roof — the canonical roof request contract. */
export type CreateRoofPayload = CreateRoofInput

/** Variables accepted by the {@link useUpsertRoof} mutation. */
export interface UpsertRoofVariables {
  jobId: string
  payload: CreateRoofPayload
}

/**
 * Creates or updates the roof for a job via POST /api/jobs/:jobId/roof.
 * The backend treats this as an upsert and returns the full roof (status 200).
 * Requires a Clerk session token for authentication.
 */
export async function upsertRoof(
  token: string | null,
  jobId: string,
  payload: CreateRoofPayload,
): Promise<Roof> {
  return await apiFetch(`/api/jobs/${jobId}/roof`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's roof. On success it invalidates both
 * the single-roof detail (keyed by `jobId`) and every paginated roofs list, so
 * the `/roofs` listing and the job's roof view stay in sync.
 */
export function useUpsertRoof() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertRoofVariables) => {
      const token = await getToken()
      return upsertRoof(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: roofKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: roofKeys.lists() })
    },
  })
}
