import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { JobInput } from '@/schemas/job.schema'
import type { Job } from './getJobs'
import { jobKeys } from './queryKeys'

/** Payload for updating a job — partial of the canonical job contract. */
export type UpdateJobPayload = Partial<JobInput>

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

export function useUpdateJob() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string } & UpdateJobPayload) => {
      const token = await getToken()
      return updateJob(token, id, payload)
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) })
    },
  })
}
