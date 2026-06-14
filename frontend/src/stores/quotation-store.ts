import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jobSchema, type JobInput } from '@/schemas/job.schema'

/** Step 1 project info — the canonical job contract (see job.schema.ts). */
export type ProjectInfo = JobInput

interface QuotationState {
  currentStep: number
  projectInfo: ProjectInfo
  showValidation: boolean
  jobId: string | null
  setProjectInfo: (v: Partial<ProjectInfo>) => void
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

export const useQuotationStore = create<QuotationState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      showValidation: false,
      jobId: null,
      projectInfo: createDefaultProjectInfo(),

      setProjectInfo: (v) => set((s) => ({ projectInfo: { ...s.projectInfo, ...v } })),

      setJobId: (id) => set({ jobId: id }),

      resetQuotation: () => set({
        currentStep: 1,
        showValidation: false,
        jobId: null,
        projectInfo: createDefaultProjectInfo(),
      }),

      validateStep: (n) => {
        const s = get()
        if (n === 1) return jobSchema.safeParse(s.projectInfo).success
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
      // Persist only the in-progress draft. `jobId` is deliberately excluded so
      // a stale id can't leak across sessions (or to another user on a shared
      // machine) and re-attach new edits to someone else's job.
      partialize: (s) => ({ projectInfo: s.projectInfo, currentStep: s.currentStep }),
    }
  )
)
