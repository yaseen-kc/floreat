import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { roofKeys } from './queryKeys'

/**
 * Deletes the roof for a job via DELETE /api/jobs/:jobId/roof.
 * The backend responds with 204 No Content, so this resolves to `void`.
 * Requires a Clerk session token for authentication.
 */
export async function deleteRoof(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/roof`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's roof. The mutation variable is the
 * `jobId`. On success it invalidates both the single-roof detail (keyed by
 * `jobId`) and every paginated roofs list, so the `/roofs` listing and the
 * job's roof view stay in sync.
 */
export function useDeleteRoof() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteRoof(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: roofKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: roofKeys.lists() })
    },
  })
}
