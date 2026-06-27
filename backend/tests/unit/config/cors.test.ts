import { describe, it, expect } from 'vitest'
import { resolveCorsOrigin } from '../../../config/index.js'

describe('resolveCorsOrigin (F-04)', () => {
  it('defaults to the local dev origin when CORS_ORIGIN is unset (non-production)', () => {
    expect(resolveCorsOrigin({})).toEqual(['http://localhost:5173'])
    expect(resolveCorsOrigin({ NODE_ENV: 'development' })).toEqual(['http://localhost:5173'])
  })

  it('throws in production when CORS_ORIGIN is missing or empty', () => {
    expect(() => resolveCorsOrigin({ NODE_ENV: 'production' })).toThrow(/required in production/i)
    expect(() => resolveCorsOrigin({ NODE_ENV: 'production', CORS_ORIGIN: '   ' })).toThrow(/required in production/i)
  })

  it('rejects a "*" wildcard (alone or as a list entry)', () => {
    expect(() => resolveCorsOrigin({ CORS_ORIGIN: '*' })).toThrow(/must not be "\*"/i)
    expect(() =>
      resolveCorsOrigin({ NODE_ENV: 'production', CORS_ORIGIN: 'https://app.example.com,*' }),
    ).toThrow(/must not be "\*"/i)
  })

  it('parses a comma-separated allowlist, trimming and dropping empties', () => {
    expect(
      resolveCorsOrigin({ CORS_ORIGIN: ' https://app.example.com , https://admin.example.com , ' }),
    ).toEqual(['https://app.example.com', 'https://admin.example.com'])
  })

  it('returns a single-origin allowlist as a one-element array', () => {
    expect(resolveCorsOrigin({ NODE_ENV: 'production', CORS_ORIGIN: 'https://app.example.com' })).toEqual([
      'https://app.example.com',
    ])
  })
})
