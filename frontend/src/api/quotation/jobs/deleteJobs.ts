import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { jobKeys } from './queryKeys'

/**
 * Deletes a job via DELETE /api/jobs/:id.
 * The backend responds with 204 No Content, so this resolves to `void`.
 * Requires a Clerk session token for authentication.
 */
export async function deleteJob(token: string | null, id: string): Promise<void> {
  await apiFetch(`/api/jobs/${id}`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job. The mutation variable is the job `id`.
 * On success it invalidates both the job detail (keyed by `id`) and every
 * paginated jobs list, so the `/jobs` listing and any job detail view stay in sync.
 */
export function useDeleteJob() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken()
      return deleteJob(token, id)
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
    },
  })
}
