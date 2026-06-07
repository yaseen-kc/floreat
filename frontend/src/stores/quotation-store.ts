import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ProjectInfo {
  projectNo: string
  subject: string
  refNo: string
  date: string
  designedByName: string
  designedByMobile: string
  clientName: string
  estimationEngineerName: string
  estimationEngineerMobile: string
  headOfSalesName: string
  headOfSalesMobile: string
  buildingUsage: string
  numberOfBuilding: number
  frameType: string
  configuration: string
}

interface QuotationState {
  currentStep: number
  projectInfo: ProjectInfo
  showValidation: boolean
  setProjectInfo: (v: Partial<ProjectInfo>) => void
  goStep: (n: number) => void
  nextStep: () => boolean
  prevStep: () => void
  validateStep: (n: number) => boolean
}

export const useQuotationStore = create<QuotationState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      showValidation: false,
      projectInfo: {
        projectNo: '', subject: '', refNo: '',
        date: new Date().toISOString().slice(0, 10),
        designedByName: '', designedByMobile: '',
        clientName: '',
        estimationEngineerName: '', estimationEngineerMobile: '',
        headOfSalesName: '', headOfSalesMobile: '',
        buildingUsage: '', numberOfBuilding: 0,
        frameType: '', configuration: '',
      },

      setProjectInfo: (v) => set((s) => ({ projectInfo: { ...s.projectInfo, ...v } })),

      validateStep: (n) => {
        const s = get()
        if (n === 1) {
          const p = s.projectInfo
          return [p.projectNo, p.subject, p.refNo, p.date, p.designedByName, p.designedByMobile, p.clientName, p.estimationEngineerName, p.estimationEngineerMobile, p.headOfSalesName, p.headOfSalesMobile, p.buildingUsage, p.frameType, p.configuration].every(f => f.trim() !== '') && p.numberOfBuilding > 0
        }
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
    { name: 'strukt:draft' }
  )
)
