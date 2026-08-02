import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { UpdateAmountInput } from '@floreat/shared/schemas'
import type { Amount } from './getAmount'
import { amountKeys } from './queryKeys'

/** Payload for updating an amount — partial of the canonical amount create contract. */
export type UpdateAmountPayload = UpdateAmountInput

/** Variables accepted by the {@link useUpdateAmount} mutation. */
export interface UpdateAmountVariables {
  jobId: string
  payload: UpdateAmountPayload
}

/**
 * Partially updates the amount for a job via PUT /api/jobs/:jobId/amount.
 * The backend validates the partial payload and returns the full updated amount.
 * Requires a Clerk session token for authentication.
 */
export async function updateAmount(
  token: string | null,
  jobId: string,
  payload: UpdateAmountPayload,
): Promise<Amount> {
  return await apiFetch(`/api/jobs/${jobId}/amount`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's amount. On success it invalidates
 * both the single-amount detail (keyed by `jobId`) and every paginated
 * amounts list, so the `/amounts` listing and the job's amount view stay in sync.
 */
export function useUpdateAmount() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateAmountVariables) => {
      const token = await getToken()
      return updateAmount(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: amountKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: amountKeys.lists() })
    },
  })
}
