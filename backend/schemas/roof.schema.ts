/**
 * Zod validation schemas for Roof API request payloads.
 * All Decimal DB fields use z.coerce.number(); enums use Prisma TS member names.
 */
import { z } from 'zod'

/** Top-level Roof creation schema. */
export const createRoofSchema = z.object({
  jobId: z.string().min(1),
  buildingOverallLength: z.coerce.number(),
  buildingOverallWidth: z.coerce.number(),
  eaveHeight: z.coerce.number(),
  roofSlope: z.coerce.number(),
  mainRoofFrames: z.number().int(),
  endRoofFrames: z.number().int(),
  roofPurlinSpacing: z.coerce.number(),
  claddingPurlins: z.number().int(),
  internalColumnsForMainRoofFrames: z.number().int(),
  internalColumnsForEndRoofFrames: z.number().int(),
  roofFrameBaseFixing: z.enum(['FOUNDATION_BOLT', 'ANCHOR_BOLT', 'JOINT_BOLT_ON_STEEL_COLUMN']),
})

/** Partial update schema for the top-level Roof. */
export const updateRoofSchema = createRoofSchema.partial()

/** RoofMember sub-section schema. */
export const roofMemberSchema = z.object({
  columnSegmentsInMainFrame: z.number().int(),
  raftersInOneHalfOfMainFrame: z.number().int(),
  columnSegmentsInEndFrame: z.number().int(),
  raftersInOneHalfOfEndFrame: z.number().int(),
  endFrameHorizontalTieBeam: z.number().int(),
})

/** RoofPurlin sub-section schema. */
export const roofPurlinSchema = z.object({
  roofPurlinType: z.enum(['Z_C', 'TUBE']),
  roofPurlinDepth: z.coerce.number(),
  roofPurlinUnitWeight: z.coerce.number(),
  claddingPurlinType: z.enum(['Z_C', 'TUBE']),
  claddingPurlinDepth: z.coerce.number(),
  claddingPurlinUnitWeight: z.coerce.number(),
})

/** Single sidewall schema. */
export const sidewallSchema = z.object({
  side: z.enum(['FRONT', 'BACK', 'RIGHT', 'LEFT']),
  wallType: z.enum(['BRICK', 'PANEL', 'LATERITE', 'AAC', 'BLOCK']),
  thickness: z.coerce.number(),
  height: z.coerce.number(),
})

/** RoofCovering sub-section schema. */
export const roofCoveringSchema = z.object({
  roofCoveringType: z.enum(['BARE_GALVALUME', 'PPGL', 'PUFF_SHEET', 'OTHER']),
  roofCoveringThickness: z.coerce.number(),
  claddingCoveringType: z.enum(['BARE_GALVALUME', 'PPGL', 'PUFF_SHEET', 'OTHER']),
  claddingCoveringThickness: z.coerce.number(),
  roofAreaDeduction: z.coerce.number(),
})

/** RoofFlangeBrace sub-section schema. */
export const roofFlangeBraceSchema = z.object({
  roofFlangeBraceAverageLength: z.coerce.number(),
  claddingFlangeBraceAverageLength: z.coerce.number(),
  endFrameFlangeBraceAverageLength: z.coerce.number(),
})

/** RoofPolycarbonate sub-section schema. */
export const roofPolycarbonateSchema = z.object({
  polycarbonateRoofLength: z.coerce.number(),
  polycarbonateRoofWidth: z.coerce.number(),
  polycarbonateRoofCount: z.number().int(),
})

/** RoofWindBracing sub-section schema. */
export const roofWindBracingSchema = z.object({
  roofWindBracingSegmentsInOneHalf: z.number().int(),
  columnWindBracingSegments: z.number().int(),
  roofWindBracingProvidedBays: z.number().int(),
  columnWindBracingProvidedBays: z.number().int(),
  windBracingColumnHeight: z.coerce.number(),
  windBracingUnitWeight: z.coerce.number(),
  roofWindBracingBaySpacing: z.coerce.number(),
  columnWindBracingBaySpacing: z.coerce.number(),
  roofWindBracingLength: z.coerce.number(),
  columnWindBracingLength: z.coerce.number(),
  windBracingType: z.enum(['ROD', 'TUBE']),
})

/** RoofCladdingOpening sub-section schema. */
export const roofCladdingOpeningSchema = z.object({
  frontCladdingOpeningArea: z.coerce.number(),
  backCladdingOpeningArea: z.coerce.number(),
  rightCladdingOpeningArea: z.coerce.number(),
  leftCladdingOpeningArea: z.coerce.number(),
})

/** RoofFasciaBoard sub-section schema. */
export const roofFasciaBoardSchema = z.object({
  fasciaBoardArea: z.coerce.number(),
  fasciaMaterialWeightPerSqft: z.coerce.number(),
})

/** RoofSideExtension sub-section schema. */
export const roofSideExtensionSchema = z.object({
  roofExtensionWidthHeight: z.coerce.number(),
  roofExtensionMidFrameCount: z.number().int(),
  roofExtensionEndFrameCount: z.number().int(),
  claddingExtensionWidthHeight: z.coerce.number(),
  claddingExtensionMidFrameCount: z.number().int(),
  claddingExtensionEndFrameCount: z.number().int(),
  sideColumnsWidthHeight: z.coerce.number(),
  sideColumnsMidFrameCount: z.number().int(),
  sideColumnsEndFrameCount: z.number().int(),
})

/** RoofMaterialStrengthOrGuide sub-section schema. */
export const roofMaterialStrengthSchema = z.object({
  gradeOfPlateMaterial: z.enum(['FE_345', 'FE_250', 'FE_400']),
})

/** Combined optional sub-sections schema used in upsert operations. */
export const upsertRoofSectionsSchema = z.object({
  member: roofMemberSchema.optional(),
  purlin: roofPurlinSchema.optional(),
  sidewalls: z.array(sidewallSchema).optional(),
  covering: roofCoveringSchema.optional(),
  flangeBrace: roofFlangeBraceSchema.optional(),
  polycarbonate: roofPolycarbonateSchema.optional(),
  windBracing: roofWindBracingSchema.optional(),
  claddingOpening: roofCladdingOpeningSchema.optional(),
  fasciaBoard: roofFasciaBoardSchema.optional(),
  sideExtension: roofSideExtensionSchema.optional(),
  roofMaterialStrengthOrGuide: roofMaterialStrengthSchema.optional(),
})
