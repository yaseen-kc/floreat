import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateQuantityAdditionalBoltsInput } from '@floreat/shared/schemas'
import type { QuantityAdditionalBolts } from './getQuantityAdditionalBolts'
import { quantityAdditionalBoltsKeys } from './queryKeys'

export type CreateQuantityAdditionalBoltsPayload = CreateQuantityAdditionalBoltsInput

export interface UpsertQuantityAdditionalBoltsVariables {
  jobId: string
  payload: CreateQuantityAdditionalBoltsPayload
}

/**
 * Creates or updates the additionalBolts section for a job via POST /api/jobs/:jobId/quantity/additional-bolts.
 * Requires a Clerk session token for authentication.
 */
export async function upsertQuantityAdditionalBolts(
  token: string | null,
  jobId: string,
  payload: CreateQuantityAdditionalBoltsPayload,
): Promise<QuantityAdditionalBolts> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/additional-bolts`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's additionalBolts section. On success invalidates
 * both the additionalBolts detail and every paginated list.
 */
export function useUpsertQuantityAdditionalBolts() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertQuantityAdditionalBoltsVariables) => {
      const token = await getToken()
      return upsertQuantityAdditionalBolts(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityAdditionalBoltsKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityAdditionalBoltsKeys.lists() })
    },
  })
}
