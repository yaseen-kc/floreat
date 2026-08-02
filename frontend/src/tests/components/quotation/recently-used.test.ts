import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Job } from '@/api/quotation/jobs/getJobs'
import type { Rate } from '@/api/quotation/rate/getRate'
import {
  applyRecentlyUsedProjectInfo,
  getRecentlyUsedAdapter,
} from '@/components/quotation/recently-used'
import { useQuotationStore } from '@/stores/quotation-store'

const mocks = vi.hoisted(() => ({
  getRates: vi.fn(),
}))

vi.mock('@/api/quotation/rate/getRate', () => ({
  getRates: mocks.getRates,
}))

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
  beforeEach(() => {
    useQuotationStore.getState().resetQuotation()
    mocks.getRates.mockReset()
  })

  it('applies project information without changing another step', () => {
    useQuotationStore.getState().setRoof({ buildingOverallLength: 321 })

    applyRecentlyUsedProjectInfo(job)

    const state = useQuotationStore.getState()
    expect(state.projectInfo.subject).toBe('Meridian Logistics')
    expect(state.projectInfo.clientName).toBe('Meridian')
    expect(state.roof.buildingOverallLength).toBe(321)
  })

  it('provides a rate adapter while leaving the current job and other steps unchanged', async () => {
    const sourceRate = {
      id: 'rate-1',
      jobId: job.id,
      item: 'STEEL STRUCTURE',
      unit: 'KG',
      material: '63',
      fabrication: '15',
      transportation: '1.5',
      installation: '8',
      loadingUnloading: '3',
      overheads: '0',
      others: '0',
      marginPercentage: '15',
      fabricationRate: 15,
      erectionRate: 8,
      loadingRate: 3,
      totalRate: 90.5,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    } satisfies Rate
    useQuotationStore.setState({ jobId: 'current-job', roof: { ...useQuotationStore.getState().roof, buildingOverallLength: 321 } })
    mocks.getRates.mockResolvedValue({ data: [sourceRate], total: 1, page: 1, pageSize: 100 })

    await getRecentlyUsedAdapter(10)!.apply(job, 'token')

    const state = useQuotationStore.getState()
    expect(mocks.getRates).toHaveBeenCalledWith('token', job.id, 1, 100)
    expect(state.rateRows).toHaveLength(35)
    expect(state.rateRows[0]).toMatchObject({ item: 'STEEL STRUCTURE', material: 63, fabrication: 15 })
    expect(state.rateRows[1]).toMatchObject({ item: 'WIND BRACING - ROD', unit: 'RM' })
    expect(state.jobId).toBe('current-job')
    expect(state.roof.buildingOverallLength).toBe(321)
  })

  it('uses default editable rows when the source job has no saved rates', async () => {
    mocks.getRates.mockResolvedValue({ data: [], total: 0, page: 1, pageSize: 100 })

    await getRecentlyUsedAdapter(10)!.apply(job, null)

    const rows = useQuotationStore.getState().rateRows
    expect(rows).toHaveLength(35)
    expect(rows[0]).toEqual({ item: 'STEEL STRUCTURE', unit: 'KG' })
    expect(rows.every((row) => row.id === undefined)).toBe(true)
  })

  it('does not provide apply adapters for calculated or global steps', () => {
    expect(getRecentlyUsedAdapter(11)).toBeUndefined()
    expect(getRecentlyUsedAdapter(12)).toBeUndefined()
  })
})
