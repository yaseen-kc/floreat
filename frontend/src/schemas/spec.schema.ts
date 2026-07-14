/**
 * Spec request contract on the frontend — re-exported from the single source of
 * truth in `@floreat/shared/schemas`. The frontend and backend Spec contracts
 * are identical (all fields optional), so there is no frontend-specific schema.
 */
export { createSpecSchema, updateSpecSchema } from '@floreat/shared/schemas'
export type { CreateSpecInput, UpdateSpecInput } from '@floreat/shared/schemas'
