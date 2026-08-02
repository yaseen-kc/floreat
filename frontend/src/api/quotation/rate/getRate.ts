import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateRateInput } from '@floreat/shared/schemas'
import { rateKeys } from './queryKeys'

export type RateUnit = CreateRateInput['unit']
export interface Rate {
  id: string; jobId: string; item: string; unit: RateUnit
  material: string | null; fabrication: string | null; transportation: string | null
  installation: string | null; loadingUnloading: string | null; overheads: string | null
  others: string | null; marginPercentage: string | null
  fabricationRate: number; erectionRate: number; loadingRate: number; totalRate: number
  createdAt: string; updatedAt: string
}
export interface GetRatesResponse { data: Rate[]; total: number; page: number; pageSize: number }

export async function getRates(token: string | null, jobId: string, page = 1, pageSize = 10): Promise<GetRatesResponse> {
  return await apiFetch(`/api/jobs/${jobId}/rates?page=${page}&pageSize=${pageSize}`, token)
}

export function useRates(jobId: string, page = 1, pageSize = 10) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: rateKeys.list(jobId, page, pageSize), enabled: !!jobId,
    queryFn: async () => getRates(await getToken(), jobId, page, pageSize),
  })
}

export async function getRateById(token: string | null, jobId: string, id: string): Promise<Rate> {
  return await apiFetch(`/api/jobs/${jobId}/rates/${id}`, token)
}

export function useRate(jobId: string, id: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: rateKeys.detail(jobId, id), enabled: !!jobId && !!id,
    queryFn: async () => getRateById(await getToken(), jobId, id),
  })
}
