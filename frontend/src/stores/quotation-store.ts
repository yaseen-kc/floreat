import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jobSchema, type JobInput } from '@/schemas/job.schema'
import { createRoofSchema, type CreateRoofInput } from '@/schemas/roof.schema'

/** Step 1 project info — the canonical job contract (see job.schema.ts). */
export type ProjectInfo = JobInput

/**
 * Step 2 roof draft. Mirrors the roof create contract but lets the required
 * `roofFrameBaseFixing` enum start unselected (`''`) so the Select renders empty
 * and validation flags it, exactly like the Step 1 string fields.
 */
export type RoofDraft = Omit<CreateRoofInput, 'roofFrameBaseFixing'> & {
  roofFrameBaseFixing: CreateRoofInput['roofFrameBaseFixing'] | ''
}

/**
 * The optional, toggleable roof sections (Step 2). Each maps to a group of
 * roof fields that are only part of the payload while the section is enabled.
 */
export type RoofSectionKey =
  | 'members'
  | 'purlins'
  | 'coverings'
  | 'flangeBrace'
  | 'polycarbonate'
  | 'windBracing'
  | 'claddingOpenings'
  | 'fasciaBoard'
  | 'sideExtension'
  | 'materialGrade'
  | 'sidewalls'

/** Per-section enabled flags. */
export type RoofSectionsEnabled = Record<RoofSectionKey, boolean>

/**
 * Maps each optional section to the roof fields it owns. Disabling a section
 * clears these fields so they drop out of the payload (see `toggleRoofSection`).
 */
export const ROOF_SECTION_FIELDS: Record<RoofSectionKey, readonly (keyof RoofDraft)[]> = {
  members: [
    'columnSegmentsInMainFrame',
    'raftersInOneHalfOfMainFrame',
    'columnSegmentsInEndFrame',
    'raftersInOneHalfOfEndFrame',
    'endFrameHorizontalTieBeam',
  ],
  purlins: [
    'roofPurlinType',
    'roofPurlinDepth',
    'roofPurlinUnitWeight',
    'claddingPurlinType',
    'claddingPurlinDepth',
    'claddingPurlinUnitWeight',
  ],
  coverings: [
    'roofCoveringType',
    'roofCoveringThickness',
    'claddingCoveringType',
    'claddingCoveringThickness',
    'roofAreaDeduction',
  ],
  flangeBrace: [
    'roofFlangeBraceAverageLength',
    'claddingFlangeBraceAverageLength',
    'endFrameFlangeBraceAverageLength',
  ],
  polycarbonate: [
    'polycarbonateRoofLength',
    'polycarbonateRoofWidth',
    'polycarbonateRoofCount',
  ],
  windBracing: [
    'roofWindBracingSegmentsInOneHalf',
    'columnWindBracingSegments',
    'roofWindBracingProvidedBays',
    'columnWindBracingProvidedBays',
    'windBracingColumnHeight',
    'windBracingUnitWeight',
    'roofWindBracingBaySpacing',
    'columnWindBracingBaySpacing',
    'roofWindBracingLength',
    'columnWindBracingLength',
    'windBracingType',
  ],
  claddingOpenings: [
    'frontCladdingOpeningArea',
    'backCladdingOpeningArea',
    'rightCladdingOpeningArea',
    'leftCladdingOpeningArea',
  ],
  fasciaBoard: ['fasciaBoardArea', 'fasciaMaterialWeightPerSqft'],
  sideExtension: [
    'roofExtensionWidthHeight',
    'roofExtensionMidFrameCount',
    'roofExtensionEndFrameCount',
    'claddingExtensionWidthHeight',
    'claddingExtensionMidFrameCount',
    'claddingExtensionEndFrameCount',
    'sideColumnsWidthHeight',
    'sideColumnsMidFrameCount',
    'sideColumnsEndFrameCount',
  ],
  materialGrade: ['gradeOfPlateMaterial'],
  sidewalls: ['sidewalls'],
}

interface QuotationState {
  currentStep: number
  projectInfo: ProjectInfo
  roof: RoofDraft
  roofSectionsEnabled: RoofSectionsEnabled
  showValidation: boolean
  jobId: string | null
  setProjectInfo: (v: Partial<ProjectInfo>) => void
  setRoof: (v: Partial<RoofDraft>) => void
  toggleRoofSection: (key: RoofSectionKey, enabled: boolean) => void
  setJobId: (id: string | null) => void
  resetQuotation: () => void
  goStep: (n: number) => void
  nextStep: () => boolean
  prevStep: () => void
  validateStep: (n: number) => boolean
}

/** Factory for a fresh projectInfo so each new quotation gets a current date. */
const createDefaultProjectInfo = (): ProjectInfo => ({
  projectNo: '', subject: '', refNo: '',
  date: new Date().toISOString().slice(0, 10),
  designedByName: '', designedByMobile: '',
  clientName: '',
  estimationEngineerName: '', estimationEngineerMobile: '',
  headOfSalesName: '', headOfSalesMobile: '',
  firmName: '',
  buildingUsage: '', numberOfBuilding: 0,
  frameType: '', configuration: '',
})

