import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateQuantityCanopyInput } from '@floreat/shared/schemas'
import type { QuantityCanopy } from './getQuantityCanopy'
import { quantityCanopyKeys } from './queryKeys'

export type CreateQuantityCanopyPayload = CreateQuantityCanopyInput

export interface UpsertQuantityCanopyVariables {
  jobId: string
  payload: CreateQuantityCanopyPayload
}

/**
 * Creates or updates the canopy section for a job via POST /api/jobs/:jobId/quantity/canopy.
 * Requires a Clerk session token for authentication.
 */
export async function upsertQuantityCanopy(
  token: string | null,
  jobId: string,
  payload: CreateQuantityCanopyPayload,
): Promise<QuantityCanopy> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/canopy`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's canopy section. On success invalidates
 * both the canopy detail and every paginated canopy list.
 */
export function useUpsertQuantityCanopy() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertQuantityCanopyVariables) => {
      const token = await getToken()
      return upsertQuantityCanopy(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityCanopyKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityCanopyKeys.lists() })
    },
  })
}
