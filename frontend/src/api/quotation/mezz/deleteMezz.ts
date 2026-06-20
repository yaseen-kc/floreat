import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { mezzanineKeys } from './queryKeys'

/**
 * Deletes the mezzanine for a job via DELETE /api/jobs/:jobId/mezzanine.
 * The backend responds with 204 No Content, so this resolves to `void`.
 * Requires a Clerk session token for authentication.
 */
export async function deleteMezzanine(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/mezzanine`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's mezzanine. The mutation variable is the
 * `jobId`. On success it invalidates both the single-mezzanine detail (keyed by
 * `jobId`) and every paginated mezzanines list, so the `/mezzanines` listing and
 * the job's mezzanine view stay in sync.
 */
export function useDeleteMezzanine() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteMezzanine(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: mezzanineKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: mezzanineKeys.lists() })
    },
  })
}
