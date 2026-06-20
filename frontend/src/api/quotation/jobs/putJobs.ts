import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { JobInput } from '@/schemas/job.schema'
import type { Job } from './getJobs'
import { jobKeys } from './queryKeys'

/** Payload for updating a job — partial of the canonical job contract. */
export type UpdateJobPayload = Partial<JobInput>

/**
 * Variables accepted by the {@link useUpdateJob} mutation: the target job `id`
 * spread together with the partial update payload.
 */
export type UpdateJobVariables = { id: string } & UpdateJobPayload

/**
 * Partially updates a job via PUT /api/jobs/:id.
 * The backend validates the partial payload and returns the full updated job.
 * Requires a Clerk session token for authentication.
 */
export async function updateJob(
  token: string | null,
  id: string,
  payload: UpdateJobPayload,
): Promise<Job> {
  return await apiFetch(`/api/jobs/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job. On success it invalidates both every
 * paginated jobs list and the job detail (keyed by `id`), so the `/jobs`
 * listing and any job detail view stay in sync.
 */
export function useUpdateJob() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateJobVariables) => {
      const token = await getToken()
      return updateJob(token, id, payload)
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) })
    },
  })
}
