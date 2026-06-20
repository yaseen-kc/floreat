import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { stairKeys } from './queryKeys'

/**
 * Deletes the stair for a job via DELETE /api/jobs/:jobId/stair.
 * The backend responds with 200 and { message: string } (not 204 No Content).
 * Requires a Clerk session token for authentication.
 */
export async function deleteStair(token: string | null, jobId: string): Promise<{ message: string }> {
  return await apiFetch(`/api/jobs/${jobId}/stair`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's stair. The mutation variable is the
 * `jobId`. On success it invalidates both the single-stair detail (keyed by
 * `jobId`) and every paginated stairs list, so the `/stairs` listing and the
 * job's stair view stay in sync.
 */
export function useDeleteStair() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteStair(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: stairKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: stairKeys.lists() })
    },
  })
}
