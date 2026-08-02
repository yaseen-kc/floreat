import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { quotationKeys } from './queryKeys'

/**
 * Deletes the quotation for a job via DELETE /api/jobs/:jobId/quotation.
 * The backend responds with 204 No Content, so this resolves to `void`.
 * Requires a Clerk session token for authentication.
 */
export async function deleteQuotation(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/quotation`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's quotation. The mutation variable is the
 * `jobId`. On success it invalidates both the single-quotation detail (keyed by
 * `jobId`) and every paginated quotations list.
 */
export function useDeleteQuotation() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteQuotation(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists() })
    },
  })
}
