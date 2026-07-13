import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { jointKeys } from './queryKeys'

/**
 * Deletes the joint for a job via DELETE /api/jobs/:jobId/joint.
 * The backend responds with 204 No Content, so this resolves to `void`.
 * Requires a Clerk session token for authentication.
 */
export async function deleteJoint(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/joint`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's joint. The mutation variable is the
 * `jobId`. On success it invalidates both the single-joint detail (keyed by
 * `jobId`) and every paginated joints list, so the `/joints` listing and the
 * job's joint view stay in sync.
 */
export function useDeleteJoint() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteJoint(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: jointKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: jointKeys.lists() })
    },
  })
}
