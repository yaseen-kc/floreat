import { describe, expect, it } from 'vitest'
import { specKeys } from '@/api/quotation/spec/queryKeys'

describe('specKeys factory', () => {
  it('roots everything under specs', () => {
    expect(specKeys.all).toEqual(['specs'])
  })

  it('builds stable list keys and prefixes', () => {
    expect(specKeys.lists()).toEqual(['specs', 'list'])
    expect(specKeys.list(2, 25)).toEqual(['specs', 'list', { page: 2, pageSize: 25 }])
    expect(specKeys.list(1, 10).slice(0, specKeys.lists().length)).toEqual(specKeys.lists())
  })

  it('builds detail keys by owning job ID', () => {
    expect(specKeys.details()).toEqual(['specs', 'detail'])
    expect(specKeys.detail('job-1')).toEqual(['specs', 'detail', 'job-1'])
  })
})
