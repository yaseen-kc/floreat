import { z } from 'zod'

/**
 * Canonical pagination query-param schema shared by every paginated list
 * endpoint. Coerces string query params to integers and applies sensible
 * defaults (`page=1`, `pageSize=10`, capped at 100).
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
})

/** Validated pagination query params (`{ page, pageSize }`). */
export type PaginationInput = z.infer<typeof paginationSchema>
