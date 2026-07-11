/**
 * Unit-conversion and Decimal-string helpers for the HTTP wire boundary.
 * Centralises the coercion the frontend hydrate utilities perform when mapping
 * an API response (Prisma `Decimal` columns as strings, optionals as `null`)
 * back into an editable draft.
 */
import type { DecimalString, Nullable } from '../types/index.js'

/**
 * Coerce a nullable Decimal wire string to a number. `null` becomes `undefined`
 * so the value stays out of a create/update payload rather than serialising as
 * an explicit `null`.
 */
export const num = (v: Nullable<DecimalString>): number | undefined => (v == null ? undefined : Number(v))

/**
 * Pass a nullable integer through, mapping `null` to `undefined` so optional
 * integer columns stay out of a create/update payload.
 */
export const int = (v: Nullable<number>): number | undefined => (v == null ? undefined : v)
