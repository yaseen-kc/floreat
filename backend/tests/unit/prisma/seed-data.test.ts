import { describe, expect, it } from 'vitest'
import { createSpecSchema } from '../../../schemas/spec.schema.js'
import { specSeedData } from '../../../prisma/seed-data.js'

const specJobIds = ['seed_job_1', 'seed_job_2', 'seed_job_3', 'seed_job_4', 'seed_job_5']

describe('Spec seed data', () => {
  it('contains one job-owned spec per seed job', () => {
    expect(specSeedData).toHaveLength(5)
    expect(specSeedData.map(({ jobId }) => jobId)).toEqual(specJobIds)
  })

  it('contains unique job ids (1-to-1 with jobs)', () => {
    const jobIds = specSeedData.map(({ jobId }) => jobId)

    expect(new Set(jobIds).size).toBe(jobIds.length)
  })

  it.each(specSeedData)('validates the spec for $jobId against the shared Spec schema', (spec) => {
    const { jobId, ...data } = spec
    const result = createSpecSchema.safeParse(data)

    expect(result.success, `${jobId} failed validation: ${result.success ? '' : result.error.message}`).toBe(true)
  })
})
