/**
 * Quantity request contracts — re-exported from the single source of truth in
 * `@floreat/shared/schemas`. A Quantity is the calculated bill-of-quantities
 * output for a job: one container plus seven optional one-to-one section
 * objects, every field nullable for partial/draft saves. Kept as a thin shim
 * so `../schemas/quantity.schema.js` imports (and `paginationSchema`) keep
 * working.
 */
export * from '@floreat/shared/schemas'
