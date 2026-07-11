import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { accessoriesKeys } from './queryKeys'

/**
 * Deletes the accessories for a job via DELETE /api/jobs/:jobId/accessories.
 * The backend responds with 204 No Content, so this resolves to `void`.
 * Requires a Clerk session token for authentication.
 */
export async function deleteAccessories(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/accessories`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's accessories. The mutation variable is
 * the `jobId`. On success it invalidates both the single-accessories detail
 * (keyed by `jobId`) and every paginated accessories list, so the
 * `/accessories` listing and the job's accessories view stay in sync.
 */
export function useDeleteAccessories() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteAccessories(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: accessoriesKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: accessoriesKeys.lists() })
    },
  })
}
