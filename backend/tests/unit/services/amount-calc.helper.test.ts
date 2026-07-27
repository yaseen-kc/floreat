import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { computeJobAmount, ITEM_PREFIX_MAP } from '../../../services/amount-calc.helper.js'

describe('amount-calc.helper', () => {
  it('returns null if job is not found', async () => {
    prismaMock.job.findUnique.mockResolvedValue(null)
    const result = await computeJobAmount('nonexistent-job')
    expect(result).toBeNull()
  })

  it('computes baseline amount fields for a job', async () => {
    prismaMock.job.findUnique.mockResolvedValue({
      id: 'job-1',
      roof: { buildingOverallLength: 30, buildingOverallWidth: 20 },
      mezzanine: null,
      stair: null,
      canopy: null,
      accessories: null,
      joint: null,
      quantity: null,
    } as any)

    prismaMock.rate.findMany.mockResolvedValue([
      {
        item: 'STEEL STRUCTURE',
        fabricationRate: 50,
        erectionRate: 20,
        loadingRate: 10,
      },
    ] as any)

    const result = await computeJobAmount('job-1')
    expect(result).not.toBeNull()
    if (result) {
      expect(result.steelStructuresQuantity).toBeDefined()
      expect(result.steelStructuresFabricationRate).toBe(50)
      expect(result.steelStructuresErrectionRate).toBe(20)
      expect(result.steelStructuresLoadingRate).toBe(10)
    }
  })

  it('contains mapping for all 36 items in ITEM_PREFIX_MAP', () => {
    expect(Object.keys(ITEM_PREFIX_MAP).length).toBe(36)
  })
})
