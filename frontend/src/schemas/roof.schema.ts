/**
 * Frontend Roof (quotation Step 2) request contract.
 *
 * The canonical contract lives in `@floreat/shared` (the single source of truth
 * shared with the backend). This module layers the frontend's STRICTER form
 * rules on top: every structural section field is required here so Step 2 forces
 * the user to complete it, even though the backend API accepts them as optional.
 *
 * Strictness is an additive `.required()` + `.partial()` layer over the shared
 * `createRoofSchema`, not a fork — so the two can never drift on field shape,
 * names, enums, or constraints.
 *
 * Fields that stay optional on the frontend:
 *  - `fasciaBoardArea`, `fasciaMaterialWeightPerSqft` (Fascia Board section)
 *  - `sidewalls` (inline array)
 *  - `sideColumnsWidthHeight` (DERIVED — computed for preview, recomputed
 *    authoritatively by the backend; never a user input)
 */
import { z } from 'zod'
import { createRoofSchema as sharedCreateRoofSchema } from '@floreat/shared'

// Re-export the shared enums so form components keep importing them from here.
export {
  sideWallSideEnum,
  typeOfWallEnum,
  purlinMaterialTypeEnum,
  typeOfWindBracingEnum,
  coveringTypeEnum,
  roofFrameBaseFixingEnum,
  plateMaterialGradeEnum,
  sidewallSchema,
} from '@floreat/shared'

/**
 * Strict Step 2 schema: every field required EXCEPT the fascia board fields,
 * the inline sidewalls array, and the derived `sideColumnsWidthHeight`.
 */
export const createRoofSchema = sharedCreateRoofSchema.required().partial({
  fasciaBoardArea: true,
  fasciaMaterialWeightPerSqft: true,
  sidewalls: true,
  sideColumnsWidthHeight: true,
})

/** Validated payload for creating/upserting a roof (frontend-strict). */
export type CreateRoofInput = z.infer<typeof createRoofSchema>

/** A field key of the roof create/upsert contract. */
export type RoofField = keyof CreateRoofInput

/**
 * Returns true when a field is required (i.e. an `undefined` value is rejected).
 * Derived from the strict schema so the form's required markers can't drift.
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
