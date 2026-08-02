import { beforeEach, describe, expect, it } from 'vitest'
import type { Job } from '@/api/quotation/jobs/getJobs'
import {
  applyRecentlyUsedProjectInfo,
  getRecentlyUsedAdapter,
} from '@/components/quotation/recently-used'
import { useQuotationStore } from '@/stores/quotation-store'

const job: Job = {
  id: 'job-meridian',
  projectNo: 'FL-001',
  subject: 'Meridian Logistics',
  refNo: 'REF-1',
  date: '2026-01-01',
  designedByName: 'Designer',
  designedByMobile: '9999999999',
  clientName: 'Meridian',
  estimationEngineerName: 'Engineer',
  estimationEngineerMobile: '8888888888',
  headOfSalesName: 'Sales',
  headOfSalesMobile: '7777777777',
  firmName: 'Floreat',
  buildingUsage: 'Warehouse',
  numberOfBuilding: 1,
  frameType: 'PEB',
  configuration: 'Single span',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('Recently Used adapters', () => {
  beforeEach(() => useQuotationStore.getState().resetQuotation())

  it('applies project information without changing another step', () => {
    useQuotationStore.getState().setRoof({ buildingOverallLength: 321 })

    applyRecentlyUsedProjectInfo(job)

    const state = useQuotationStore.getState()
    expect(state.projectInfo.subject).toBe('Meridian Logistics')
    expect(state.projectInfo.clientName).toBe('Meridian')
    expect(state.roof.buildingOverallLength).toBe(321)
  })

  it('does not provide an apply adapter for calculated or global steps', () => {
    expect(getRecentlyUsedAdapter(10)).toBeUndefined()
    expect(getRecentlyUsedAdapter(11)).toBeUndefined()
    expect(getRecentlyUsedAdapter(12)).toBeUndefined()
  })
})
