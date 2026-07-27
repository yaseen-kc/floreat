import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { quantityStairKeys } from './queryKeys'

/**
 * Deletes the stair section for a job via DELETE /api/jobs/:jobId/quantity/stair.
 * The backend responds with 204 No Content. Requires a Clerk session token.
 */
export async function deleteQuantityStair(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/quantity/stair`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's stair section. On success invalidates
 * both the stair detail and every paginated list.
 */
export function useDeleteQuantityStair() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteQuantityStair(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: quantityStairKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityStairKeys.lists() })
    },
  })
}
