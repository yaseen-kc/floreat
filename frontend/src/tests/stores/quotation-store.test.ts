import { describe, it, expect, beforeEach } from 'vitest'
import { useQuotationStore, buildSpecPayload } from '@/stores/quotation-store'
import { validRoofDraft } from '@/tests/fixtures/roof'

const STORAGE_KEY = 'Floreat:draft'

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

describe('quotation-store step 2 roof slice', () => {
  /** Fills every required roof field (core + sections) so step 2 is valid. */
  const fillValidRoof = () => useQuotationStore.getState().setRoof(validRoofDraft)

  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('defaults roof to zeroed dimensions and an unselected fixing', () => {
    const { roof } = useQuotationStore.getState()
    expect(roof.eaveHeight).toBe(0)
    expect(roof.roofFrameBaseFixing).toBe('')
  })

  it('setRoof merges partial patches', () => {
    useQuotationStore.getState().setRoof({ eaveHeight: 6 })
    useQuotationStore.getState().setRoof({ buildingOverallLength: 100 })
    const { roof } = useQuotationStore.getState()
    expect(roof.eaveHeight).toBe(6)
    expect(roof.buildingOverallLength).toBe(100)
  })

  it('validateStep(2) is invalid by default', () => {
    expect(useQuotationStore.getState().validateStep(2)).toBe(false)
  })

  it('validateStep(2) is valid with only the core filled (sections are optional)', () => {
    useQuotationStore.getState().setRoof({
      buildingOverallLength: 100,
      buildingOverallWidth: 50,
      eaveHeight: 6,
      roofSlope: 10,
      mainRoofFrames: 5,
      endRoofFrames: 2,
      roofPurlinSpacing: 1.5,
      claddingPurlins: 4,
      internalColumnsForMainRoofFrames: 0,
      internalColumnsForEndRoofFrames: 0,
      roofFrameBaseFixing: 'FOUNDATION_BOLT',
    })
    expect(useQuotationStore.getState().validateStep(2)).toBe(true)
  })

  it('validateStep(2) is valid once every field is filled', () => {
    fillValidRoof()
    expect(useQuotationStore.getState().validateStep(2)).toBe(true)
  })

  it('validateStep(2) is invalid when the fixing is unselected', () => {
    fillValidRoof()
    useQuotationStore.getState().setRoof({ roofFrameBaseFixing: '' })
    expect(useQuotationStore.getState().validateStep(2)).toBe(false)
  })

  it('persists the roof draft to localStorage', () => {
    useQuotationStore.getState().setRoof({ eaveHeight: 7 })
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(persisted.state.roof.eaveHeight).toBe(7)
  })

  it('resetQuotation restores roof defaults', () => {
    fillValidRoof()
    useQuotationStore.getState().resetQuotation()
    const { roof } = useQuotationStore.getState()
    expect(roof.eaveHeight).toBe(0)
    expect(roof.roofFrameBaseFixing).toBe('')
  })
})

describe('quotation-store optional roof sections', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.persist.setOptions({ name: STORAGE_KEY })
    useQuotationStore.getState().resetQuotation()
  })

  it('defaults every section to disabled and optional fields to undefined', () => {
    const s = useQuotationStore.getState()
    expect(s.roofSectionsEnabled.purlins).toBe(false)
    expect(s.roofSectionsEnabled.windBracing).toBe(false)
    expect(s.roof.roofPurlinDepth).toBeUndefined()
    expect(s.roof.gradeOfPlateMaterial).toBeUndefined()
    expect(s.roof.sidewalls).toEqual([])
  })

  it('toggleRoofSection flips the enabled flag', () => {
    useQuotationStore.getState().toggleRoofSection('purlins', true)
    expect(useQuotationStore.getState().roofSectionsEnabled.purlins).toBe(true)
  })

  it('disabling a section clears its fields', () => {
    useQuotationStore.getState().toggleRoofSection('purlins', true)
    useQuotationStore.getState().setRoof({ roofPurlinDepth: 120, roofPurlinType: 'Z_C' })
    expect(useQuotationStore.getState().roof.roofPurlinDepth).toBe(120)

    useQuotationStore.getState().toggleRoofSection('purlins', false)
    const s = useQuotationStore.getState()
    expect(s.roofSectionsEnabled.purlins).toBe(false)
    expect(s.roof.roofPurlinDepth).toBeUndefined()
    expect(s.roof.roofPurlinType).toBeUndefined()
  })

  it('disabling the sidewalls section empties the array', () => {
    useQuotationStore.getState().toggleRoofSection('sidewalls', true)
    useQuotationStore.getState().setRoof({ sidewalls: [{ side: 'FRONT', wallType: 'BRICK', thickness: 0.2, height: 3 }] })
    expect(useQuotationStore.getState().roof.sidewalls).toHaveLength(1)

    useQuotationStore.getState().toggleRoofSection('sidewalls', false)
    expect(useQuotationStore.getState().roof.sidewalls).toEqual([])
  })

  it('persists section flags to localStorage', () => {
    useQuotationStore.getState().toggleRoofSection('coverings', true)
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(persisted.state.roofSectionsEnabled.coverings).toBe(true)
  })

  it('resetQuotation restores all section flags to disabled', () => {
    useQuotationStore.getState().toggleRoofSection('windBracing', true)
    useQuotationStore.getState().resetQuotation()
    expect(useQuotationStore.getState().roofSectionsEnabled.windBracing).toBe(false)
  })
})

