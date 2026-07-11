import { describe, it, expect } from 'vitest'
import { mapAccessoriesResponseToDraft } from '@/utils/hydrateAccessories'
import type { Accessories } from '@/api/quotation/accessories/getAccessories'

const base = {
  id: 'acc-1',
  jobId: 'job-1',
  createdAt: '',
  updatedAt: '',
  doors: [],
  windows: [],
  foldedPlates: [],
  openings: [],
} as unknown as Accessories

describe('mapAccessoriesResponseToDraft', () => {
  it('coerces Decimal strings to numbers and nulls to undefined', () => {
    const response = {
      ...base,
      gutterType: 'PPGL',
      gutterQuantity: '200.000',
      gutterQuantityManual: true,
      handrailWeightKg: '55.500',
      partitionType: null,
      partitionQuantity: 4,
    } as unknown as Accessories

    const draft = mapAccessoriesResponseToDraft(response)

    expect(draft.gutterType).toBe('PPGL')
    expect(draft.gutterQuantity).toBe(200)
    expect(draft.gutterQuantityManual).toBe(true)
    expect(draft.handrailWeightKg).toBe(55.5)
    expect(draft.partitionType).toBeUndefined()
    expect(draft.partitionQuantity).toBe(4)
  })

  it('maps line-item arrays dropping server-only fields', () => {
    const response = {
      ...base,
      doors: [{ id: 'd1', accessoriesId: 'acc-1', height: '2.100', width: '0.900', nos: 3, quantity: '5.670' }],
      openings: [{ id: 'o1', accessoriesId: 'acc-1', kind: 'LOUVER', length: '1.000', width: '1.000', nos: 2, quantity: '2.000' }],
    } as unknown as Accessories

    const draft = mapAccessoriesResponseToDraft(response)

    expect(draft.doors).toEqual([{ height: 2.1, width: 0.9, nos: 3 }])
    expect(draft.openings).toEqual([{ kind: 'LOUVER', length: 1, width: 1, nos: 2 }])
  })
})
