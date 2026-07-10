/**
 * Single source of truth for the Roof (quotation Step 2) request contract on
 * the frontend.
 *
 * Mirrors the backend `createRoofSchema` (backend/schemas/roof.schema.ts) for
 * the required core dimensions, structural sections, and the inline `sidewalls`
 * array. Numeric fields are typed as `number` here (the create/upsert payload),
 * even though the `Roof` response serialises Prisma `Decimal` columns back as
 * `string`.
 *
 * NOTE: This frontend schema is intentionally STRICTER than the backend. Every
 * structural section field (members, purlins, coverings, flange brace,
 * polycarbonate, wind bracing, cladding openings, side extension, material
 * grade, material consumption, SAG rod) is required here so the Step 2 form
 * forces the user to complete them, even though the backend still accepts them
 * as optional. Only the Fascia Board fields and the inline `sidewalls` array
 * remain optional on the frontend.
 */
import { z } from 'zod'

/* ──────────────────────────────────────────────────────────────────────────
 * Enums — mirror the backend Prisma enums (string literals over the wire).
 * ────────────────────────────────────────────────────────────────────────── */

/** Which side of the building a sidewall belongs to. */
export const sideWallSideEnum = z.enum(['FRONT', 'BACK', 'RIGHT', 'LEFT'])

/** Sidewall construction type. */
export const typeOfWallEnum = z.enum(['BRICK', 'PANEL', 'LATERITE', 'AAC', 'BLOCK'])

/** Purlin material profile. */
export const purlinMaterialTypeEnum = z.enum(['Z_C', 'TUBE'])

/** Wind bracing member type. */
export const typeOfWindBracingEnum = z.enum(['ROD', 'TUBE'])

/** Roof/cladding covering material. */
export const coveringTypeEnum = z.enum(['BARE_GALVALUME', 'PPGL', 'PUFF_SHEET', 'OTHER'])

/** How the roof frame base is fixed to its support. */
export const roofFrameBaseFixingEnum = z.enum([
  'FOUNDATION_BOLT',
  'ANCHOR_BOLT',
  'JOINT_BOLT_ON_STEEL_COLUMN',
])

/** Structural plate material grade. */
export const plateMaterialGradeEnum = z.enum(['FE_345', 'FE_250', 'FE_400'])

/* ──────────────────────────────────────────────────────────────────────────
 * Sidewall — a single inline sidewall entry attached to a roof.
 * ────────────────────────────────────────────────────────────────────────── */

/** Schema for an individual sidewall entry. */
export const sidewallSchema = z.object({
  side: sideWallSideEnum,
  wallType: typeOfWallEnum,
  thickness: z.number().positive(),
  height: z.number().positive(),
})

/* ──────────────────────────────────────────────────────────────────────────
 * Roof create/upsert payload.
 * ────────────────────────────────────────────────────────────────────────── */

