/**
 * Mezzanine request contract on the frontend — re-exported from the single
 * source of truth in `@floreat/shared/schemas`. The frontend and backend
 * Mezzanine contracts are identical, so there is no frontend-specific schema.
 */
export {
  mezzanineTypeEnum,
  mezzanineFloorLevelEnum,
  mezzanineHeightFromEnum,
  mezzanineCode,
  mezzanineFloorSchema,
  mezzanineFloorExtensionSchema,
  createMezzanineSchema,
  updateMezzanineSchema,
} from '@floreat/shared/schemas'
export type { CreateMezzanineInput, UpdateMezzanineInput } from '@floreat/shared/schemas'
