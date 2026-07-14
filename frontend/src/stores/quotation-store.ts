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
import { type CreateLoadInput } from '@/schemas/load.schema'
import { type CreateSpecInput } from '@/schemas/spec.schema'
import {
  type CreateAccessoriesInput,
  accessoryDoorSchema,
  accessoryWindowSchema,
  accessoryFoldedPlateSchema,
  accessoryOpeningSchema,
} from '@/schemas/accessories.schema'
import {
  type CreateJointInput,
  jointBoltRoofItemSchema,
  jointBoltMezzanineItemSchema,
  foundationBoltRoofItemSchema,
  roofJointIdEnum,
  mezzanineJointIdEnum,
  foundationBoltJointIdEnum,
} from '@/schemas/joint.schema'
import { deriveSideColumnsWidthHeight, deriveJointBolts } from '@floreat/shared/calc'
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
  sagRod: ['diaOfRoofSagRod', 'diaOfCladdingSagRod'],
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

/**
 * Step 7 load draft. Load is a flat, 1:1-per-job resource with NO child arrays,
 * and the schema is entirely optional — so the draft is just the create input.
 * Every field can be left blank and is dropped from the payload by
 * {@link buildLoadPayload}.
 */
export type LoadDraft = CreateLoadInput

/**
 * Step 6 accessory line-item draft rows. Each comes straight from the Zod item
 * schema minus the server-derived `quantity` (recomputed on write), so the
 * draft holds only user-entered fields. Opening `kind` is optional in the draft
 * (a freshly-added row has no kind yet) even though the wire schema requires it.
 */
export type AccessoryDoorDraft = Omit<z.infer<typeof accessoryDoorSchema>, 'quantity'>
export type AccessoryWindowDraft = Omit<z.infer<typeof accessoryWindowSchema>, 'quantity'>
export type AccessoryFoldedPlateDraft = Omit<z.infer<typeof accessoryFoldedPlateSchema>, 'quantity'>
export type AccessoryOpeningDraft = Omit<z.infer<typeof accessoryOpeningSchema>, 'quantity' | 'kind'> & {
  kind?: z.infer<typeof accessoryOpeningSchema>['kind']
}

/**
 * The Step 6 accessories draft. Accessories is a flat, always-on 1:1-per-job
 * resource: every scalar/enum field is optional (mirrors the create contract),
 * plus four always-present inline line-item arrays. The six `*Quantity` fields
 * are roof-derived previews by default — only sent when their `*Manual` flag is
 * set (see {@link buildAccessoriesPayload}).
 */
export type AccessoriesDraft = Omit<
  CreateAccessoriesInput,
  'doors' | 'windows' | 'foldedPlates' | 'openings'
> & {
  doors: AccessoryDoorDraft[]
  windows: AccessoryWindowDraft[]
  foldedPlates: AccessoryFoldedPlateDraft[]
  openings: AccessoryOpeningDraft[]
}

/**
 * Step 8 joint bolt-spec draft rows. Each item type comes straight from the
 * shared Zod schema (every non-id field optional), so a row can hold a partial
 * bolt spec exactly as the create/upsert payload accepts it. The three arrays
 * are pre-seeded with one blank row per enum member (see {@link createDefaultJoint})
 * so every joint code has a stable, addressable input row for the interactive
 * diagrams; blank rows are dropped by {@link buildJointPayload}.
 */
export type JointBoltRoofDraft = z.infer<typeof jointBoltRoofItemSchema>
export type JointBoltMezzanineDraft = z.infer<typeof jointBoltMezzanineItemSchema>
export type FoundationBoltRoofDraft = z.infer<typeof foundationBoltRoofItemSchema>

/**
 * The Step 8 joint draft. Joint is a flat, always-on 1:1-per-job resource: the
 * shared diameter and four scalar bolt groups are optional (mirrors the create
 * contract), plus three always-present inline arrays keyed by closed joint-id
 * enums (roof joints, mezzanine joints, foundation bolts).
 */
export type JointDraft = Omit<
  CreateJointInput,
  'jointBoltRoof' | 'jointBoltMezzanine' | 'foundationBoltRoof'
> & {
  jointBoltRoof: JointBoltRoofDraft[]
  jointBoltMezzanine: JointBoltMezzanineDraft[]
  foundationBoltRoof: FoundationBoltRoofDraft[]
}

/**
 * Step 9 spec draft. Spec is a flat, always-on 1:1-per-job resource with NO
 * child arrays and an entirely optional schema (a description, two string-list
 * fields and a yield-strength number) — so the draft is just the create input.
 * Every field can be left blank and is dropped from the payload by
 * {@link buildSpecPayload}.
 */
export type SpecDraft = CreateSpecInput

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
  load: LoadDraft
  accessories: AccessoriesDraft
  joint: JointDraft
  spec: SpecDraft
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
  setLoad: (v: Partial<LoadDraft>) => void
  setAccessories: (v: Partial<AccessoriesDraft>) => void
  setJoint: (v: Partial<JointDraft>) => void
  setSpec: (v: Partial<SpecDraft>) => void
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