/** Schema for creating/upserting a roof — required core fields + sections. */
export const createRoofSchema = z.object({
  // ── Required core dimensions ──
  buildingOverallLength: z.number().positive(),
  buildingOverallWidth: z.number().positive(),
  eaveHeight: z.number().positive(),
  roofSlope: z.number().positive(),
  mainRoofFrames: z.number().int().positive(),
  endRoofFrames: z.number().int().positive(),
  roofPurlinSpacing: z.number().positive(),
  claddingPurlins: z.number().int().nonnegative(),
  internalColumnsForMainRoofFrames: z.number().int().nonnegative(),
  internalColumnsForEndRoofFrames: z.number().int().nonnegative(),
  roofFrameBaseFixing: roofFrameBaseFixingEnum,

  // ── members ──
  columnSegmentsInMainFrame: z.number().int().nonnegative(),
  raftersInOneHalfOfMainFrame: z.number().int().nonnegative(),
  columnSegmentsInEndFrame: z.number().int().nonnegative(),
  raftersInOneHalfOfEndFrame: z.number().int().nonnegative(),
  endFrameHorizontalTieBeam: z.number().int().nonnegative(),

  // ── purlin ──
  roofPurlinType: purlinMaterialTypeEnum,
  roofPurlinDepth: z.number().positive(),
  roofPurlinUnitWeight: z.number().positive(),
  claddingPurlinType: purlinMaterialTypeEnum,
  claddingPurlinDepth: z.number().positive(),
  claddingPurlinUnitWeight: z.number().positive(),

  // ── covering ──
  roofCoveringType: coveringTypeEnum,
  roofCoveringThickness: z.number().positive(),
  claddingCoveringType: coveringTypeEnum,
  claddingCoveringThickness: z.number().positive(),
  roofAreaDeduction: z.number().nonnegative(),

  // ── flange brace ──
  roofFlangeBraceAverageLength: z.number().positive(),
  claddingFlangeBraceAverageLength: z.number().positive(),
  endFrameFlangeBraceAverageLength: z.number().positive(),

  // ── polycarbonate ──
  polycarbonateRoofLength: z.number().positive(),
  polycarbonateRoofWidth: z.number().positive(),
  polycarbonateRoofCount: z.number().int().nonnegative(),

  // ── wind bracing ──
  roofWindBracingSegmentsInOneHalf: z.number().int().nonnegative(),
  columnWindBracingSegments: z.number().int().nonnegative(),
  roofWindBracingProvidedBays: z.number().int().nonnegative(),
  columnWindBracingProvidedBays: z.number().int().nonnegative(),
  windBracingColumnHeight: z.number().positive(),
  windBracingUnitWeight: z.number().positive(),
  roofWindBracingBaySpacing: z.number().positive(),
  columnWindBracingBaySpacing: z.number().positive(),
  roofWindBracingLength: z.number().positive(),
  columnWindBracingLength: z.number().positive(),
  windBracingType: typeOfWindBracingEnum,

  // ── cladding opening ──
  frontCladdingOpeningArea: z.number().nonnegative(),
  backCladdingOpeningArea: z.number().nonnegative(),
  rightCladdingOpeningArea: z.number().nonnegative(),
  leftCladdingOpeningArea: z.number().nonnegative(),

  // ── fascia board (optional — excluded from the required set) ──
  fasciaBoardArea: z.number().nonnegative().optional(),
  fasciaMaterialWeightPerSqft: z.number().positive().optional(),

  // ── side extension ──
  roofExtensionWidthHeight: z.number().positive(),
  roofExtensionMidFrameCount: z.number().int().nonnegative(),
  roofExtensionEndFrameCount: z.number().int().nonnegative(),
  claddingExtensionWidthHeight: z.number().positive(),
  claddingExtensionMidFrameCount: z.number().int().nonnegative(),
  claddingExtensionEndFrameCount: z.number().int().nonnegative(),
  sideColumnsWidthHeight: z.number().nonnegative(),
  sideColumnsMidFrameCount: z.number().int().nonnegative(),
  sideColumnsEndFrameCount: z.number().int().nonnegative(),

  // ── material grade ──
  gradeOfPlateMaterial: plateMaterialGradeEnum,

  // ── material consumption ──
  materialConsumptionExcludingPurlin: z.number().nonnegative(),

  // ── SAG rod ──
  diaOfRoofSagRod: z.number().positive(),
  diaOfCladdingSagRod: z.number().positive(),

  // ── Inline sidewalls (optional — excluded from the required set) ──
  sidewalls: z.array(sidewallSchema).optional(),
})

/** Validated payload for creating/upserting a roof. */
export type CreateRoofInput = z.infer<typeof createRoofSchema>

/** A field key of the roof create/upsert contract. */
export type RoofField = keyof CreateRoofInput

/**
 * Returns true when a field is required (i.e. an `undefined` value is rejected).
 * Derived from the schema so the form's required markers can't drift — the core
 * dimensions report `true`, every `.optional()` section field reports `false`.
 */
export function isRequired(field: RoofField): boolean {
  return !createRoofSchema.shape[field].safeParse(undefined).success
}

/**
 * Validates `input` and returns a map of field -> first error message.
 * Returns an empty object when the input is valid.
 */
export function getFieldErrors(input: unknown): Partial<Record<RoofField, string>> {
  const result = createRoofSchema.safeParse(input)
  if (result.success) return {}

  const errors: Partial<Record<RoofField, string>> = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0] as RoofField | undefined
    if (key && !errors[key]) errors[key] = issue.message
  }
  return errors
}
