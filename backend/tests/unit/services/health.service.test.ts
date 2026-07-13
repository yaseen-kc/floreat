import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { isDatabaseReady } from '../../../services/health.service.js'

describe('health.service', () => {
  describe('isDatabaseReady', () => {
    it('returns true when the database ping succeeds', async () => {
      prismaMock.$queryRaw.mockResolvedValue([{ '?column?': 1 }] as any)

      const result = await isDatabaseReady()

      expect(result).toBe(true)
      expect(prismaMock.$queryRaw).toHaveBeenCalled()
    })

    it('returns false when the database ping throws', async () => {
      prismaMock.$queryRaw.mockRejectedValue(new Error('connection refused'))

      const result = await isDatabaseReady()

      expect(result).toBe(false)
    })
  })
})
