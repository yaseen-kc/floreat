import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { quantityAccessoriesKeys } from './queryKeys'

/**
 * Deletes the accessories section for a job via DELETE /api/jobs/:jobId/quantity/accessories.
 * The backend responds with 204 No Content. Requires a Clerk session token.
 */
export async function deleteQuantityAccessories(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/quantity/accessories`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's accessories section. On success invalidates
 * both the accessories detail and every paginated list.
 */
export function useDeleteQuantityAccessories() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteQuantityAccessories(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: quantityAccessoriesKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityAccessoriesKeys.lists() })
    },
  })
}
