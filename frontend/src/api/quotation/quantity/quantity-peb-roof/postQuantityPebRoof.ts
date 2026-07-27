import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateQuantityPebRoofInput } from '@floreat/shared/schemas'
import type { QuantityPebRoof } from './getQuantityPebRoof'
import { quantityPebRoofKeys } from './queryKeys'

export type CreateQuantityPebRoofPayload = CreateQuantityPebRoofInput

export interface UpsertQuantityPebRoofVariables {
  jobId: string
  payload: CreateQuantityPebRoofPayload
}

/**
 * Creates or updates the pebRoof section for a job via POST /api/jobs/:jobId/quantity/peb-roof.
 * Requires a Clerk session token for authentication.
 */
export async function upsertQuantityPebRoof(
  token: string | null,
  jobId: string,
  payload: CreateQuantityPebRoofPayload,
): Promise<QuantityPebRoof> {
  return await apiFetch(`/api/jobs/${jobId}/quantity/peb-roof`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's pebRoof section. On success invalidates
 * both the pebRoof detail and every paginated pebRoof list.
 */
export function useUpsertQuantityPebRoof() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertQuantityPebRoofVariables) => {
      const token = await getToken()
      return upsertQuantityPebRoof(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quantityPebRoofKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityPebRoofKeys.lists() })
    },
  })
}
