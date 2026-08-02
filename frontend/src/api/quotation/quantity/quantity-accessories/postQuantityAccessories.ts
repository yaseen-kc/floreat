import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateQuantityAccessoriesInput } from '@floreat/shared/schemas'
import type { QuantityAccessories } from './getQuantityAccessories'
import { quantityAccessoriesKeys } from './queryKeys'

export type CreateQuantityAccessoriesPayload = CreateQuantityAccessoriesInput

export interface UpsertQuantityAccessoriesVariables {
  jobId: string
  payload: CreateQuantityAccessoriesPayload
}

/**
 * Creates or updates the accessories section for a job via POST /api/jobs/:jobId/quantity/accessories.
 * Requires a Clerk session token for authentication.
 */
export async function upsertQuantityAccessories(
  token: string | null,
  jobId: string,
  payload: CreateQuantityAccessoriesPayload,
): Promise<QuantityAccessories> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/accessories`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's accessories section. On success invalidates
 * both the accessories detail and every paginated accessories list.
 */
export function useUpsertQuantityAccessories() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertQuantityAccessoriesVariables) => {
      const token = await getToken()
      return upsertQuantityAccessories(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityAccessoriesKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityAccessoriesKeys.lists() })
    },
  })
}
