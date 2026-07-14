/**
 * Spec request contract on the frontend — re-exported from the single source of
 * truth in `@floreat/shared/schemas`. The frontend and backend Spec contracts
 * are identical (a products array of all-optional items), so there is no
 * frontend-specific schema.
 */
export { createSpecSchema, updateSpecSchema, specProductItemSchema } from '@floreat/shared/schemas'
export type { CreateSpecInput, UpdateSpecInput, SpecProductInput } from '@floreat/shared/schemas'