describe('quotation-store per-user persistence scoping', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.persist.setOptions({ name: 'Floreat:draft' })
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
    useQuotationStore.persist.setOptions({ name: 'Floreat:draft:userA' })
    useQuotationStore.getState().setProjectInfo({ projectNo: 'P-A' })
    useQuotationStore.getState().setJobId('job-A')

    const stored = JSON.parse(localStorage.getItem('Floreat:draft:userA') ?? '{}')
    expect(stored.state.projectInfo.projectNo).toBe('P-A')
    expect(stored.state.jobId).toBe('job-A')
  })

  it('rehydrates jobId and draft from a user-scoped key', async () => {
    seed('Floreat:draft:userB', 'P-B', 3, 'job-B')

    useQuotationStore.persist.setOptions({ name: 'Floreat:draft:userB' })
    await useQuotationStore.persist.rehydrate()

    const s = useQuotationStore.getState()
    expect(s.jobId).toBe('job-B')
    expect(s.projectInfo.projectNo).toBe('P-B')
    expect(s.currentStep).toBe(3)
  })

  it('does not load another user\'s draft when switching to a key with no stored draft', async () => {
    // User A has a saved draft; user C is brand new.
    seed('Floreat:draft:userA', 'P-A', 2, 'job-A')

    useQuotationStore.persist.setOptions({ name: 'Floreat:draft:userC' })
    // Mirrors the hook: no stored draft for this user -> start clean.
    if (!localStorage.getItem('Floreat:draft:userC')) {
      useQuotationStore.getState().resetQuotation()
    }

    const s = useQuotationStore.getState()
    expect(s.jobId).toBeNull()
    expect(s.projectInfo.projectNo).toBe('')
  })
})

describe('quotation-store rehydrate self-heals missing nested keys', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.persist.setOptions({ name: 'Floreat:draft' })
    useQuotationStore.getState().resetQuotation()
  })

  it('backfills a nested slice key absent from an older persisted draft', async () => {
    // A draft written before `spec.products` (and `canopy.canopies`) existed:
    // the nested objects are present but missing their array keys, and one
    // section flag is absent entirely. A shallow merge would leave
    // `spec.products` undefined and crash Step 9 (SpecProducts / buildSpecPayload).
    localStorage.setItem(
      'Floreat:draft:legacy',
      JSON.stringify({
        state: {
          jobId: 'job-legacy',
          currentStep: 9,
          spec: {},
          canopy: {},
          roofSectionsEnabled: { purlins: true },
        },
        version: 1,
      }),
    )

    useQuotationStore.persist.setOptions({ name: 'Floreat:draft:legacy' })
    await useQuotationStore.persist.rehydrate()

    const s = useQuotationStore.getState()
    // Persisted primitives still win.
    expect(s.jobId).toBe('job-legacy')
    expect(s.currentStep).toBe(9)
    // Missing nested array keys fall back to their defaults instead of undefined.
    expect(Array.isArray(s.spec.products)).toBe(true)
    expect(s.spec.products).toEqual([])
    expect(Array.isArray(s.canopy.canopies)).toBe(true)
    expect(s.canopy.canopies).toEqual([])
    // The one persisted section flag is kept; the rest retain their defaults.
    expect(s.roofSectionsEnabled.purlins).toBe(true)
    expect(s.roofSectionsEnabled.coverings).toBe(false)
    // The build helper that maps over products no longer throws.
    expect(() => buildSpecPayload(s.spec)).not.toThrow()
    expect(buildSpecPayload(s.spec)).toEqual({})
  })

  it('preserves populated nested slices from a current-shape persisted draft', async () => {
    localStorage.setItem(
      'Floreat:draft:full',
      JSON.stringify({
        state: {
          spec: { products: [{ code: 'PRODUCT-1', description: 'Beam' }] },
        },
        version: 1,
      }),
    )

    useQuotationStore.persist.setOptions({ name: 'Floreat:draft:full' })
    await useQuotationStore.persist.rehydrate()

    expect(useQuotationStore.getState().spec.products).toEqual([
      { code: 'PRODUCT-1', description: 'Beam' },
    ])
  })
})
