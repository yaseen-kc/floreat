import { describe, it, expect } from 'vitest'
import { createJointSchema } from '../../src/schemas/joint.schema.js'

describe('createJointSchema', () => {
  it('accepts an empty object (all fields optional)', () => {
    expect(createJointSchema.safeParse({}).success).toBe(true)
  })

  it('parses a full payload shaped like the source spec', () => {
    const payload = {
      secondaryBeamsBoltType: 'HSFG',
      secondaryBeamsBoltDiameter: 16,
      secondaryBeamsNumberOfBolts: 6,
      purlinFlangeBraceBoltType: 'ORD',
      purlinFlangeBraceBoltDiameter: 12,
      purlinFlangeBraceNumberOfBolts: 14,
      claddingPurlinsBoltType: 'ORD',
      claddingPurlinsBoltDiameter: 12,
      claddingPurlinsNumberOfBolts: 10,
      canopyBoltType: 'ORD',
      canopyBoltDiameter: 16,
      canopyNumberOfBolts: 8,
      jointBoltRoof: [
        { roofJointId: 'A', boltDiameter: 16, numberOfBolts: 8 },
        { roofJointId: 'F', boltDiameter: 16, numberOfBolts: 4 },
        { roofJointId: 'A_1', boltDiameter: 16, numberOfBolts: 8 },
      ],
      jointBoltMezzanine: [
        { mezzanineJointId: 'M', boltDiameter: 16, numberOfBolts: 8 },
        { mezzanineJointId: 'SEC', boltDiameter: 16, numberOfBolts: 8 },
      ],
      foundationBoltRoof: [
        { foundationJointId: 'FB4', boltDiameter: 20, numberOfBolts: 8 },
        { foundationJointId: 'FB5', boltDiameter: 20, numberOfBolts: 8 },
        { foundationJointId: 'FB6', boltDiameter: 20, numberOfBolts: 8 },
      ],
    }
    const result = createJointSchema.safeParse(payload)
    expect(result.success).toBe(true)
  })

  it('rejects an invalid roofJointId', () => {
    const result = createJointSchema.safeParse({ jointBoltRoof: [{ roofJointId: 'ZZ' }] })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid boltType', () => {
    const result = createJointSchema.safeParse({ canopyBoltType: 'WRONG' })
    expect(result.success).toBe(false)
  })

  it('keeps a per-row mezzanine boltDiameter and strips the removed shared field', () => {
    const result = createJointSchema.safeParse({
      mezzanineBoltDiameter: 16, // removed from the contract — should be stripped
      jointBoltMezzanine: [{ mezzanineJointId: 'M', boltDiameter: 16, numberOfBolts: 8 }],
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty('mezzanineBoltDiameter')
      expect(result.data.jointBoltMezzanine?.[0].boltDiameter).toBe(16)
    }
  })
})