/**
 * Factory for a fresh roof draft. The required core dimensions default to `0`
 * (rejected by the schema's `.positive()`) and `roofFrameBaseFixing` starts
 * unselected (`''`), so Step 2 is invalid until the user fills it in.
 */
const createDefaultRoof = (): RoofDraft => ({
  buildingOverallLength: 0,
  buildingOverallWidth: 0,
  eaveHeight: 0,
  roofSlope: 0,
  mainRoofFrames: 0,
  endRoofFrames: 0,
  roofPurlinSpacing: 0,
  claddingPurlins: 0,
  internalColumnsForMainRoofFrames: 0,
  internalColumnsForEndRoofFrames: 0,
  roofFrameBaseFixing: '',
  sidewalls: [],
})

/** Factory for the per-section enabled flags — every optional section starts off. */
const createDefaultRoofSections = (): RoofSectionsEnabled => ({
  members: false,
  purlins: false,
  coverings: false,
  flangeBrace: false,
  polycarbonate: false,
  windBracing: false,
  claddingOpenings: false,
  fasciaBoard: false,
  sideExtension: false,
  materialGrade: false,
  sidewalls: false,
})

export const useQuotationStore = create<QuotationState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      showValidation: false,
      jobId: null,
      projectInfo: createDefaultProjectInfo(),
      roof: createDefaultRoof(),
      roofSectionsEnabled: createDefaultRoofSections(),

      setProjectInfo: (v) => set((s) => ({ projectInfo: { ...s.projectInfo, ...v } })),

      setRoof: (v) => set((s) => ({ roof: { ...s.roof, ...v } })),

      toggleRoofSection: (key, enabled) =>
        set((s) => {
          const roofSectionsEnabled = { ...s.roofSectionsEnabled, [key]: enabled }
          if (enabled) return { roofSectionsEnabled }
          // Disabling a section clears its fields so they drop from the payload.
          const roof = { ...s.roof } as Record<string, unknown>
          for (const field of ROOF_SECTION_FIELDS[key]) {
            roof[field] = field === 'sidewalls' ? [] : undefined
          }
          return { roofSectionsEnabled, roof: roof as unknown as RoofDraft }
        }),

      setJobId: (id) => set({ jobId: id }),

      resetQuotation: () => set({
        currentStep: 1,
        showValidation: false,
        jobId: null,
        projectInfo: createDefaultProjectInfo(),
        roof: createDefaultRoof(),
        roofSectionsEnabled: createDefaultRoofSections(),
      }),

      validateStep: (n) => {
        const s = get()
        if (n === 1) return jobSchema.safeParse(s.projectInfo).success
        if (n === 2) return createRoofSchema.safeParse(s.roof).success
        return true
      },

      goStep: (n) => { if (n >= 1 && n <= 5) set({ currentStep: n, showValidation: false }) },

      nextStep: () => {
        const s = get()
        if (!s.validateStep(s.currentStep)) { set({ showValidation: true }); return false }
        if (s.currentStep < 5) set({ currentStep: s.currentStep + 1, showValidation: false })
        return true
      },

      prevStep: () => { const s = get(); if (s.currentStep > 1) set({ currentStep: s.currentStep - 1, showValidation: false }) },
    }),
    {
      name: 'strukt:draft',
      version: 1,
      // The draft is hydrated manually (see useDraftPersistenceScope) once the
      // Clerk user id is known, so the storage key can be namespaced per user
      // (`strukt:draft:<userId>`). This keeps each user's draft — including the
      // server `jobId` — isolated on shared machines, while still letting an
      // in-progress job resume (and re-use PUT) after a refresh instead of
      // creating a duplicate.
      skipHydration: true,
      partialize: (s) => ({ projectInfo: s.projectInfo, roof: s.roof, roofSectionsEnabled: s.roofSectionsEnabled, currentStep: s.currentStep, jobId: s.jobId }),
    }
  )
)


/**
 * Builds the roof create/upsert payload from the Step 2 draft.
 *
 * Optional fields left blank are `undefined` and are dropped, an empty
 * `sidewalls` array is omitted entirely, and `roofFrameBaseFixing` is asserted
 * to be selected. Call this only after `validateStep(2)` succeeds.
 */
export function buildRoofPayload(roof: RoofDraft): CreateRoofInput {
  if (!roof.roofFrameBaseFixing) {
    throw new Error('Cannot build roof payload: roofFrameBaseFixing is not selected')
  }

  const entries = Object.entries(roof).filter(([key, value]) => {
    if (value === undefined) return false
    if (key === 'sidewalls') return Array.isArray(value) && value.length > 0
    return true
  })

  return {
    ...(Object.fromEntries(entries) as Omit<CreateRoofInput, 'roofFrameBaseFixing'>),
    roofFrameBaseFixing: roof.roofFrameBaseFixing,
  }
}
