/**
 * Joint request contract on the frontend — re-exported from the single source
 * of truth in `@floreat/shared/schemas`. The frontend and backend Joint
 * contracts are identical, so there is no frontend-specific schema here.
 */
export {
  boltTypeEnum,
  roofJointIdEnum,
  mezzanineJointIdEnum,
  foundationBoltJointIdEnum,
  jointBoltRoofItemSchema,
  jointBoltMezzanineItemSchema,
  foundationBoltRoofItemSchema,
  createJointSchema,
  updateJointSchema,
} from '@floreat/shared/schemas'
export type { CreateJointInput, UpdateJointInput } from '@floreat/shared/schemas'
