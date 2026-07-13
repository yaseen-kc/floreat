import { describe, it, expect, beforeEach } from 'vitest'
import { useQuotationStore, buildJointPayload } from '@/stores/quotation-store'
import { createJointSchema } from '@/schemas/joint.schema'

describe('buildJointPayload', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('returns an empty object for a fresh (untouched, id-only) draft', () => {
    const payload = buildJointPayload(useQuotationStore.getState().joint)
    expect(payload).toEqual({})
  })

  it('seeds one blank row per enum member in each array', () => {
    const { joint } = useQuotationStore.getState()
    expect(joint.jointBoltRoof).toHaveLength(22)
    expect(joint.jointBoltMezzanine).toHaveLength(8)
    expect(joint.foundationBoltRoof).toHaveLength(3)
  })

  it('keeps provided scalar fields and drops blank ones', () => {
    useQuotationStore.getState().setJoint({
      secondaryBeamsBoltType: 'HSFG',
      secondaryBeamsNumberOfBolts: 4,
    })
    const payload = buildJointPayload(useQuotationStore.getState().joint)
    expect(payload.secondaryBeamsBoltType).toBe('HSFG')
    expect(payload.secondaryBeamsNumberOfBolts).toBe(4)
    expect(payload).not.toHaveProperty('canopyBoltDiameter')
  })

  it('keeps a filled roof row and drops id-only placeholder rows', () => {
    const { joint, setJoint } = useQuotationStore.getState()
    const jointBoltRoof = joint.jointBoltRoof.map((r) =>
      r.roofJointId === 'A' ? { ...r, boltDiameter: 20, numberOfBolts: 6 } : r,
    )
    setJoint({ jointBoltRoof })

    const payload = buildJointPayload(useQuotationStore.getState().joint)
    expect(payload.jointBoltRoof).toEqual([{ roofJointId: 'A', boltDiameter: 20, numberOfBolts: 6 }])
  })

  it('keeps a mezzanine row with its own diameter and count', () => {
    const { joint, setJoint } = useQuotationStore.getState()
    const jointBoltMezzanine = joint.jointBoltMezzanine.map((r) =>
      r.mezzanineJointId === 'M' ? { ...r, boltDiameter: 16, numberOfBolts: 8 } : r,
    )
    setJoint({ jointBoltMezzanine })

    const payload = buildJointPayload(useQuotationStore.getState().joint)
    expect(payload.jointBoltMezzanine).toEqual([{ mezzanineJointId: 'M', boltDiameter: 16, numberOfBolts: 8 }])
  })

  it('keeps a mezzanine row carrying only a diameter', () => {
    const { joint, setJoint } = useQuotationStore.getState()
    const jointBoltMezzanine = joint.jointBoltMezzanine.map((r) =>
      r.mezzanineJointId === 'M' ? { ...r, boltDiameter: 16 } : r,
    )
    setJoint({ jointBoltMezzanine })

    const payload = buildJointPayload(useQuotationStore.getState().joint)
    expect(payload.jointBoltMezzanine).toEqual([{ mezzanineJointId: 'M', boltDiameter: 16 }])
  })

  it('omits arrays entirely when every row is a blank placeholder', () => {
    useQuotationStore.getState().setJoint({ secondaryBeamsBoltDiameter: 12 })
    const payload = buildJointPayload(useQuotationStore.getState().joint)
    expect(payload).not.toHaveProperty('jointBoltRoof')
    expect(payload).not.toHaveProperty('jointBoltMezzanine')
    expect(payload).not.toHaveProperty('foundationBoltRoof')
  })

  it('produces a payload that satisfies the create schema', () => {
    const { joint, setJoint } = useQuotationStore.getState()
    setJoint({
      canopyBoltType: 'ORD',
      canopyBoltDiameter: 12,
      foundationBoltRoof: joint.foundationBoltRoof.map((r) =>
        r.foundationJointId === 'FB4' ? { ...r, boltDiameter: 24, numberOfBolts: 4 } : r,
      ),
    })
    const payload = buildJointPayload(useQuotationStore.getState().joint)
    expect(createJointSchema.safeParse(payload).success).toBe(true)
  })
})
