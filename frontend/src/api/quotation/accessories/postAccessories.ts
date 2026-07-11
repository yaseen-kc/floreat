import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateAccessoriesInput } from '@/schemas/accessories.schema'
import type { Accessories } from './getAccessories'
import { accessoriesKeys } from './queryKeys'

/** Payload for creating/upserting accessories — the canonical accessories request contract. */
export type CreateAccessoriesPayload = CreateAccessoriesInput

/** Variables accepted by the {@link useUpsertAccessories} mutation. */
export interface UpsertAccessoriesVariables {
  jobId: string
  payload: CreateAccessoriesPayload
}

/**
 * Creates or updates the accessories for a job via POST /api/jobs/:jobId/accessories.
 * The backend treats this as an upsert and returns the full accessories (status 200).
 * Requires a Clerk session token for authentication.
 */
export async function upsertAccessories(
  token: string | null,
  jobId: string,
  payload: CreateAccessoriesPayload,
): Promise<Accessories> {
  return await apiFetch(`/api/jobs/${jobId}/accessories`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's accessories. On success it invalidates
 * both the single-accessories detail (keyed by `jobId`) and every paginated
 * accessories list, so the `/accessories` listing and the job's accessories
 * view stay in sync.
 */
export function useUpsertAccessories() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertAccessoriesVariables) => {
      const token = await getToken()
      return upsertAccessories(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: accessoriesKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: accessoriesKeys.lists() })
    },
  })
}
