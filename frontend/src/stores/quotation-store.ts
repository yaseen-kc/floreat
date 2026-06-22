import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'
import { jobSchema, type JobInput } from '@/schemas/job.schema'
import { createRoofSchema, type CreateRoofInput } from '@/schemas/roof.schema'
import {
  type CreateMezzanineInput,
  mezzanineFloorSchema,
  mezzanineFloorExtensionSchema,
} from '@/schemas/mezzanine.schema'
import {
  type CreateStairInput,
  stairItemSchema,
  areaDeductionSchema,
} from '@/schemas/stair.schema'
import {
  type CreateCanopyInput,
  canopyItemSchema,
} from '@/schemas/canopy.schema'
import { STEP_COUNT } from '@/components/quotation/steps'

/** Step 1 project info — the canonical job contract (see job.schema.ts). */
export type ProjectInfo = JobInput

/**
 * Step 2 roof draft. Mirrors the roof create contract but lets the required
 * `roofFrameBaseFixing` enum start unselected (`''`) so the Select renders empty
 * and validation flags it, exactly like the Step 1 string fields.
 *
 * The structural section fields are now required in `createRoofSchema` (the
 * Step 2 form forces the user to complete them), but the draft must still be
 * able to hold them as `undefined` — while the user is filling the form, and
 * when a section is toggled off (which clears its fields). So the draft keeps
 * every non-core field optional; required-ness is enforced at validate time by
 * `createRoofSchema.safeParse`.
 */
type RoofCoreField =
  | 'buildingOverallLength'
  | 'buildingOverallWidth'
  | 'eaveHeight'
  | 'roofSlope'
  | 'mainRoofFrames'
  | 'endRoofFrames'
  | 'roofPurlinSpacing'
  | 'claddingPurlins'
  | 'internalColumnsForMainRoofFrames'
  | 'internalColumnsForEndRoofFrames'
  | 'roofFrameBaseFixing'

/** Section fields the draft keeps optional (cleared when a section is disabled). */
type RoofSectionField = Exclude<keyof CreateRoofInput, RoofCoreField>

export type RoofDraft = Omit<CreateRoofInput, 'roofFrameBaseFixing' | RoofSectionField> &
  Partial<Pick<CreateRoofInput, RoofSectionField>> & {
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
  | 'materialConsumption'
  | 'sagRod'
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
  materialConsumption: ['materialConsumptionExcludingPurlin'],
  sagRod: ['DiaOfRoofSagRod', 'DiaOfCladdingSagRod'],
  sidewalls: ['sidewalls'],
}

/**
 * Step 3 mezzanine draft rows. Both the floor and extension element types come
 * straight from the Zod schema (every field optional), so the draft can hold a
 * partially-filled row exactly as the create/upsert payload accepts it.
 */
export type MezzanineFloorDraft = z.infer<typeof mezzanineFloorSchema>
export type MezzanineExtensionDraft = z.infer<typeof mezzanineFloorExtensionSchema>

/** The Step 3 mezzanine draft: inline floors and extensions, both optional. */
export interface MezzanineDraft {
  floors: MezzanineFloorDraft[]
  extensions: MezzanineExtensionDraft[]
}

/**
 * Step 4 stair draft rows. Both element types come straight from the Zod
 * schema (every field optional), so the draft can hold a partially-filled row
 * exactly as the create/upsert payload accepts it.
 */
export type StairItemDraft = z.infer<typeof stairItemSchema>
export type AreaDeductionDraft = z.infer<typeof areaDeductionSchema>

/** The Step 4 stair draft: inline staircases and area deductions, both optional. */
export interface StairDraft {
  stairs: StairItemDraft[]
  areaDeductions: AreaDeductionDraft[]
}

/**
 * Step 5 canopy draft rows. Each item comes straight from the Zod schema
 * (every field optional), so the draft can hold a partially-filled row.
 */
export type CanopyItemDraft = z.infer<typeof canopyItemSchema>

/** The Step 5 canopy draft: inline canopy items, optional. */
export interface CanopyDraft {
  canopies: CanopyItemDraft[]
}

