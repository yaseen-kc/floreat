/**
 * Single source of truth for the Roof (quotation Step 2) **form** contract on
 * the frontend.
 *
 * The Step 2 form mirrors the shared/backend wire contract
 * (`@floreat/shared/schemas` → `createRoofSchema`): the core building
 * dimensions are required, and every structural section (members, purlins,
 * coverings, flange brace, polycarbonate, wind bracing, cladding openings,
 * fascia board, side extension, material grade, material consumption, SAG rod)
 * plus the inline `sidewalls` array is **optional** — so the user can advance
 * past Step 2 without completing any section.
 *
 * The one place this form is stricter than the wire contract is
 * `roofFrameBaseFixing`: it is required here (the Step 2 payload builder needs
 * a selected fixing), even though the backend accepts it as optional so partial
 * roofs can be persisted.
 *
 * The enums and the identical `sidewallSchema` are imported (and re-exported)
 * from `@floreat/shared/schemas` so there is exactly one definition of each.
 *
 * Numeric fields are typed as `number` (the create/upsert payload), even though
 * the `Roof` response serialises Prisma `Decimal` columns back as `string`.
 */
import {
  sideWallSideEnum,
  typeOfWallEnum,
  purlinMaterialTypeEnum,
  typeOfWindBracingEnum,
  coveringTypeEnum,
  roofFrameBaseFixingEnum,
  plateMaterialGradeEnum,
  sidewallSchema,
  createRoofSchema as sharedCreateRoofSchema,
} from '@floreat/shared/schemas'

// Re-export the shared enums + sidewall schema so existing
// `@/schemas/roof.schema` consumers keep importing them from here.
export {
  sideWallSideEnum,
  typeOfWallEnum,
  purlinMaterialTypeEnum,
  typeOfWindBracingEnum,
  coveringTypeEnum,
  roofFrameBaseFixingEnum,
  plateMaterialGradeEnum,
  sidewallSchema,
}

/**
 * Schema for creating/upserting a roof — the shared wire contract (core
 * dimensions required, all sections optional) with `roofFrameBaseFixing`
 * tightened to required for the Step 2 form.
 */
export const createRoofSchema = sharedCreateRoofSchema.extend({
  roofFrameBaseFixing: roofFrameBaseFixingEnum,
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
