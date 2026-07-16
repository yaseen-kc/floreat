import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { rateKeys } from './queryKeys'

/**
 * Deletes a rate master item via DELETE /api/rates/:id.
 * The backend responds with 204 No Content, so this resolves to `void`.
 * Requires a Clerk session token for authentication.
 */
export async function deleteRate(token: string | null, id: string): Promise<void> {
  await apiFetch(`/api/rates/${id}`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a rate item. The mutation variable is the rate
 * `id`. On success it invalidates both the single-rate detail (keyed by `id`)
 * and every paginated rates list so the `/rates` listing stays in sync.
 */
export function useDeleteRate() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken()
      return deleteRate(token, id)
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: rateKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: rateKeys.lists() })
    },
  })
}
