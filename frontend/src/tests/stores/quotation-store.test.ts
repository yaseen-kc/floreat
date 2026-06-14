import { describe, it, expect, beforeEach } from 'vitest'
import { useQuotationStore } from '@/stores/quotation-store'

const STORAGE_KEY = 'strukt:draft'

describe('quotation-store lifecycle', () => {
  beforeEach(() => {
    localStorage.clear()
    // Tests below repoint the persist key; restore the default before each test.
    useQuotationStore.persist.setOptions({ name: STORAGE_KEY })
    useQuotationStore.getState().resetQuotation()
  })

  it('defaults jobId to null', () => {
    expect(useQuotationStore.getState().jobId).toBeNull()
  })

  it('setJobId stores the created job id', () => {
    useQuotationStore.getState().setJobId('job-42')
    expect(useQuotationStore.getState().jobId).toBe('job-42')
  })

  it('persists jobId to localStorage (so a job resumes after refresh)', () => {
    useQuotationStore.getState().setJobId('job-99')
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(persisted.state.jobId).toBe('job-99')
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
      clientName: 'Acme',
      estimationEngineerName: 'Jane',
      estimationEngineerMobile: '0987654321',
      headOfSalesName: 'Sam',
      headOfSalesMobile: '5555555555',
      firmName: 'Acme Co',
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

  it('is valid when every field is filled', () => {
    fillRequired()
    expect(useQuotationStore.getState().validateStep(1)).toBe(true)
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

  it('now requires the contact fields and firmName', () => {
    fillRequired()
    // Clearing any previously-optional field invalidates step 1.
    useQuotationStore.getState().setProjectInfo({ clientName: '' })
    expect(useQuotationStore.getState().validateStep(1)).toBe(false)

    useQuotationStore.getState().setProjectInfo({ clientName: 'Acme', firmName: '' })
    expect(useQuotationStore.getState().validateStep(1)).toBe(false)
  })
})

describe('quotation-store per-user persistence scoping', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.persist.setOptions({ name: 'strukt:draft' })
    useQuotationStore.getState().resetQuotation()
  })

  /** Builds a full persisted-state blob for a given user draft. */
  const seed = (key: string, projectNo: string, currentStep: number, jobId: string | null) => {
    const base = useQuotationStore.getState().projectInfo
    localStorage.setItem(
      key,
      JSON.stringify({
        state: { projectInfo: { ...base, projectNo }, currentStep, jobId },
        version: 1,
      }),
    )
  }

  it('writes the draft (including jobId) to the active user-scoped key', () => {
    useQuotationStore.persist.setOptions({ name: 'strukt:draft:userA' })
    useQuotationStore.getState().setProjectInfo({ projectNo: 'P-A' })
    useQuotationStore.getState().setJobId('job-A')

    const stored = JSON.parse(localStorage.getItem('strukt:draft:userA') ?? '{}')
    expect(stored.state.projectInfo.projectNo).toBe('P-A')
    expect(stored.state.jobId).toBe('job-A')
  })

  it('rehydrates jobId and draft from a user-scoped key', async () => {
    seed('strukt:draft:userB', 'P-B', 3, 'job-B')

    useQuotationStore.persist.setOptions({ name: 'strukt:draft:userB' })
    await useQuotationStore.persist.rehydrate()

    const s = useQuotationStore.getState()
    expect(s.jobId).toBe('job-B')
    expect(s.projectInfo.projectNo).toBe('P-B')
    expect(s.currentStep).toBe(3)
  })

  it('does not load another user\'s draft when switching to a key with no stored draft', async () => {
    // User A has a saved draft; user C is brand new.
    seed('strukt:draft:userA', 'P-A', 2, 'job-A')

    useQuotationStore.persist.setOptions({ name: 'strukt:draft:userC' })
    // Mirrors the hook: no stored draft for this user -> start clean.
    if (!localStorage.getItem('strukt:draft:userC')) {
      useQuotationStore.getState().resetQuotation()
    }

    const s = useQuotationStore.getState()
    expect(s.jobId).toBeNull()
    expect(s.projectInfo.projectNo).toBe('')
  })
})
