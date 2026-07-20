import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateAmountInput } from '@floreat/shared/schemas'
import type { Amount } from './getAmount'
import { amountKeys } from './queryKeys'

/** Payload for creating/upserting an amount — the canonical amount request contract. */
export type CreateAmountPayload = CreateAmountInput

/** Variables accepted by the {@link useUpsertAmount} mutation. */
export interface UpsertAmountVariables {
  jobId: string
  payload: CreateAmountPayload
}

/**
 * Creates or updates the amount for a job via POST /api/jobs/:jobId/amount.
 * The backend treats this as an upsert and returns the full amount (status 200).
 * Requires a Clerk session token for authentication.
 */
export async function upsertAmount(
  token: string | null,
  jobId: string,
  payload: CreateAmountPayload,
): Promise<Amount> {
  return await apiFetch(`/api/jobs/${jobId}/amount`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's amount. On success it invalidates
 * both the single-amount detail (keyed by `jobId`) and every paginated
 * amounts list, so the `/amounts` listing and the job's amount view stay in sync.
 */
export function useUpsertAmount() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertAmountVariables) => {
      const token = await getToken()
      return upsertAmount(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: amountKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: amountKeys.lists() })
    },
  })
}
