import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { quantityPebRoofKeys } from './queryKeys'

/**
 * Deletes the pebRoof section for a job via DELETE /api/jobs/:jobId/quantity/peb-roof.
 * The backend responds with 204 No Content. Requires a Clerk session token.
 */
export async function deleteQuantityPebRoof(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/quantity/peb-roof`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's pebRoof section. On success invalidates
 * both the pebRoof detail and every paginated pebRoof list.
 */
export function useDeleteQuantityPebRoof() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteQuantityPebRoof(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: quantityPebRoofKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityPebRoofKeys.lists() })
    },
  })
}
