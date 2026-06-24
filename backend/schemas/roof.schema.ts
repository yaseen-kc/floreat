/**
 * Zod validation schemas for Roof API request payloads.
 * Handles the flat Roof model plus inline sidewalls array.
 */
import { z } from 'zod'

/** Valid sides for a sidewall panel. */
const sideWallSideEnum = z.enum(['FRONT', 'BACK', 'RIGHT', 'LEFT'])

/** Valid wall construction types. */
const typeOfWallEnum = z.enum(['BRICK', 'PANEL', 'LATERITE', 'AAC', 'BLOCK'])

/** Valid purlin material types. */
const purlinMaterialTypeEnum = z.enum(['Z_C', 'TUBE'])

/** Valid wind bracing types. */
const typeOfWindBracingEnum = z.enum(['ROD', 'TUBE'])

/** Valid roof/cladding covering types. */
const coveringTypeEnum = z.enum(['BARE_GALVALUME', 'PPGL', 'PUFF_SHEET', 'OTHER'])

/** Valid roof frame base fixing methods. */
const roofFrameBaseFixingEnum = z.enum(['FOUNDATION_BOLT', 'ANCHOR_BOLT', 'JOINT_BOLT_ON_STEEL_COLUMN'])

/** Valid plate material grades. */
const plateMaterialGradeEnum = z.enum(['FE_345', 'FE_250', 'FE_400'])

/** Schema for an individual sidewall entry. */
export const sidewallSchema = z.object({
  side: sideWallSideEnum,
  wallType: typeOfWallEnum,
  thickness: z.number().positive(),
  height: z.number().positive(),
})

/** Schema for creating/upserting a roof — validates required core fields and optional sections. */
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
  // ponytail: `sideColumnsWidthHeight` is computed on the frontend and trusted
  // here (nonnegative only). Ceiling: a malicious/buggy client could send an
  // inconsistent value. Upgrade path: recompute it in roof.service from
  // eaveHeight/roofSlope/claddingExtensionWidthHeight before persisting.
  sideColumnsWidthHeight: z.number().nonnegative().optional(),
  // `sideColumnsMidFrameCount` and `sideColumnsEndFrameCount` are derived
  // server-side in roof.service to equal `claddingExtensionMidFrameCount` and
  // `claddingExtensionEndFrameCount` respectively (overwritten on upsert/update),
  // so the values accepted here are advisory only.
  sideColumnsMidFrameCount: z.number().int().nonnegative().optional(),
  sideColumnsEndFrameCount: z.number().int().nonnegative().optional(),

  // ── Optional material grade ──
  gradeOfPlateMaterial: plateMaterialGradeEnum.optional(),

  // ── Optional material consumption ──
  materialConsumptionExcludingPurlin: z.number().nonnegative().optional(),

  // ── Optional SAG rod ──
  DiaOfRoofSagRod: z.number().positive().optional(),
  DiaOfCladdingSagRod: z.number().positive().optional(),

  // ── Inline sidewalls ──
  sidewalls: z.array(sidewallSchema).optional(),
})

/** Schema for updating a roof — all fields optional (partial update). */
export const updateRoofSchema = createRoofSchema.partial()

/** Validated payload for creating/upserting a roof. */
export type CreateRoofInput = z.infer<typeof createRoofSchema>

/** Validated payload for updating a roof (all fields optional). */
export type UpdateRoofInput = z.infer<typeof updateRoofSchema>

/** Schema for pagination query params with sensible defaults. */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
})
