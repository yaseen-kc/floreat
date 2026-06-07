import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ProjectInfo {
  client: string
  project: string
  site: string
  type: string
  consultant: string
  revision: string
  date: string
  validity: string
  notes: string
}

export interface StructuralInputs {
  length: number
  width: number
  eave: number
  bay: number
  roofType: 'gable' | 'mono' | 'multi' | 'flat'
  pitch: number
  sidewall: boolean
  wind: number
  zone: string
  liveLoad: number
  terrain: string
  wallCladding: string
  glazing: number
  materialGrade: string
}

export interface Assumptions {
  intensity: number
  waste: number
  overlap: number
  k1: number
}

export interface Pricing {
  steelRate: number
  cladRate: number
  labour: number
  erection: number
  transport: number
  hardware: number
  discount: number
  margin: number
  gst: number
  additional: number
}

export interface CalcValues {
  bays: number
  planArea: number
  roofArea: number
  vz: number
  q: number
  steelMass: number
  wallArea: number
  cladArea: number
}

export interface Totals {
  steelAmt: number
  cladAmt: number
  materialSubtotal: number
  services: number
  base: number
  marginAmt: number
  afterMargin: number
  discountAmt: number
  taxable: number
  tax: number
  grand: number
}

interface QuotationState {
  currentStep: number
  projectInfo: ProjectInfo
  structuralInputs: StructuralInputs
  assumptions: Assumptions
  pricing: Pricing
  showValidation: boolean

  setProjectInfo: (v: Partial<ProjectInfo>) => void
  setStructuralInputs: (v: Partial<StructuralInputs>) => void
  setAssumptions: (v: Partial<Assumptions>) => void
  setPricing: (v: Partial<Pricing>) => void
  resetAssumptions: () => void
  goStep: (n: number) => void
  nextStep: () => boolean
  prevStep: () => void
  validateStep: (n: number) => boolean
  getCalc: () => CalcValues
  getTotals: () => Totals
}

const DEFAULT_ASSUMPTIONS: Assumptions = { intensity: 34, waste: 7, overlap: 1.08, k1: 1.0 }

export const useQuotationStore = create<QuotationState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      showValidation: false,
      projectInfo: {
        client: '', project: '', site: '', type: 'Pre-engineered building (PEB)',
        consultant: '', revision: 'R0 — Initial',
        date: new Date().toISOString().slice(0, 10), validity: '30 days', notes: '',
      },
      structuralInputs: {
        length: 36, width: 18, eave: 6.5, bay: 6,
        roofType: 'gable', pitch: 9.5, sidewall: true,
        wind: 44, zone: 'Zone III — 44 m/s', liveLoad: 0.75, terrain: 'Category 2',
        wallCladding: '0.5mm bare galvalume', glazing: 8, materialGrade: 'IS 2062 E250 (Fe 410)',
      },
      assumptions: { ...DEFAULT_ASSUMPTIONS },
      pricing: {
        steelRate: 78, cladRate: 545, labour: 640000, erection: 285000,
        transport: 120000, hardware: 58000, discount: 2.5, margin: 14, gst: 18, additional: 0,
      },

      setProjectInfo: (v) => set((s) => ({ projectInfo: { ...s.projectInfo, ...v } })),
      setStructuralInputs: (v) => set((s) => ({ structuralInputs: { ...s.structuralInputs, ...v } })),
      setAssumptions: (v) => set((s) => ({ assumptions: { ...s.assumptions, ...v } })),
      setPricing: (v) => set((s) => ({ pricing: { ...s.pricing, ...v } })),
      resetAssumptions: () => set({ assumptions: { ...DEFAULT_ASSUMPTIONS } }),

      validateStep: (n) => {
        const s = get()
        if (n === 1) return s.projectInfo.client.trim() !== '' && s.projectInfo.project.trim() !== ''
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

      getCalc: () => {
        const { structuralInputs: si, assumptions: a } = get()
        const pitch = si.roofType === 'flat' ? 1.5 : si.pitch
        const bays = si.bay > 0 ? Math.round(si.length / si.bay) : 0
        const planArea = si.length * si.width
        const roofArea = planArea / Math.cos((pitch * Math.PI) / 180)
        const vz = si.wind * a.k1
        const q = (0.613 * vz * vz) / 1000
        const steelMass = planArea * a.intensity * (1 + a.waste / 100)
        const wallArea = si.sidewall ? 2 * (si.length + si.width) * si.eave : 0
        const cladArea = (roofArea + wallArea) * a.overlap
        return { bays, planArea, roofArea, vz, q, steelMass, wallArea, cladArea }
      },

      getTotals: () => {
        const calc = get().getCalc()
        const p = get().pricing
        const steelAmt = calc.steelMass * p.steelRate
        const cladAmt = calc.cladArea * p.cladRate
        const materialSubtotal = steelAmt + cladAmt
        const services = p.labour + p.erection + p.transport + p.hardware
        const base = materialSubtotal + services + p.additional
        const marginAmt = (base * p.margin) / 100
        const afterMargin = base + marginAmt
        const discountAmt = (afterMargin * p.discount) / 100
        const taxable = afterMargin - discountAmt
        const tax = (taxable * p.gst) / 100
        const grand = Math.round((taxable + tax) / 100) * 100
        return { steelAmt, cladAmt, materialSubtotal, services, base, marginAmt, afterMargin, discountAmt, taxable, tax, grand }
      },
    }),
    { name: 'strukt:draft' }
  )
)
