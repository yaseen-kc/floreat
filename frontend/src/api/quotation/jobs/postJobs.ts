import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { JobInput } from '@/schemas/job.schema'
import type { Job } from './getJobs'
import { jobKeys } from './queryKeys'

/** Payload for creating a new job — the canonical job contract. */
export type CreateJobPayload = JobInput

/**
 * Creates a new job via POST /api/jobs.
 * Requires a Clerk session token for authentication.
 */
export async function createJob(
  token: string | null,
  payload: CreateJobPayload,
): Promise<Job> {
  return await apiFetch('/api/jobs', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for creating a job. On success it invalidates every
 * paginated jobs list so the `/jobs` listing reflects the new job. No detail
 * is invalidated because a create yields a brand-new server id that no detail
 * query is keyed on yet.
 */
export function useCreateJob() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateJobPayload) => {
      const token = await getToken()
      return createJob(token, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
    },
  })
}
