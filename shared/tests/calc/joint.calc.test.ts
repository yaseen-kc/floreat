import { describe, it, expect } from 'vitest'
import {
  deriveJointBolts,
  BOLT_DIAMETER_SOURCE,
  FIXED_ROOF_BOLT_COUNTS,
  ROOF_COUNT_MIRRORS,
  MEZZ_COUNT_MIRRORS,
  type RoofBoltRow,
  type MezzanineBoltRow,
} from '../../src/calc/joint.calc.js'

/** Find a row by its id field in a derived result. */
const roof = (rows: RoofBoltRow[], id: string) => rows.find((r) => r.roofJointId === id)
const mezz = (rows: MezzanineBoltRow[], id: string) => rows.find((r) => r.mezzanineJointId === id)

describe('deriveJointBolts', () => {
  it('exposes the rule constants', () => {
    expect(BOLT_DIAMETER_SOURCE).toBe('A')
    expect(FIXED_ROOF_BOLT_COUNTS).toEqual({ F: 4, J: 8 })
    expect(ROOF_COUNT_MIRRORS).toEqual({ E: 'D' })
    expect(MEZZ_COUNT_MIRRORS).toEqual({ N: 'M', R: 'Q' })
  })

  it('syncs every roof & mezzanine diameter to Roof Joint A', () => {
    const { jointBoltRoof, jointBoltMezzanine } = deriveJointBolts(
      [
        { roofJointId: 'A', boltDiameter: 16 },
        { roofJointId: 'B', boltDiameter: 99 }, // stale — should be overwritten
        { roofJointId: 'C' },
      ],
      [{ mezzanineJointId: 'M' }, { mezzanineJointId: 'S', boltDiameter: 5 }],
    )
    expect(roof(jointBoltRoof, 'A')?.boltDiameter).toBe(16)
    expect(roof(jointBoltRoof, 'B')?.boltDiameter).toBe(16)
    expect(roof(jointBoltRoof, 'C')?.boltDiameter).toBe(16)
    expect(mezz(jointBoltMezzanine, 'M')?.boltDiameter).toBe(16)
    expect(mezz(jointBoltMezzanine, 'S')?.boltDiameter).toBe(16)
  })

  it('leaves dependent diameters blank when Joint A is blank', () => {
    const { jointBoltRoof, jointBoltMezzanine } = deriveJointBolts(
      [{ roofJointId: 'A' }, { roofJointId: 'B', boltDiameter: 20 }],
      [{ mezzanineJointId: 'M', boltDiameter: 20 }],
    )
    expect(roof(jointBoltRoof, 'B')?.boltDiameter).toBeUndefined()
    expect(mezz(jointBoltMezzanine, 'M')?.boltDiameter).toBeUndefined()
  })

  it('mirrors Roof Joint E count from D', () => {
    const { jointBoltRoof } = deriveJointBolts(
      [
        { roofJointId: 'D', numberOfBolts: 8 },
        { roofJointId: 'E', numberOfBolts: 99 }, // stale
      ],
      [],
    )
    expect(roof(jointBoltRoof, 'E')?.numberOfBolts).toBe(8)
  })

  it('ensures E exists (seeded from D) even when the input omits it', () => {
    const { jointBoltRoof } = deriveJointBolts([{ roofJointId: 'D', numberOfBolts: 6 }], [])
    expect(roof(jointBoltRoof, 'E')?.numberOfBolts).toBe(6)
  })

  it('clears E when D has no count', () => {
    const { jointBoltRoof } = deriveJointBolts(
      [{ roofJointId: 'D' }, { roofJointId: 'E', numberOfBolts: 3 }],
      [],
    )
    expect(roof(jointBoltRoof, 'E')?.numberOfBolts).toBeUndefined()
  })

  it('always fixes F at 4 and J at 8, even when absent from input', () => {
    const { jointBoltRoof } = deriveJointBolts(
      [{ roofJointId: 'F', numberOfBolts: 1 }], // stale F, J missing
      [],
    )
    expect(roof(jointBoltRoof, 'F')?.numberOfBolts).toBe(4)
    expect(roof(jointBoltRoof, 'J')?.numberOfBolts).toBe(8)
  })

  it('mirrors Mezzanine N from M and R from Q', () => {
    const { jointBoltMezzanine } = deriveJointBolts(
      [],
      [
        { mezzanineJointId: 'M', numberOfBolts: 8 },
        { mezzanineJointId: 'Q', numberOfBolts: 5 },
        { mezzanineJointId: 'N', numberOfBolts: 99 }, // stale
      ],
    )
    expect(mezz(jointBoltMezzanine, 'N')?.numberOfBolts).toBe(8)
    expect(mezz(jointBoltMezzanine, 'R')?.numberOfBolts).toBe(5)
  })

  it('clears N / R when their source has no count', () => {
    const { jointBoltMezzanine } = deriveJointBolts(
      [],
      [{ mezzanineJointId: 'M' }, { mezzanineJointId: 'N', numberOfBolts: 2 }],
    )
    expect(mezz(jointBoltMezzanine, 'N')?.numberOfBolts).toBeUndefined()
  })

  it('is idempotent', () => {
    const roofIn: RoofBoltRow[] = [
      { roofJointId: 'A', boltDiameter: 16 },
      { roofJointId: 'D', numberOfBolts: 8 },
    ]
    const mezzIn: MezzanineBoltRow[] = [
      { mezzanineJointId: 'M', numberOfBolts: 7 },
      { mezzanineJointId: 'Q', numberOfBolts: 3 },
    ]
    const first = deriveJointBolts(roofIn, mezzIn)
    const second = deriveJointBolts(first.jointBoltRoof, first.jointBoltMezzanine)
    expect(second).toEqual(first)
  })
})
