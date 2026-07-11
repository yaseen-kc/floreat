import { describe, it, expect } from 'vitest'
import { SHARED_PACKAGE } from '../src/index.js'

describe('@floreat/shared', () => {
  it('exposes its package identifier', () => {
    expect(SHARED_PACKAGE).toBe('@floreat/shared')
  })
})
