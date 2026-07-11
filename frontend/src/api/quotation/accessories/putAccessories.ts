import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateAccessoriesInput } from '@/schemas/accessories.schema'
import type { Accessories } from './getAccessories'
import { accessoriesKeys } from './queryKeys'

/** Payload for updating accessories — partial of the canonical accessories create contract. */
export type UpdateAccessoriesPayload = Partial<CreateAccessoriesInput>

/** Variables accepted by the {@link useUpdateAccessories} mutation. */
export interface UpdateAccessoriesVariables {
  jobId: string
  payload: UpdateAccessoriesPayload
}

/**
 * Partially updates the accessories for a job via PUT /api/jobs/:jobId/accessories.
 * The backend validates the partial payload and returns the full updated accessories.
 * Requires a Clerk session token for authentication.
 */
export async function updateAccessories(
  token: string | null,
  jobId: string,
  payload: UpdateAccessoriesPayload,
): Promise<Accessories> {
  return await apiFetch(`/api/jobs/${jobId}/accessories`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's accessories. On success it invalidates
 * both the single-accessories detail (keyed by `jobId`) and every paginated
 * accessories list, so the `/accessories` listing and the job's accessories
 * view stay in sync.
 */
export function useUpdateAccessories() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateAccessoriesVariables) => {
      const token = await getToken()
      return updateAccessories(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: accessoriesKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: accessoriesKeys.lists() })
    },
  })
}
