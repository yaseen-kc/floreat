import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { loadKeys } from './queryKeys'

/**
 * Deletes the load for a job via DELETE /api/jobs/:jobId/load.
 * The backend responds with 204 No Content, so this resolves to `void`.
 * Requires a Clerk session token for authentication.
 */
export async function deleteLoad(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/load`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's load. The mutation variable is the
 * `jobId`. On success it invalidates both the single-load detail (keyed by
 * `jobId`) and every paginated loads list, so the `/loads` listing and the
 * job's load view stay in sync.
 */
export function useDeleteLoad() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteLoad(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: loadKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: loadKeys.lists() })
    },
  })
}
