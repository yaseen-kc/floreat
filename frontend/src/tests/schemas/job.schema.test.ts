import { describe, it, expect } from 'vitest'
import { jobSchema, getFieldErrors, isRequired, type JobInput } from '@/schemas/job.schema'

/** A complete, valid job input (all required fields + optionals present). */
const validJob: JobInput = {
  projectNo: 'P-001',
  subject: 'Test Subject',
  refNo: 'REF-001',
  date: '2026-01-01',
  designedByName: 'John',
  designedByMobile: '1234567890',
  clientName: 'Acme',
  estimationEngineerName: 'Jane',
  estimationEngineerMobile: '0987654321',
  headOfSalesName: 'Sam',
  headOfSalesMobile: '5555555555',
  firmName: 'Acme Co',
  buildingUsage: 'Commercial',
  numberOfBuilding: 2,
  frameType: 'Steel',
  configuration: 'Standard',
}

describe('jobSchema', () => {
  it('accepts a complete valid payload', () => {
    expect(jobSchema.safeParse(validJob).success).toBe(true)
  })

  it('accepts omitting optional contact fields and firmName', () => {
    const result = jobSchema.safeParse({
      projectNo: 'P-001',
      subject: 'Test Subject',
      refNo: 'REF-001',
      date: '2026-01-01',
      designedByName: 'John',
      designedByMobile: '1234567890',
      buildingUsage: 'Commercial',
      numberOfBuilding: 1,
      frameType: 'Steel',
      configuration: 'Standard',
    })
    expect(result.success).toBe(true)
    // Optionals default to empty strings.
    expect(result.success && result.data.clientName).toBe('')
    expect(result.success && result.data.firmName).toBe('')
  })

  it('accepts empty strings for optional fields', () => {
    expect(jobSchema.safeParse({ ...validJob, clientName: '', firmName: '' }).success).toBe(true)
  })

  it('rejects a missing required field', () => {
    const { projectNo: _omit, ...rest } = validJob
    expect(jobSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects an empty required string', () => {
    expect(jobSchema.safeParse({ ...validJob, subject: '' }).success).toBe(false)
  })

  it('rejects numberOfBuilding <= 0', () => {
    expect(jobSchema.safeParse({ ...validJob, numberOfBuilding: 0 }).success).toBe(false)
    expect(jobSchema.safeParse({ ...validJob, numberOfBuilding: -1 }).success).toBe(false)
  })

  it('rejects a non-integer numberOfBuilding', () => {
    expect(jobSchema.safeParse({ ...validJob, numberOfBuilding: 1.5 }).success).toBe(false)
  })
})

describe('isRequired', () => {
  it('reports required fields as required', () => {
    expect(isRequired('projectNo')).toBe(true)
    expect(isRequired('date')).toBe(true)
    expect(isRequired('numberOfBuilding')).toBe(true)
    expect(isRequired('configuration')).toBe(true)
  })

  it('reports optional contact fields and firmName as not required', () => {
    expect(isRequired('clientName')).toBe(false)
    expect(isRequired('estimationEngineerName')).toBe(false)
    expect(isRequired('estimationEngineerMobile')).toBe(false)
    expect(isRequired('headOfSalesName')).toBe(false)
    expect(isRequired('headOfSalesMobile')).toBe(false)
    expect(isRequired('firmName')).toBe(false)
  })
})

describe('getFieldErrors', () => {
  it('returns no errors for a valid payload', () => {
    expect(getFieldErrors(validJob)).toEqual({})
  })

  it('flags required fields that are empty, but not optional ones', () => {
    const errors = getFieldErrors({ ...validJob, projectNo: '', clientName: '' })
    expect(errors.projectNo).toBeDefined()
    expect(errors.clientName).toBeUndefined()
  })
})
