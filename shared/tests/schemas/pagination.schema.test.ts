import { describe, it, expect } from 'vitest'
import { paginationSchema } from '../../src/schemas/pagination.schema.js'

describe('paginationSchema', () => {
  it('applies defaults when nothing is provided', () => {
    expect(paginationSchema.parse({})).toEqual({ page: 1, pageSize: 10 })
  })

  it('coerces string query params to integers', () => {
    expect(paginationSchema.parse({ page: '2', pageSize: '25' })).toEqual({ page: 2, pageSize: 25 })
  })

  it('rejects a pageSize above the cap', () => {
    expect(paginationSchema.safeParse({ pageSize: '101' }).success).toBe(false)
  })

  it('rejects non-positive pages', () => {
    expect(paginationSchema.safeParse({ page: '0' }).success).toBe(false)
  })
})
