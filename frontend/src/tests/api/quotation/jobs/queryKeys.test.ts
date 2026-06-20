import { describe, it, expect } from 'vitest'
import { jobKeys } from '@/api/quotation/jobs/queryKeys'

describe('jobKeys factory', () => {
  it('roots everything under "jobs"', () => {
    expect(jobKeys.all).toEqual(['jobs'])
  })

  it('builds list keys with a stable prefix', () => {
    expect(jobKeys.lists()).toEqual(['jobs', 'list'])
    expect(jobKeys.list(2, 25)).toEqual(['jobs', 'list', { page: 2, pageSize: 25 }])
  })

  it('shares the list prefix so invalidating lists() matches list(...)', () => {
    const prefix = jobKeys.lists()
    const concrete = jobKeys.list(1, 10)
    expect(concrete.slice(0, prefix.length)).toEqual(prefix)
  })

  it('builds detail keys', () => {
    expect(jobKeys.details()).toEqual(['jobs', 'detail'])
    expect(jobKeys.detail('job-1')).toEqual(['jobs', 'detail', 'job-1'])
  })
})
