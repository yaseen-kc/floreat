/**
 * `@floreat/shared` — single source of truth for contracts, calculations,
 * wire-format types and unit/Decimal helpers shared by the Floreat frontend
 * and backend. Prefer the subpath entry points (`@floreat/shared/schemas`,
 * `/calc`, `/types`, `/units`) over this barrel in application code.
 */
export const SHARED_PACKAGE = '@floreat/shared'

export * from './schemas/index.js'
export * from './calc/index.js'
export * from './types/index.js'
export * from './units/index.js'
