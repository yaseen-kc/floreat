import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { amountKeys } from './queryKeys'

/**
 * Deletes the amount for a job via DELETE /api/jobs/:jobId/amount.
 * The backend responds with 204 No Content, so this resolves to `void`.
 * Requires a Clerk session token for authentication.
 */
export async function deleteAmount(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/amount`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's amount. The mutation variable is
 * the `jobId`. On success it invalidates both the single-amount detail
 * (keyed by `jobId`) and every paginated amounts list, so the
 * `/amounts` listing and the job's amount view stay in sync.
 */
export function useDeleteAmount() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteAmount(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: amountKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: amountKeys.lists() })
    },
  })
}
