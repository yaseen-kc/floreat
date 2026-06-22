/**
 * Roof request contract — re-exported from @floreat/shared so the backend and
 * frontend validate against a single source of truth (see shared roof.schema.ts).
 *
 * Only `paginationSchema` stays backend-local: it is generic (not roof-specific)
 * and is duplicated across resource schema files today. Extracting it to one
 * shared module is a separate, cross-resource cleanup (out of scope here).
 */
import { z } from 'zod'

export * from '@floreat/shared'

/** Schema for pagination query params with sensible defaults. */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
})
