import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { canopyKeys } from './queryKeys'

/**
 * Deletes the canopy for a job via DELETE /api/jobs/:jobId/canopy.
 * The backend responds with 204 No Content, so this resolves to `void`.
 * Requires a Clerk session token for authentication.
 */
export async function deleteCanopy(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/canopy`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's canopy. The mutation variable is the
 * `jobId`. On success it invalidates both the single-canopy detail (keyed by
 * `jobId`) and every paginated canopies list, so the `/canopies` listing and
 * the job's canopy view stay in sync.
 */
export function useDeleteCanopy() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteCanopy(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: canopyKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: canopyKeys.lists() })
    },
  })
}
