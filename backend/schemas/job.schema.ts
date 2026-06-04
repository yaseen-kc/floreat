/**
 * Zod validation schemas for Job API request payloads.
 */
import { z } from 'zod'

/** Schema for creating a new job — validates required and optional fields. */
export const createJobSchema = z.object({
  projectNo: z.string().min(1),
  subject: z.string().min(1),
  refNo: z.string().min(1),
  date: z.string().min(1),
  designedByName: z.string().min(1),
  designedByMobile: z.string().min(1),
  clientName: z.string().optional(),
  estimationEngineerName: z.string().optional(),
  estimationEngineerMobile: z.string().optional(),
  headOfSalesName: z.string().optional(),
  headOfSalesMobile: z.string().optional(),
  firmName: z.string().optional(),
  buildingUsage: z.string().min(1),
  numberOfBuilding: z.number().int().positive(),
  frameType: z.string().min(1),
  configuration: z.string().min(1),
})

/** Schema for updating a job — all fields optional (partial update). */
export const updateJobSchema = createJobSchema.partial()

/** Schema for pagination query params with sensible defaults. */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
})
