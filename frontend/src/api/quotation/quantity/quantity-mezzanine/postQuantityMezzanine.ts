import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateQuantityMezzanineInput } from '@floreat/shared/schemas'
import type { QuantityMezzanine } from './getQuantityMezzanine'
import { quantityMezzanineKeys } from './queryKeys'

export type CreateQuantityMezzaninePayload = CreateQuantityMezzanineInput

export interface UpsertQuantityMezzanineVariables {
  jobId: string
  payload: CreateQuantityMezzaninePayload
}

/**
 * Creates or updates the mezzanine section for a job via POST /api/jobs/:jobId/quantity/mezzanine.
 * Requires a Clerk session token for authentication.
 */
export async function upsertQuantityMezzanine(
  token: string | null,
  jobId: string,
  payload: CreateQuantityMezzaninePayload,
): Promise<QuantityMezzanine> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/mezzanine`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's mezzanine section. On success invalidates
 * both the mezzanine detail and every paginated mezzanine list.
 */
export function useUpsertQuantityMezzanine() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertQuantityMezzanineVariables) => {
      const token = await getToken()
      return upsertQuantityMezzanine(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityMezzanineKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityMezzanineKeys.lists() })
    },
  })
}
