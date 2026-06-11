import { describe, it, expect, beforeEach } from 'vitest'
import { useQuotationStore } from '@/stores/quotation-store'

const STORAGE_KEY = 'strukt:draft'

describe('quotation-store lifecycle', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('defaults jobId to null', () => {
    expect(useQuotationStore.getState().jobId).toBeNull()
  })

  it('setJobId stores the created job id', () => {
    useQuotationStore.getState().setJobId('job-42')
    expect(useQuotationStore.getState().jobId).toBe('job-42')
  })

  it('persists jobId to localStorage', () => {
    useQuotationStore.getState().setJobId('job-99')
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(persisted.state.jobId).toBe('job-99')
  })

  it('resetQuotation restores defaults and clears jobId', () => {
    useQuotationStore.getState().setJobId('job-1')
    useQuotationStore.getState().setProjectInfo({ projectNo: 'P-001', subject: 'X', numberOfBuilding: 3 })
    useQuotationStore.getState().goStep(3)

    useQuotationStore.getState().resetQuotation()

    const s = useQuotationStore.getState()
    expect(s.jobId).toBeNull()
    expect(s.currentStep).toBe(1)
    expect(s.showValidation).toBe(false)
    expect(s.projectInfo.projectNo).toBe('')
    expect(s.projectInfo.subject).toBe('')
    expect(s.projectInfo.numberOfBuilding).toBe(0)
  })
})