interface QuotationState {
  currentStep: number
  projectInfo: ProjectInfo
  roof: RoofDraft
  roofSectionsEnabled: RoofSectionsEnabled
  mezzanine: MezzanineDraft
  hasMezzanine: boolean
  stair: StairDraft
  hasStair: boolean
  canopy: CanopyDraft
  hasCanopy: boolean
  showValidation: boolean
  jobId: string | null
  setProjectInfo: (v: Partial<ProjectInfo>) => void
  setRoof: (v: Partial<RoofDraft>) => void
  toggleRoofSection: (key: RoofSectionKey, enabled: boolean) => void
  setMezzanine: (v: Partial<MezzanineDraft>) => void
  setHasMezzanine: (enabled: boolean) => void
  setStair: (v: Partial<StairDraft>) => void
  setHasStair: (enabled: boolean) => void
  setCanopy: (v: Partial<CanopyDraft>) => void
  setHasCanopy: (enabled: boolean) => void
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
  materialConsumption: false,
  sagRod: false,
  sidewalls: false,
})

/** Factory for a fresh mezzanine draft — no floors or extensions to start. */
const createDefaultMezzanine = (): MezzanineDraft => ({ floors: [], extensions: [] })

/** Factory for a fresh stair draft — no staircases or area deductions to start. */
const createDefaultStair = (): StairDraft => ({ stairs: [], areaDeductions: [] })

/** Factory for a fresh canopy draft — no canopy items to start. */
const createDefaultCanopy = (): CanopyDraft => ({ canopies: [] })

export const useQuotationStore = create<QuotationState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      showValidation: false,
      jobId: null,
      projectInfo: createDefaultProjectInfo(),
      roof: createDefaultRoof(),
      roofSectionsEnabled: createDefaultRoofSections(),
      mezzanine: createDefaultMezzanine(),
      hasMezzanine: false,
      stair: createDefaultStair(),
      hasStair: false,
      canopy: createDefaultCanopy(),
      hasCanopy: false,

      setProjectInfo: (v) => set((s) => ({ projectInfo: { ...s.projectInfo, ...v } })),

      // `sideColumnsWidthHeight`, `sideColumnsMidFrameCount` and
      // `sideColumnsEndFrameCount` are derived, never user-entered: recompute
      // them on every patch. The width/height stays in sync with
      // eaveHeight/roofSlope/claddingExt; the mid/end counts simply mirror
      // `claddingExtensionMidFrameCount` / `claddingExtensionEndFrameCount`.
      setRoof: (v) =>
        set((s) => {
          const roof = { ...s.roof, ...v }
          roof.sideColumnsWidthHeight = deriveSideColumnsWidthHeight(roof)
          roof.sideColumnsMidFrameCount = roof.claddingExtensionMidFrameCount
          roof.sideColumnsEndFrameCount = roof.claddingExtensionEndFrameCount
          return { roof }
        }),

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

      setMezzanine: (v) => set((s) => ({ mezzanine: { ...s.mezzanine, ...v } })),

      // Turning the toggle off clears any rows so an empty mezzanine drops from
      // the payload (and the WizardActionBar deletes the server record).
      setHasMezzanine: (enabled) =>
        set(() => (enabled ? { hasMezzanine: true } : { hasMezzanine: false, mezzanine: createDefaultMezzanine() })),

      setStair: (v) => set((s) => ({ stair: { ...s.stair, ...v } })),

      // Turning the toggle off clears any rows so an empty stair drops from the
      // payload (and the WizardActionBar deletes the server record).
      setHasStair: (enabled) =>
        set(() => (enabled ? { hasStair: true } : { hasStair: false, stair: createDefaultStair() })),

      setCanopy: (v) => set((s) => ({ canopy: { ...s.canopy, ...v } })),

      // Turning the toggle off clears any rows so an empty canopy drops from the
      // payload (and the WizardActionBar deletes the server record).
      setHasCanopy: (enabled) =>
        set(() => (enabled ? { hasCanopy: true } : { hasCanopy: false, canopy: createDefaultCanopy() })),

      setJobId: (id) => set({ jobId: id }),

      resetQuotation: () => set({
        currentStep: 1,
        showValidation: false,
        jobId: null,
        projectInfo: createDefaultProjectInfo(),
        roof: createDefaultRoof(),
        roofSectionsEnabled: createDefaultRoofSections(),
        mezzanine: createDefaultMezzanine(),
        hasMezzanine: false,
        stair: createDefaultStair(),
        hasStair: false,
        canopy: createDefaultCanopy(),
        hasCanopy: false,
      }),

      validateStep: (n) => {
        const s = get()
        if (n === 1) return jobSchema.safeParse(s.projectInfo).success
        if (n === 2) return createRoofSchema.safeParse(s.roof).success
        return true
      },

      goStep: (n) => { if (n >= 1 && n <= STEP_COUNT) set({ currentStep: n, showValidation: false }) },

      nextStep: () => {
        const s = get()
        if (!s.validateStep(s.currentStep)) { set({ showValidation: true }); return false }
        if (s.currentStep < STEP_COUNT) set({ currentStep: s.currentStep + 1, showValidation: false })
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
      partialize: (s) => ({ projectInfo: s.projectInfo, roof: s.roof, roofSectionsEnabled: s.roofSectionsEnabled, mezzanine: s.mezzanine, hasMezzanine: s.hasMezzanine, stair: s.stair, hasStair: s.hasStair, canopy: s.canopy, hasCanopy: s.hasCanopy, currentStep: s.currentStep, jobId: s.jobId }),
    }
  )
)


