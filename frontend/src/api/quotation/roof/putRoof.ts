import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateRoofInput } from '@/schemas/roof.schema'
import type { Roof } from './getRoof'
import { roofKeys } from './queryKeys'

/** Payload for updating a roof — partial of the canonical roof create contract. */
export type UpdateRoofPayload = Partial<CreateRoofInput>

/** Variables accepted by the {@link useUpdateRoof} mutation. */
export interface UpdateRoofVariables {
  jobId: string
  payload: UpdateRoofPayload
}

/**
 * Partially updates the roof for a job via PUT /api/jobs/:jobId/roof.
 * The backend validates the partial payload and returns the full updated roof.
 * Requires a Clerk session token for authentication.
 */
export async function updateRoof(
  token: string | null,
  jobId: string,
  payload: UpdateRoofPayload,
): Promise<Roof> {
  return await apiFetch(`/api/jobs/${jobId}/roof`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's roof. On success it invalidates both
 * the single-roof detail (keyed by `jobId`) and every paginated roofs list, so
 * the `/roofs` listing and the job's roof view stay in sync.
 */
export function useUpdateRoof() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateRoofVariables) => {
      const token = await getToken()
      return updateRoof(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: roofKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: roofKeys.lists() })
    },
  })
}
