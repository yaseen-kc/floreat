import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateQuantityCladdingInput } from '@floreat/shared/schemas'
import type { QuantityCladding } from './getQuantityCladding'
import { quantityCladdingKeys } from './queryKeys'

export type CreateQuantityCladdingPayload = CreateQuantityCladdingInput

export interface UpsertQuantityCladdingVariables {
  jobId: string
  payload: CreateQuantityCladdingPayload
}

/**
 * Creates or updates the cladding section for a job via POST /api/jobs/:jobId/quantity/cladding.
 * Requires a Clerk session token for authentication.
 */
export async function upsertQuantityCladding(
  token: string | null,
  jobId: string,
  payload: CreateQuantityCladdingPayload,
): Promise<QuantityCladding> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/cladding`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's cladding section. On success invalidates
 * both the cladding detail and every paginated cladding list.
 */
export function useUpsertQuantityCladding() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertQuantityCladdingVariables) => {
      const token = await getToken()
      return upsertQuantityCladding(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityCladdingKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityCladdingKeys.lists() })
    },
  })
}
