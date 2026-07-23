import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateQuantityStairInput } from '@floreat/shared/schemas'
import type { QuantityStair } from './getQuantityStair'
import { quantityStairKeys } from './queryKeys'

export type CreateQuantityStairPayload = CreateQuantityStairInput

export interface UpsertQuantityStairVariables {
  jobId: string
  payload: CreateQuantityStairPayload
}

/**
 * Creates or updates the stair section for a job via POST /api/jobs/:jobId/quantity/stair.
 * Requires a Clerk session token for authentication.
 */
export async function upsertQuantityStair(
  token: string | null,
  jobId: string,
  payload: CreateQuantityStairPayload,
): Promise<QuantityStair> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/stair`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's stair section. On success invalidates
 * both the stair detail and every paginated stair list.
 */
export function useUpsertQuantityStair() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertQuantityStairVariables) => {
      const token = await getToken()
      return upsertQuantityStair(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityStairKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityStairKeys.lists() })
    },
  })
}
