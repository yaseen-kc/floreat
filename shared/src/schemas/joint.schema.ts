/**
 * Canonical Joint request contract shared by the Floreat frontend and backend.
 * A Joint is the per-job bolt-specification container: fixed-diameter/-count
 * scalar groups for secondary beams, purlins & flange brace, cladding purlins,
 * and canopy, plus three inline arrays keyed by closed joint-id enums (roof
 * joints, mezzanine joints, foundation bolts) — all replaced entirely on
 * upsert/update.
 */
import { z } from 'zod'

/** Bolt type: high-strength friction grip or ordinary. */
export const boltTypeEnum = z.enum(['HSFG', 'ORD'])

/** Closed set of roof joint codes. Underscore variants (e.g. `A_1`) mirror the
 * Prisma `RoofJointId` enum member names, which `@map` to their hyphenated
 * DB/UI form (e.g. "A-1") — matches the project convention for @map'd enums. */
export const roofJointIdEnum = z.enum([
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
  'A_1', 'B_1', 'B_2', 'C_1', 'D_1', 'G_1', 'H_1', 'I_1', 'K_1', 'L_1',
])

/** Closed set of mezzanine joint codes. */
export const mezzanineJointIdEnum = z.enum(['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'SEC'])

/** Closed set of foundation bolt joint codes. */
export const foundationBoltJointIdEnum = z.enum(['FB4', 'FB5', 'FB6'])

/** A roof joint bolt row — HSFG implicit, diameter and count vary per joint. */
export const jointBoltRoofItemSchema = z.object({
  roofJointId: roofJointIdEnum,
  boltDiameter: z.number().positive().optional(),
  numberOfBolts: z.number().int().nonnegative().optional(),
})

/** A mezzanine joint bolt row — HSFG implicit, shared diameter lives on the parent. */
export const jointBoltMezzanineItemSchema = z.object({
  mezzanineJointId: mezzanineJointIdEnum,
  numberOfBolts: z.number().int().nonnegative().optional(),
})

/** A foundation bolt row — shared diameter, per-joint count. */
export const foundationBoltRoofItemSchema = z.object({
  foundationJointId: foundationBoltJointIdEnum,
  boltDiameter: z.number().positive().optional(),
  numberOfBolts: z.number().int().nonnegative().optional(),
})

/** Schema for creating/upserting a joint — singleton scalar groups plus inline arrays. */
export const createJointSchema = z.object({
  // ── Mezzanine joint bolts: shared diameter (per-row counts live in jointBoltMezzanine) ──
  mezzanineBoltDiameter: z.number().positive().optional(),

  // ── Secondary beams ──
  secondaryBeamsBoltType: boltTypeEnum.optional(),
  secondaryBeamsBoltDiameter: z.number().positive().optional(),
  secondaryBeamsNumberOfBolts: z.number().int().nonnegative().optional(),

  // ── Purlins & flange brace ──
  purlinFlangeBraceBoltType: boltTypeEnum.optional(),
  purlinFlangeBraceBoltDiameter: z.number().positive().optional(),
  purlinFlangeBraceNumberOfBolts: z.number().int().nonnegative().optional(),

  // ── Cladding purlins ──
  claddingPurlinsBoltType: boltTypeEnum.optional(),
  claddingPurlinsBoltDiameter: z.number().positive().optional(),
  claddingPurlinsNumberOfBolts: z.number().int().nonnegative().optional(),

  // ── Canopy ──
  canopyBoltType: boltTypeEnum.optional(),
  canopyBoltDiameter: z.number().positive().optional(),
  canopyNumberOfBolts: z.number().int().nonnegative().optional(),

  // ── Inline arrays ──
  jointBoltRoof: z.array(jointBoltRoofItemSchema).optional(),
  jointBoltMezzanine: z.array(jointBoltMezzanineItemSchema).optional(),
  foundationBoltRoof: z.array(foundationBoltRoofItemSchema).optional(),
})

/** Schema for updating a joint — all fields optional (partial update). */
export const updateJointSchema = createJointSchema.partial()

/** Validated payload for creating/upserting a joint. */
export type CreateJointInput = z.infer<typeof createJointSchema>

/** Validated payload for updating a joint (all fields optional). */
export type UpdateJointInput = z.infer<typeof updateJointSchema>
