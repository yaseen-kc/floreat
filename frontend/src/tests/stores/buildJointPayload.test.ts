import { describe, it, expect, beforeEach } from 'vitest'
import { useQuotationStore, buildJointPayload } from '@/stores/quotation-store'
import { createJointSchema } from '@/schemas/joint.schema'

/** Set one roof row's fields (by id) via setJoint so derivation runs. */
const setRoofRow = (id: string, patch: Record<string, unknown>) => {
  const { joint, setJoint } = useQuotationStore.getState()
  setJoint({ jointBoltRoof: joint.jointBoltRoof.map((r) => (r.roofJointId === id ? { ...r, ...patch } : r)) })
}
const setMezzRow = (id: string, patch: Record<string, unknown>) => {
  const { joint, setJoint } = useQuotationStore.getState()
  setJoint({ jointBoltMezzanine: joint.jointBoltMezzanine.map((r) => (r.mezzanineJointId === id ? { ...r, ...patch } : r)) })
}
const roofPayload = (id: string) =>
  buildJointPayload(useQuotationStore.getState().joint).jointBoltRoof?.find((r) => r.roofJointId === id)
const mezzPayload = (id: string) =>
  buildJointPayload(useQuotationStore.getState().joint).jointBoltMezzanine?.find((r) => r.mezzanineJointId === id)

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

  it('propagates Joint A diameter to every roof and mezzanine row', () => {
    setRoofRow('A', { boltDiameter: 20, numberOfBolts: 6 })
    // A itself.
    expect(roofPayload('A')).toMatchObject({ boltDiameter: 20, numberOfBolts: 6 })
    // A dependent roof rows all carry A's diameter.
    expect(roofPayload('B')?.boltDiameter).toBe(20)
    expect(roofPayload('L_1')?.boltDiameter).toBe(20)
    // Mezzanine rows follow A too, even though A is a roof joint.
    expect(mezzPayload('M')?.boltDiameter).toBe(20)
    expect(mezzPayload('SEC')?.boltDiameter).toBe(20)
  })

  it('mirrors roof E count from D and fixes F=4 / J=8', () => {
    setRoofRow('D', { numberOfBolts: 8 })
    expect(roofPayload('E')?.numberOfBolts).toBe(8)
    expect(roofPayload('F')?.numberOfBolts).toBe(4)
    expect(roofPayload('J')?.numberOfBolts).toBe(8)
  })

  it('mirrors mezzanine N from M and R from Q', () => {
    setMezzRow('M', { numberOfBolts: 7 })
    setMezzRow('Q', { numberOfBolts: 3 })
    expect(mezzPayload('N')?.numberOfBolts).toBe(7)
    expect(mezzPayload('R')?.numberOfBolts).toBe(3)
  })

  it('cannot set a mezzanine diameter independently of Joint A', () => {
    // Joint A is blank, so a directly-set mezzanine diameter is cleared by derivation.
    setMezzRow('M', { boltDiameter: 16, numberOfBolts: 8 })
    expect(mezzPayload('M')?.boltDiameter).toBeUndefined()
    expect(mezzPayload('M')?.numberOfBolts).toBe(8)
  })

  it('injects fixed F/J roof rows on any edit, but no mezz/foundation rows', () => {
    useQuotationStore.getState().setJoint({ secondaryBeamsBoltDiameter: 12 })
    const payload = buildJointPayload(useQuotationStore.getState().joint)
    // The fixed F=4 / J=8 rows are always present once the draft is touched.
    expect(roofPayload('F')?.numberOfBolts).toBe(4)
    expect(roofPayload('J')?.numberOfBolts).toBe(8)
    // Mezzanine and foundation stay empty (nothing seeds them).
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
    setRoofRow('A', { boltDiameter: 16, numberOfBolts: 8 })
    const payload = buildJointPayload(useQuotationStore.getState().joint)
    expect(createJointSchema.safeParse(payload).success).toBe(true)
  })
})
