import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { quantityKeys } from './queryKeys'

/**
 * Deletes the quantity for a job via DELETE /api/jobs/:jobId/quantity.
 * The backend responds with 204 No Content, so this resolves to `void`.
 * Requires a Clerk session token for authentication.
 */
export async function deleteQuantity(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/quantity`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's quantity. The mutation variable is the
 * `jobId`. On success it invalidates both the single-quantity detail and every
 * paginated quantities list.
 */
export function useDeleteQuantity() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteQuantity(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: quantityKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityKeys.lists() })
    },
  })
}
