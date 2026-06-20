/**
 * Single source of truth for the Job (quotation Step 1) contract on the frontend.
 *
 * Every field is required: the form's required markers, inline errors, and the
 * step's validation are all derived from this schema, so making a field
 * required here propagates to the UI automatically. `date` is kept a string
 * (from `<input type="date">`, the backend coerces it).
 *
 * NOTE: the backend `createJobSchema` may still treat the contact fields and
 * firmName as optional; this frontend schema is intentionally stricter so the
 * form collects them up front. Loosen here if the backend contract changes.
 */
import { z } from 'zod'

export const jobSchema = z.object({
  projectNo: z.string().min(1),
  subject: z.string().min(1),
  refNo: z.string().min(1),
  date: z.string().min(1),
  designedByName: z.string().min(1),
  designedByMobile: z.string().min(1),
  clientName: z.string().min(1),
  estimationEngineerName: z.string().min(1),
  estimationEngineerMobile: z.string().min(1),
  headOfSalesName: z.string().min(1),
  headOfSalesMobile: z.string().min(1),
  firmName: z.string().min(1),
  buildingUsage: z.string().min(1),
  numberOfBuilding: z.number().int().positive(),
  frameType: z.string().min(1),
  configuration: z.string().min(1),
})

/** The canonical job-input type used by the store, API hooks, and the form. */
export type JobInput = z.infer<typeof jobSchema>

/** A field key of the job contract. */
export type JobField = keyof JobInput

/**
 * Returns true when a field is required (i.e. an `undefined` value is rejected).
 * Derived from the schema so the form's required markers can't drift.
 */
export function isRequired(field: JobField): boolean {
  return !jobSchema.shape[field].safeParse(undefined).success
}

/**
 * Validates `input` and returns a map of field -> first error message.
 * Returns an empty object when the input is valid.
 */
export function getFieldErrors(input: unknown): Partial<Record<JobField, string>> {
  const result = jobSchema.safeParse(input)
  if (result.success) return {}

  const errors: Partial<Record<JobField, string>> = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0] as JobField | undefined
    if (key && !errors[key]) errors[key] = issue.message
  }
  return errors
}
