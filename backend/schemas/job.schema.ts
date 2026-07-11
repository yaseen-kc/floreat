/**
 * Job request contracts — re-exported from the single source of truth in
 * `@floreat/shared/schemas` (the **wire** contract; `date` is coerced). Kept as
 * a thin shim so existing `../schemas/job.schema.js` imports (and
 * `paginationSchema`) keep working.
 */
export * from '@floreat/shared/schemas'
