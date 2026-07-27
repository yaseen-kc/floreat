import { describe, it, expect } from 'vitest'
import { getPebRoofRows } from '@/components/quotation/sections/quantity/quantity-rows'

describe('getPebRoofRows', () => {
  it('correctly populates qtyField and calcValue for 1.9, 1.9.1, and 1.9.2', () => {
    const mockCalc = {
      bolts: {
        numberOfRoofJointBolts: '16 MM DIA HSFG BOLTS',
        numberOfRoofJointBoltsQuantity: 32,
        numberOfFoundationBolts: '20 MM DIA FOUNDATION BOLTS',
        numberOfFoundationBoltsQuantity: 64,
        numberOfAnchorBolts: '20 MM DIA ANCHOR BOLTS',
        numberOfAnchorBoltsQuantity: 416,
      },
    }

    const rows = getPebRoofRows(mockCalc as Parameters<typeof getPebRoofRows>[0])
    const r1_9 = rows.find((r) => r.sl === '1.9')
    const r1_9_1 = rows.find((r) => r.sl === '1.9.1')
    const r1_9_2 = rows.find((r) => r.sl === '1.9.2')

    expect(r1_9).toMatchObject({
      qtyField: 'numberOfRoofJointBoltsQuantity',
      calcValue: 32,
    })
    expect(r1_9_1).toMatchObject({
      qtyField: 'numberOfFoundationBoltsQuantity',
      calcValue: 64,
    })
    expect(r1_9_2).toMatchObject({
      qtyField: 'numberOfAnchorBoltsQuantity',
      calcValue: 416,
    })
  })
})
