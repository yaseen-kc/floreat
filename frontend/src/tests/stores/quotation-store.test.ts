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

  it('does not persist jobId to localStorage', () => {
    useQuotationStore.getState().setJobId('job-99')
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(persisted.state.jobId).toBeUndefined()
  })

  it('persists the draft projectInfo and currentStep to localStorage', () => {
    useQuotationStore.getState().setProjectInfo({ projectNo: 'P-77' })
    useQuotationStore.getState().goStep(2)
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(persisted.state.projectInfo.projectNo).toBe('P-77')
    expect(persisted.state.currentStep).toBe(2)
    expect(persisted.version).toBe(1)
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

describe('quotation-store step 1 validation', () => {
  /** Fills every required field so step 1 is valid. */
  const fillRequired = () =>
    useQuotationStore.getState().setProjectInfo({
      projectNo: 'P-001',
      subject: 'Subject',
      refNo: 'REF-001',
      date: '2026-01-01',
      designedByName: 'John',
      designedByMobile: '1234567890',
      buildingUsage: 'Commercial',
      numberOfBuilding: 1,
      frameType: 'Steel',
      configuration: 'Standard',
    })

  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('is invalid by default', () => {
    expect(useQuotationStore.getState().validateStep(1)).toBe(false)
  })

  it('is valid with only required fields (optional contacts/firmName empty)', () => {
    fillRequired()
    const s = useQuotationStore.getState()
    expect(s.projectInfo.clientName).toBe('')
    expect(s.projectInfo.firmName).toBe('')
    expect(s.validateStep(1)).toBe(true)
  })

  it('is invalid when a required field is missing', () => {
    fillRequired()
    useQuotationStore.getState().setProjectInfo({ projectNo: '' })
    expect(useQuotationStore.getState().validateStep(1)).toBe(false)
  })

  it('is invalid when numberOfBuilding is 0', () => {
    fillRequired()
    useQuotationStore.getState().setProjectInfo({ numberOfBuilding: 0 })
    expect(useQuotationStore.getState().validateStep(1)).toBe(false)
  })

  it('does not require optional contact fields', () => {
    fillRequired()
    // Already valid without contacts; setting them keeps it valid too.
    useQuotationStore.getState().setProjectInfo({ clientName: 'Acme', firmName: 'Acme Co' })
    expect(useQuotationStore.getState().validateStep(1)).toBe(true)
  })
})
