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

interface QuotationState {
  currentStep: number
  projectInfo: ProjectInfo
  roof: RoofDraft
  showValidation: boolean
  jobId: string | null
  setProjectInfo: (v: Partial<ProjectInfo>) => void
  setRoof: (v: Partial<RoofDraft>) => void
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
})

export const useQuotationStore = create<QuotationState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      showValidation: false,
      jobId: null,
      projectInfo: createDefaultProjectInfo(),
      roof: createDefaultRoof(),

      setProjectInfo: (v) => set((s) => ({ projectInfo: { ...s.projectInfo, ...v } })),

      setRoof: (v) => set((s) => ({ roof: { ...s.roof, ...v } })),

      setJobId: (id) => set({ jobId: id }),

      resetQuotation: () => set({
        currentStep: 1,
        showValidation: false,
        jobId: null,
        projectInfo: createDefaultProjectInfo(),
        roof: createDefaultRoof(),
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
      partialize: (s) => ({ projectInfo: s.projectInfo, roof: s.roof, currentStep: s.currentStep, jobId: s.jobId }),
    }
  )
)
