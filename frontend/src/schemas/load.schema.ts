/**
 * Load request contract on the frontend — re-exported from the single source of
 * truth in `@floreat/shared/schemas`. The frontend and backend Load contracts
 * are identical (all fields optional), so there is no frontend-specific schema.
 */
export { approvalDrawingsTimeUnitEnum, createLoadSchema, updateLoadSchema } from '@floreat/shared/schemas'
export type { CreateLoadInput, UpdateLoadInput } from '@floreat/shared/schemas'
