import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { specKeys } from './queryKeys'

/**
 * Deletes the spec for a job via DELETE /api/jobs/:jobId/spec.
 * The backend responds with 204 No Content, so this resolves to `void`.
 * Requires a Clerk session token for authentication.
 */
export async function deleteSpec(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/spec`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's spec. The mutation variable is the
 * `jobId`. On success it invalidates both the single-spec detail (keyed by
 * `jobId`) and every paginated specs list, so the `/specs` listing and the
 * job's spec view stay in sync.
 */
export function useDeleteSpec() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteSpec(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: specKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: specKeys.lists() })
    },
  })
}
