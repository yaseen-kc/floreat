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
    expect(result.bolts.numberOfRoofJointBoltsQuantity).toBe(32)
    expect(result.bolts.numberOfFoundationBolts).toBe('20 MM DIA FOUNDATION BOLTS')
    expect(result.bolts.numberOfFoundationBoltsQuantity).toBe(64)
    expect(result.bolts.numberOfAnchorBolts).toBe('20 MM DIA ANCHOR BOLTS')
    expect(result.bolts.numberOfAnchorBoltsQuantity).toBe(0)
  })

  it('correctly calculates anchor bolts quantity when roofFrameBaseFixing is ANCHOR BOLT', () => {
    const jobInput = {
      roof: {
        buildingOverallLength: '30',
        mainRoofFrames: 4,
        endRoofFrames: 2,
        roofExtensionMidFrameCount: 45,
        roofExtensionEndFrameCount: 45,
        roofFrameBaseFixing: 'ANCHOR BOLT',
        internalColumnsForMainRoofFrames: 1,
        internalColumnsForEndRoofFrames: 1,
      },
      joint: {},
      jointBoltRoofs: [],
      foundationBoltRoof: [
        {
          foundationJointId: 'FB6',
          boltDiameter: '24',
          numberOfBolts: 4,
        },
      ],
    }

    const result = calculatePebQuantities(jobInput)

    // Total base locations = mainRoofFrames (4) + 2*endRoofFrames (4) + extensions (90) + main internal (4*1) + end internal (2*1) = 104
    // FB6 bolts = 4 => 4 * 104 = 416
    expect(result.bolts.numberOfAnchorBoltsQuantity).toBe(416)
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

  it('correctly calculates 1776 roof joint bolts and 848 foundation bolts for the benchmark job', () => {
    const jobInput = {
      roof: {
        buildingOverallLength: '30',
        mainRoofFrames: 4,
        endRoofFrames: 2,
        internalColumnsForMainRoofFrames: 1,
        internalColumnsForEndRoofFrames: 2,
        columnSegmentsInMainFrame: 1,
        raftersInOneHalfOfMainFrame: 2,
        columnSegmentsInEndFrame: 1,
        raftersInOneHalfOfEndFrame: 2,
        roofExtensionMidFrameCount: 45,
        roofExtensionEndFrameCount: 45,
      },
      joint: {},
      jointBoltRoofs: [
        { roofJointId: 'A', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'B', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'C', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'D', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'E', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'F', boltDiameter: '16', numberOfBolts: 4 },
        { roofJointId: 'G', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'H', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'I', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'J', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'K', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'L', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'A_1', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'B_1', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'B_2', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'C_1', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'D_1', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'G_1', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'H_1', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'I_1', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'K_1', boltDiameter: '16', numberOfBolts: 8 },
        { roofJointId: 'L_1', boltDiameter: '16', numberOfBolts: 8 },
      ],
      foundationBoltRoof: [
        { foundationJointId: 'FB4', boltDiameter: '20', numberOfBolts: 8 },
        { foundationJointId: 'FB5', boltDiameter: '20', numberOfBolts: 8 },
        { foundationJointId: 'FB6', boltDiameter: '20', numberOfBolts: 8 },
      ],
    }

    const result = calculatePebQuantities(jobInput)
    expect(result.bolts.numberOfRoofJointBoltsQuantity).toBe(1776)
    expect(result.bolts.numberOfFoundationBoltsQuantity).toBe(848)
  })
})
