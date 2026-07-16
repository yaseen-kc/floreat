/**
 * Zod validation schemas + enums — the single source of truth for request
 * contracts shared by the Floreat frontend and backend. One module per
 * resource, re-exported here. All exported names are unique across resources,
 * so this barrel is unambiguous.
 *
 * For `roof` and `job` this barrel exposes the **wire** contract the server
 * accepts; the frontend keeps a stricter form schema that imports the enums
 * from here.
 */
export * from './pagination.schema.js'
export * from './job.schema.js'
export * from './roof.schema.js'
export * from './canopy.schema.js'
export * from './load.schema.js'
export * from './stair.schema.js'
export * from './mezzanine.schema.js'
export * from './accessories.schema.js'
export * from './joint.schema.js'
export * from './spec.schema.js'
export * from './rate.schema.js'
