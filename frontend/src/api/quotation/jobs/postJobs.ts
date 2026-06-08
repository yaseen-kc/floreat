import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { Job } from './getJobs'

/** Payload for creating a new job (matches backend createJobSchema). */
export interface CreateJobPayload {
  projectNo: string
  subject: string
  refNo: string
  date: string
  designedByName: string
  designedByMobile: string
  clientName?: string
  estimationEngineerName?: string
  estimationEngineerMobile?: string
  headOfSalesName?: string
  headOfSalesMobile?: string
  firmName?: string
  buildingUsage: string
  numberOfBuilding: number
  frameType: string
  configuration: string
}

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

export function useCreateJob() {
  const { getToken } = useAuth()
  return useMutation({
    mutationFn: async (payload: CreateJobPayload) => {
      const token = await getToken()
      return createJob(token, payload)
    },
  })
}
