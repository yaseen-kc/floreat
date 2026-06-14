/**
 * Single source of truth for the Roof (quotation Step 2) request contract on
 * the frontend.
 *
 * Mirrors the backend `createRoofSchema` (backend/schemas/roof.schema.ts) field
 * for field: required core dimensions, optional structural sections, and the
 * inline `sidewalls` array. Numeric fields are typed as `number` here (the
 * create/upsert payload), even though the `Roof` response serialises Prisma
 * `Decimal` columns back as `string`.
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

/** Schema for creating/upserting a roof — required core fields + optional sections. */
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

  // ── Optional members ──
  columnSegmentsInMainFrame: z.number().int().nonnegative().optional(),
  raftersInOneHalfOfMainFrame: z.number().int().nonnegative().optional(),
  columnSegmentsInEndFrame: z.number().int().nonnegative().optional(),
  raftersInOneHalfOfEndFrame: z.number().int().nonnegative().optional(),
  endFrameHorizontalTieBeam: z.number().int().nonnegative().optional(),

  // ── Optional purlin ──
  roofPurlinType: purlinMaterialTypeEnum.optional(),
  roofPurlinDepth: z.number().positive().optional(),
  roofPurlinUnitWeight: z.number().positive().optional(),
  claddingPurlinType: purlinMaterialTypeEnum.optional(),
  claddingPurlinDepth: z.number().positive().optional(),
  claddingPurlinUnitWeight: z.number().positive().optional(),

  // ── Optional covering ──
  roofCoveringType: coveringTypeEnum.optional(),
  roofCoveringThickness: z.number().positive().optional(),
  claddingCoveringType: coveringTypeEnum.optional(),
  claddingCoveringThickness: z.number().positive().optional(),
  roofAreaDeduction: z.number().nonnegative().optional(),

  // ── Optional flange brace ──
  roofFlangeBraceAverageLength: z.number().positive().optional(),
  claddingFlangeBraceAverageLength: z.number().positive().optional(),
  endFrameFlangeBraceAverageLength: z.number().positive().optional(),

  // ── Optional polycarbonate ──
  polycarbonateRoofLength: z.number().positive().optional(),
  polycarbonateRoofWidth: z.number().positive().optional(),
  polycarbonateRoofCount: z.number().int().nonnegative().optional(),

  // ── Optional wind bracing ──
  roofWindBracingSegmentsInOneHalf: z.number().int().nonnegative().optional(),
  columnWindBracingSegments: z.number().int().nonnegative().optional(),
  roofWindBracingProvidedBays: z.number().int().nonnegative().optional(),
  columnWindBracingProvidedBays: z.number().int().nonnegative().optional(),
  windBracingColumnHeight: z.number().positive().optional(),
  windBracingUnitWeight: z.number().positive().optional(),
  roofWindBracingBaySpacing: z.number().positive().optional(),
  columnWindBracingBaySpacing: z.number().positive().optional(),
  roofWindBracingLength: z.number().positive().optional(),
  columnWindBracingLength: z.number().positive().optional(),
  windBracingType: typeOfWindBracingEnum.optional(),

  // ── Optional cladding opening ──
  frontCladdingOpeningArea: z.number().nonnegative().optional(),
  backCladdingOpeningArea: z.number().nonnegative().optional(),
  rightCladdingOpeningArea: z.number().nonnegative().optional(),
  leftCladdingOpeningArea: z.number().nonnegative().optional(),

  // ── Optional fascia board ──
  fasciaBoardArea: z.number().nonnegative().optional(),
  fasciaMaterialWeightPerSqft: z.number().positive().optional(),

  // ── Optional side extension ──
  roofExtensionWidthHeight: z.number().positive().optional(),
  roofExtensionMidFrameCount: z.number().int().nonnegative().optional(),
  roofExtensionEndFrameCount: z.number().int().nonnegative().optional(),
  claddingExtensionWidthHeight: z.number().positive().optional(),
  claddingExtensionMidFrameCount: z.number().int().nonnegative().optional(),
  claddingExtensionEndFrameCount: z.number().int().nonnegative().optional(),
  sideColumnsWidthHeight: z.number().positive().optional(),
  sideColumnsMidFrameCount: z.number().int().nonnegative().optional(),
  sideColumnsEndFrameCount: z.number().int().nonnegative().optional(),

  // ── Optional material grade ──
  gradeOfPlateMaterial: plateMaterialGradeEnum.optional(),

  // ── Inline sidewalls ──
  sidewalls: z.array(sidewallSchema).optional(),
})

/** Validated payload for creating/upserting a roof. */
export type CreateRoofInput = z.infer<typeof createRoofSchema>
