/**
 * Canonical Roof **wire** contract shared by the Floreat frontend and backend:
 * the flat Roof model plus the inline `sidewalls[]` array. Required core
 * dimensions; every structural section is optional so partial/draft roofs can
 * be persisted.
 *
 * NOTE: the frontend Step 2 form uses a *stricter* schema (most sections
 * required) built in `frontend/src/schemas/roof.schema.ts`, which imports these
 * enums. This module is the contract the server accepts.
 *
 * Numeric fields are typed as `number` (create/upsert payload); the `Roof` HTTP
 * response serialises Prisma `Decimal` columns back as `string`.
 */
import { z } from 'zod'

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
export const roofFrameBaseFixingEnum = z.enum(['FOUNDATION_BOLT', 'ANCHOR_BOLT', 'JOINT_BOLT_ON_STEEL_COLUMN'])

/** Structural plate material grade. */
export const plateMaterialGradeEnum = z.enum(['FE_345', 'FE_250', 'FE_400'])

/** Schema for an individual sidewall entry. */
export const sidewallSchema = z.object({
  side: sideWallSideEnum,
  wallType: typeOfWallEnum,
  thickness: z.number().positive(),
  height: z.number().positive(),
})

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
  // Optional (nullable column) so partial/draft roofs can be saved before the
  // base-fixing method is chosen. The frontend keeps it required in its form.
  roofFrameBaseFixing: roofFrameBaseFixingEnum.optional(),

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
  // `sideColumnsWidthHeight` is recomputed authoritatively in the backend
  // roof.service from eaveHeight / roofSlope / claddingExtensionWidthHeight
  // (see @floreat/shared/calc). Any value accepted here is advisory only.
  sideColumnsWidthHeight: z.number().nonnegative().optional(),
  // `sideColumnsMidFrameCount` and `sideColumnsEndFrameCount` are derived
  // server-side to equal `claddingExtensionMidFrameCount` and
  // `claddingExtensionEndFrameCount` respectively (overwritten on upsert/update).
  sideColumnsMidFrameCount: z.number().int().nonnegative().optional(),
  sideColumnsEndFrameCount: z.number().int().nonnegative().optional(),

  // ── Optional material grade ──
  gradeOfPlateMaterial: plateMaterialGradeEnum.optional(),

  // ── Optional material consumption ──
  materialConsumptionExcludingPurlin: z.number().nonnegative().optional(),

  // ── Optional SAG rod ──
  diaOfRoofSagRod: z.number().positive().optional(),
  diaOfCladdingSagRod: z.number().positive().optional(),

  // ── Inline sidewalls ──
  sidewalls: z.array(sidewallSchema).optional(),
})

/** Schema for updating a roof — all fields optional (partial update). */
export const updateRoofSchema = createRoofSchema.partial()

/** Validated payload for creating/upserting a roof. */
export type CreateRoofInput = z.infer<typeof createRoofSchema>

/** Validated payload for updating a roof (all fields optional). */
export type UpdateRoofInput = z.infer<typeof updateRoofSchema>