/**
 * Derives the Side Columns Width / Height from the eave height, roof slope
 * (in degrees) and cladding extension width/height. This field is no longer a
 * user input — it is computed and persisted.
 *
 * Returns `undefined` while `claddingExtensionWidthHeight` is blank (so the
 * read-only display stays empty), `0` when the cladding extension is `0`, and
 * otherwise `eaveHeight − claddingExt × tan(roofSlope)` clamped to `0` and
 * rounded to 3 decimals (matching the `Decimal(10,3)` column).
 */
export function deriveSideColumnsWidthHeight(
  roof: Pick<RoofDraft, 'eaveHeight' | 'roofSlope' | 'claddingExtensionWidthHeight'>,
): number | undefined {
  const { eaveHeight, roofSlope, claddingExtensionWidthHeight } = roof
  if (claddingExtensionWidthHeight === undefined || eaveHeight === undefined || roofSlope === undefined) {
    return undefined
  }
  if (claddingExtensionWidthHeight === 0) return 0
  const raw = eaveHeight - claddingExtensionWidthHeight * Math.tan((roofSlope * Math.PI) / 180)
  return Math.max(0, Math.round(raw * 1000) / 1000)
}

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

/** Drops `undefined`-valued keys from a draft row, yielding a clean partial. */
function compactRow<T extends Record<string, unknown>>(row: T): Partial<T> {
  return Object.fromEntries(Object.entries(row).filter(([, v]) => v !== undefined)) as Partial<T>
}

/**
 * Builds the mezzanine create/upsert payload from the Step 3 draft.
 *
 * Each floor/extension row is compacted (blank `undefined` fields dropped) and
 * fully-empty rows are removed; an empty `floors`/`extensions` array is omitted
 * entirely. Call this only for the upsert path (i.e. when the job has a
 * mezzanine) — an empty mezzanine should be deleted, not upserted.
 */
export function buildMezzaninePayload(mezzanine: MezzanineDraft): CreateMezzanineInput {
  const floors = mezzanine.floors.map(compactRow).filter((r) => Object.keys(r).length > 0)
  const extensions = mezzanine.extensions.map(compactRow).filter((r) => Object.keys(r).length > 0)

  const payload: CreateMezzanineInput = {}
  if (floors.length > 0) payload.floors = floors
  if (extensions.length > 0) payload.extensions = extensions
  return payload
}

/**
 * Builds the stair create/upsert payload from the Step 4 draft.
 *
 * Each stair/area-deduction row is compacted (blank `undefined` fields dropped)
 * and fully-empty rows are removed; an empty `stairs`/`areaDeductions` array is
 * omitted entirely. Call this only for the upsert path (i.e. when the job has a
 * stair) — an empty stair should be deleted, not upserted.
 */
export function buildStairPayload(stair: StairDraft): CreateStairInput {
  const stairs = stair.stairs.map(compactRow).filter((r) => Object.keys(r).length > 0)
  const areaDeductions = stair.areaDeductions.map(compactRow).filter((r) => Object.keys(r).length > 0)

  const payload: CreateStairInput = {}
  if (stairs.length > 0) payload.stairs = stairs
  if (areaDeductions.length > 0) payload.areaDeductions = areaDeductions
  return payload
}

/**
 * Builds the canopy create/upsert payload from the Step 5 draft.
 *
 * Each canopy item row is compacted (blank `undefined` fields dropped) and
 * fully-empty rows are removed; an empty `canopies` array is omitted entirely.
 * Call this only for the upsert path (i.e. when the job has a canopy) — an
 * empty canopy should be deleted, not upserted.
 */
export function buildCanopyPayload(canopy: CanopyDraft): CreateCanopyInput {
  const canopies = canopy.canopies.map(compactRow).filter((r) => Object.keys(r).length > 0)
  const payload: CreateCanopyInput = {}
  if (canopies.length > 0) payload.canopies = canopies
  return payload
}