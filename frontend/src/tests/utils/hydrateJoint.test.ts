import { describe, it, expect } from 'vitest'
import { mapJointResponseToDraft } from '@/utils/hydrateJoint'
import type { Joint } from '@/api/quotation/joint/getJoint'
import { buildJointPayload } from '@/stores/quotation-store'

/** A minimal Joint response with a couple of populated rows + scalars. */
const response: Joint = {
  id: 'jt1',
  jobId: 'j1',
  createdAt: '',
  updatedAt: '',
  secondaryBeamsBoltType: 'HSFG',
  secondaryBeamsBoltDiameter: '20.000',
  secondaryBeamsNumberOfBolts: 4,
  purlinFlangeBraceBoltType: null,
  purlinFlangeBraceBoltDiameter: null,
  purlinFlangeBraceNumberOfBolts: null,
  claddingPurlinsBoltType: null,
  claddingPurlinsBoltDiameter: null,
  claddingPurlinsNumberOfBolts: null,
  canopyBoltType: null,
  canopyBoltDiameter: null,
  canopyNumberOfBolts: null,
  jointBoltRoof: [{ id: 'r1', jointId: 'jt1', roofJointId: 'A', boltDiameter: '20.000', numberOfBolts: 6 }],
  jointBoltMezzanine: [{ id: 'm1', jointId: 'jt1', mezzanineJointId: 'M', boltDiameter: '16.000', numberOfBolts: 8 }],
  foundationBoltRoof: [{ id: 'f1', jointId: 'jt1', foundationJointId: 'FB4', boltDiameter: '24.000', numberOfBolts: 4 }],
}

describe('mapJointResponseToDraft', () => {
  it('coerces Decimal strings to numbers and nulls to undefined', () => {
    const draft = mapJointResponseToDraft(response)
    expect(draft.secondaryBeamsBoltType).toBe('HSFG')
    expect(draft.secondaryBeamsBoltDiameter).toBe(20)
    expect(draft.canopyBoltType).toBeUndefined()
    expect(draft.canopyBoltDiameter).toBeUndefined()
  })

  it('preserves the full enum-seeded row set and overlays server rows by id', () => {
    const draft = mapJointResponseToDraft(response)
    expect(draft.jointBoltRoof).toHaveLength(22)
    expect(draft.jointBoltMezzanine).toHaveLength(8)
    expect(draft.foundationBoltRoof).toHaveLength(3)

    const rowA = draft.jointBoltRoof.find((r) => r.roofJointId === 'A')
    expect(rowA).toEqual({ roofJointId: 'A', boltDiameter: 20, numberOfBolts: 6 })

    const rowB = draft.jointBoltRoof.find((r) => r.roofJointId === 'B')
    expect(rowB).toEqual({ roofJointId: 'B' })
  })

  it('round-trips into a payload keeping only the populated rows', () => {
    const draft = mapJointResponseToDraft(response)
    const payload = buildJointPayload(draft)
    expect(payload.jointBoltRoof).toEqual([{ roofJointId: 'A', boltDiameter: 20, numberOfBolts: 6 }])
    expect(payload.jointBoltMezzanine).toEqual([{ mezzanineJointId: 'M', boltDiameter: 16, numberOfBolts: 8 }])
    expect(payload.foundationBoltRoof).toEqual([{ foundationJointId: 'FB4', boltDiameter: 24, numberOfBolts: 4 }])
  })
})
