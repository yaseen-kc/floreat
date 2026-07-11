/**
 * Canopy request contract on the frontend — re-exported from the single source
 * of truth in `@floreat/shared/schemas`. The frontend and backend Canopy
 * contracts are identical, so there is no frontend-specific schema here.
 */
export {
  canopyHeightFromEnum,
  canopySheetTypeEnum,
  canopyCode,
  canopyItemSchema,
  createCanopySchema,
  updateCanopySchema,
} from '@floreat/shared/schemas'
export type { CreateCanopyInput, UpdateCanopyInput } from '@floreat/shared/schemas'
