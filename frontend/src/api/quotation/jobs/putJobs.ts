import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { Job } from './getJobs'

export interface UpdateJobPayload {
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
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string } & UpdateJobPayload) => {
      const token = await getToken()
      return updateJob(token, id, payload)
    },
  })
}
