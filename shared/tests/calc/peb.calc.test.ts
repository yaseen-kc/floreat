import { describe, it, expect } from 'vitest'
import { calculatePebQuantities } from '../../src/calc/quantity/peb.calc.js'

describe('calculatePebQuantities', () => {
  it('correctly calculates extendedRoofLength, roof joint bolts, foundation bolts, and anchor bolts', () => {
    const jobInput = {
      roof: {
        buildingOverallLength: '30',
        mainRoofFrames: 4,
        endRoofFrames: 2,
        roofExtensionMidFrameCount: 45,
        roofExtensionEndFrameCount: 45,
      },
      joint: {},
      jointBoltRoofs: [
        {
          roofJointId: 'A',
          boltDiameter: '16',
          numberOfBolts: 8,
        },
      ],
      foundationBoltRoof: [
        {
          foundationJointId: 'FB4',
          boltDiameter: '20',
          numberOfBolts: 8,
        },
      ],
    }

    const result = calculatePebQuantities(jobInput)

    expect(result.roofSheet.extendedRoofLength).toBe(534)
    expect(result.bolts.numberOfRoofJointBolts).toBe('16 MM DIA HSFG BOLTS')
    expect(result.bolts.numberOfFoundationBolts).toBe('20 MM DIA FOUNDATION BOLTS')
    expect(result.bolts.numberOfAnchorBolts).toBe('20 MM DIA ANCHOR BOLTS')
  })

  it('handles foundationBoltRoof passed as a single object or empty', () => {
    const jobInput = {
      roof: {
        buildingOverallLength: '30',
        mainRoofFrames: 4,
        endRoofFrames: 2,
        roofExtensionMidFrameCount: 45,
        roofExtensionEndFrameCount: 45,
      },
      joint: {},
      jointBoltRoofs: [{ roofJointId: 'A', boltDiameter: '16', numberOfBolts: 8 }],
      foundationBoltRoof: { foundationJointId: 'FB4', boltDiameter: '20', numberOfBolts: 8 },
    }

    const result = calculatePebQuantities(jobInput)
    expect(result.bolts.numberOfFoundationBolts).toBe('20 MM DIA FOUNDATION BOLTS')
  })
})
