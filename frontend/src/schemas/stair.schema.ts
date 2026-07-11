/**
 * Stair request contract on the frontend — re-exported from the single source
 * of truth in `@floreat/shared/schemas`. The frontend and backend Stair
 * contracts are identical, so there is no frontend-specific schema here.
 */
export {
  stairItemSchema,
  areaDeductionSchema,
  createStairSchema,
  updateStairSchema,
} from '@floreat/shared/schemas'
export type { CreateStairInput, UpdateStairInput } from '@floreat/shared/schemas'