/** Factory for a fresh load draft — every field blank (the schema is all-optional). */
const createDefaultLoad = (): LoadDraft => ({})

/** Factory for a fresh accessories draft — every scalar blank, all four arrays empty. */
const createDefaultAccessories = (): AccessoriesDraft => ({
  doors: [],
  windows: [],
  foldedPlates: [],
  openings: [],
})

/**
 * Factory for a fresh joint draft. Every scalar bolt field starts blank, and
 * each of the three inline arrays is seeded with one blank row per enum member
 * (carrying only its id) so every joint code has a stable, addressable input
 * row for the interactive frame diagrams. Blank rows are dropped from the
 * payload by {@link buildJointPayload}.
 */
const createDefaultJoint = (): JointDraft => ({
  jointBoltRoof: roofJointIdEnum.options.map((roofJointId) => ({ roofJointId })),
  jointBoltMezzanine: mezzanineJointIdEnum.options.map((mezzanineJointId) => ({ mezzanineJointId })),
  foundationBoltRoof: foundationBoltJointIdEnum.options.map((foundationJointId) => ({ foundationJointId })),
})

/** Factory for a fresh spec draft — every field blank (the schema is all-optional). */
const createDefaultSpec = (): SpecDraft => ({})

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
      load: createDefaultLoad(),
      accessories: createDefaultAccessories(),
      joint: createDefaultJoint(),
      spec: createDefaultSpec(),

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

      // Load is always-on (no toggle): blank fields are simply dropped from the
      // payload by buildLoadPayload at save time.
      setLoad: (v) => set((s) => ({ load: { ...s.load, ...v } })),

      // Accessories is always-on (no toggle), like Load: blank fields are
      // dropped from the payload by buildAccessoriesPayload at save time.
      setAccessories: (v) => set((s) => ({ accessories: { ...s.accessories, ...v } })),

      // Joint is always-on (no toggle), like Load/Accessories: blank scalars and
      // blank (id-only) array rows are dropped by buildJointPayload at save time.
      // The roof & mezzanine bolt arrays are interdependent (diameter follows
      // Joint A; roof E mirrors D; F/J fixed at 4/8; mezz N/R mirror M/Q), so
      // re-derive both on every patch — a live-preview mirror of the
      // backend-authoritative rule (see @floreat/shared/calc `deriveJointBolts`).
      setJoint: (v) =>
        set((s) => {
          const joint = { ...s.joint, ...v }
          const derived = deriveJointBolts(joint.jointBoltRoof, joint.jointBoltMezzanine)
          return {
            joint: {
              ...joint,
              jointBoltRoof: derived.jointBoltRoof as JointBoltRoofDraft[],
              jointBoltMezzanine: derived.jointBoltMezzanine as JointBoltMezzanineDraft[],
            },
          }
        }),

      // Spec is always-on (no toggle), like Load/Accessories/Joint: blank fields
      // are dropped from the payload by buildSpecPayload at save time.
      setSpec: (v) => set((s) => ({ spec: { ...s.spec, ...v } })),

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
        load: createDefaultLoad(),
        accessories: createDefaultAccessories(),
        joint: createDefaultJoint(),
        spec: createDefaultSpec(),
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
      name: 'Floreat:draft',
      version: 1,
      // The draft is hydrated manually (see useDraftPersistenceScope) once the
      // Clerk user id is known, so the storage key can be namespaced per user
      // (`Floreat:draft:<userId>`). This keeps each user's draft — including the
      // server `jobId` — isolated on shared machines, while still letting an
      // in-progress job resume (and re-use PUT) after a refresh instead of
      // creating a duplicate.
      skipHydration: true,
      partialize: (s) => ({ projectInfo: s.projectInfo, roof: s.roof, roofSectionsEnabled: s.roofSectionsEnabled, mezzanine: s.mezzanine, hasMezzanine: s.hasMezzanine, stair: s.stair, hasStair: s.hasStair, canopy: s.canopy, hasCanopy: s.hasCanopy, load: s.load, accessories: s.accessories, joint: s.joint, spec: s.spec, currentStep: s.currentStep, jobId: s.jobId }),
    }
  )
)


/**
 * The authoritative Side Columns Width / Height derivation now lives in
 * `@floreat/shared/calc` (the backend recomputes it on write). It is imported
 * above for `setRoof`'s live preview and re-exported here so existing store
 * consumers keep importing it from `@/stores/quotation-store`.
 */
export { deriveSideColumnsWidthHeight }

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

/**
 * Builds the load create/upsert payload from the Step 7 draft.
 *
 * Load is a flat resource with an all-optional schema, so this just drops every
 * blank (`undefined`) field. An entirely blank draft yields `{}` — which the
 * backend accepts (the always-on form upserts whatever the user provided).
 */
export function buildLoadPayload(load: LoadDraft): CreateLoadInput {
  return compactRow(load) as CreateLoadInput
}

