import { describe, it, expect } from 'vitest'
import {
  createCanopySchema,
  updateCanopySchema,
  canopyItemSchema,
} from '@/schemas/canopy.schema'

describe('createCanopySchema', () => {
  it('accepts an empty payload (canopies optional)', () => {
    expect(createCanopySchema.safeParse({}).success).toBe(true)
  })

  it('accepts a fully populated canopy item', () => {
    const result = createCanopySchema.safeParse({
      canopies: [
        {
          code: 'CANOPY-1',
          heightFrom: 'GROUND',
          length: 10,
          width: 5,
          height: 3,
          materialConsumptionKgPerSqft: 2.5,
          numberOfBeams: 4,
          numberOfPurlins: 8,
          purlinDepth: 150,
          unitWeightOfPurlin: 5,
          canopySheet: 'NCGL',
          sheetThick: 0.5,
          canopySideCoveringHeight: 1.2,
          gutter: true,
          downTake: false,
          flashing: true,
        },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid heightFrom enum value', () => {
    const result = canopyItemSchema.safeParse({ heightFrom: 'BASEMENT' })
    expect(result.success).toBe(false)
  })

  it('rejects a malformed code', () => {
    const result = canopyItemSchema.safeParse({ code: 'CANOPY-0' })
    expect(result.success).toBe(false)
  })

  it('rejects a non-positive dimension', () => {
    const result = canopyItemSchema.safeParse({ length: -1 })
    expect(result.success).toBe(false)
  })
})

describe('updateCanopySchema', () => {
  it('accepts an empty partial payload', () => {
    expect(updateCanopySchema.safeParse({}).success).toBe(true)
  })
})
