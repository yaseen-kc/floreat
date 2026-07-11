/**
 * Accessories request contract on the frontend — re-exported from the single
 * source of truth in `@floreat/shared/schemas`. The frontend and backend
 * Accessories contracts are identical, so there is no frontend-specific schema.
 */
export {
  drainageMaterialEnum,
  drainageSizeEnum,
  flashingTypeEnum,
  flashingThicknessEnum,
  partitionTypeEnum,
  partitionThicknessEnum,
  insulationTypeEnum,
  turboVentilatorDiameterEnum,
  accessoryOpeningKindEnum,
  paintTypeEnum,
  purlinsGirtsFinishEnum,
  purlinsGirtsPaintEnum,
  foundationBoltFinishEnum,
  accessoryDoorSchema,
  accessoryWindowSchema,
  accessoryFoldedPlateSchema,
  accessoryOpeningSchema,
  createAccessoriesSchema,
  updateAccessoriesSchema,
} from '@floreat/shared/schemas'
export type { CreateAccessoriesInput, UpdateAccessoriesInput } from '@floreat/shared/schemas'
