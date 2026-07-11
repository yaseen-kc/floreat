/**
 * Canonical Job **wire** contract shared by the Floreat frontend and backend.
 * `date` is coerced from the JSON string the client sends.
 *
 * NOTE: the frontend Step 1 form uses a *stricter* schema
 * (`frontend/src/schemas/job.schema.ts`) that keeps `date` a string and makes
 * the contact fields required. This module is the contract the server accepts.
 */
import { z } from 'zod'

/** Schema for creating a job — validates required and optional fields. */
export const createJobSchema = z.object({
  projectNo: z.string().min(1),
  subject: z.string().min(1),
  refNo: z.string().min(1),
  date: z.coerce.date(),
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

/** Validated payload for creating a job. */
export type CreateJobInput = z.infer<typeof createJobSchema>

/** Validated payload for updating a job (all fields optional). */
export type UpdateJobInput = z.infer<typeof updateJobSchema>