/** The six roof-derived quantity fields; each is only sent when its `*Manual` flag is set. */
const ACCESSORY_QUANTITY_FIELDS = [
  'gutterQuantity',
  'downTakeQuantity',
  'dripTrimQuantity',
  'gableEndFlashingQuantity',
  'cornerFlashQuantity',
  'ridgeQuantity',
] as const

/**
 * Builds the accessories create/upsert payload from the Step 6 draft.
 *
 * Blank (`undefined`) scalar fields are dropped. Each of the six `*Quantity`
 * fields is roof-derived server-side, so its value is dropped UNLESS its
 * companion `*Manual` flag is `true` (a user override) — in which case the
 * value and the flag are both kept. Each line-item row is compacted and
 * fully-empty rows are removed (openings additionally require a `kind`); an
 * empty array is omitted entirely. Line-item `quantity` is server-derived and
 * never part of the draft. An entirely blank draft yields `{}`.
 */
export function buildAccessoriesPayload(accessories: AccessoriesDraft): CreateAccessoriesInput {
  const { doors, windows, foldedPlates, openings, ...scalars } = accessories

  const scalarsClean = { ...scalars } as Record<string, unknown>
  for (const field of ACCESSORY_QUANTITY_FIELDS) {
    if (scalarsClean[`${field}Manual`] !== true) delete scalarsClean[field]
  }

  const payload = compactRow(scalarsClean) as CreateAccessoriesInput

  const cleanDoors = doors.map(compactRow).filter((r) => Object.keys(r).length > 0)
  const cleanWindows = windows.map(compactRow).filter((r) => Object.keys(r).length > 0)
  const cleanFoldedPlates = foldedPlates.map(compactRow).filter((r) => Object.keys(r).length > 0)
  // An opening is meaningless without its (schema-required) `kind`.
  const cleanOpenings = openings.map(compactRow).filter((r) => r.kind !== undefined)

  if (cleanDoors.length > 0) payload.doors = cleanDoors
  if (cleanWindows.length > 0) payload.windows = cleanWindows
  if (cleanFoldedPlates.length > 0) payload.foldedPlates = cleanFoldedPlates
  if (cleanOpenings.length > 0) payload.openings = cleanOpenings as CreateAccessoriesInput['openings']

  return payload
}

/**
 * Builds the joint create/upsert payload from the Step 8 draft.
 *
 * Joint is a flat, always-on resource with an all-optional scalar schema, so
 * blank (`undefined`) scalar fields are dropped. Each of the three inline
 * arrays is compacted per row; a row that keeps only its id field (no
 * diameter/count) is a blank placeholder and is removed, and an all-blank array
 * is omitted entirely. An entirely blank draft yields `{}` — which the backend
 * accepts (the always-on form upserts whatever the user provided).
 */
export function buildJointPayload(joint: JointDraft): CreateJointInput {
  const { jointBoltRoof, jointBoltMezzanine, foundationBoltRoof, ...scalars } = joint

  const payload = compactRow(scalars) as CreateJointInput

  // A row is meaningful only when it carries a value beyond its id enum field.
  const roof = jointBoltRoof.map(compactRow).filter((r) => 'boltDiameter' in r || 'numberOfBolts' in r)
  const mezz = jointBoltMezzanine.map(compactRow).filter((r) => 'boltDiameter' in r || 'numberOfBolts' in r)
  const foundation = foundationBoltRoof.map(compactRow).filter((r) => 'boltDiameter' in r || 'numberOfBolts' in r)

  if (roof.length > 0) payload.jointBoltRoof = roof as CreateJointInput['jointBoltRoof']
  if (mezz.length > 0) payload.jointBoltMezzanine = mezz as CreateJointInput['jointBoltMezzanine']
  if (foundation.length > 0) payload.foundationBoltRoof = foundation as CreateJointInput['foundationBoltRoof']

  return payload
}

/**
 * Builds the spec create/upsert payload from the Step 9 draft.
 *
 * Spec is a flat, always-on resource with an all-optional schema. A blank
 * `description` (empty/whitespace) is dropped; each string-list field
 * (`specifications`, `makeOrBrand`) is trimmed and blank entries removed, and an
 * empty list is omitted entirely; `yieldStrengthMpa` is dropped when blank.
 * An entirely blank draft yields `{}` — which the backend accepts (the always-on
 * form upserts whatever the user provided).
 */
export function buildSpecPayload(spec: SpecDraft): CreateSpecInput {
  const payload: CreateSpecInput = {}

  const description = spec.description?.trim()
  if (description) payload.description = description

  const specifications = (spec.specifications ?? []).map((s) => s.trim()).filter(Boolean)
  if (specifications.length > 0) payload.specifications = specifications

  const makeOrBrand = (spec.makeOrBrand ?? []).map((s) => s.trim()).filter(Boolean)
  if (makeOrBrand.length > 0) payload.makeOrBrand = makeOrBrand

  if (spec.yieldStrengthMpa !== undefined) payload.yieldStrengthMpa = spec.yieldStrengthMpa

  return payload
}