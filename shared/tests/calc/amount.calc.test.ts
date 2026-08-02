import { describe, it, expect } from 'vitest'
import {
  qtyN5SteelStructures,
  qtyN6WindBracings,
  qtyN7SagRod,
  qtyN8FlangeBrace,
  qtyN9ZCPurlins,
  qtyN10RoofSheet,
  qtyN11CladdingSheet,
  qtyN12CanopySheet,
  qtyN13PurlinBolts,
  qtyN14JointBolts,
  qtyN15FoundationBolts,
  qtyN16AnchorBolts,
  qtyN17Ridge,
  qtyN18Gutter,
  qtyN19Downtake,
  qtyN20DripTrim,
  qtyN21Flashing,
  qtyN22RollingShutter,
  qtyN23Louvers,
  qtyN24SkyLight,
  qtyN25WallLight,
  qtyN26RoofInsulation,
  qtyN27WallInsulation,
  qtyN28TurboVentilators,
  qtyN29DeckingSheet,
  qtyN30ShearStuds,
  qtyN31PolyCarbonateSheet,
  qtyN32Stair1,
  qtyN33Stair2,
  qtyN34Handrail,
  qtyN35CanopySideCovering,
  qtyN36Doors,
  qtyN37Windows,
  qtyN38FasciaStructure,
  qtyN39FasciaCoveringSheetBoard,
  qtyN40InternalPartitions,
  calculateAmountQuantities,
} from '../../src/calc/amount.calc.js'

describe('amount.calc line-item quantity functions (N5 to N40)', () => {
  describe('qtyN5SteelStructures', () => {
    it('returns 0 when every input is blank', () => {
      expect(qtyN5SteelStructures({})).toBe(0)
    })

    it('computes the roof term alone', () => {
      const result = qtyN5SteelStructures({
        buildingOverallLength: 10,
        buildingOverallWidth: 10,
        roofSlope: 0,
        materialConsumptionExcludingPurlin: 1,
      })
      expect(result).toBeCloseTo(1106.128, 6)
    })

    it('computes the canopy term alone', () => {
      const result = qtyN5SteelStructures({
        canopy0Length: 4,
        canopy0Width: 5,
        canopy0MaterialConsumptionKgPerSqft: 2,
      })
      expect(result).toBeCloseTo(430.4, 6)
    })

    it('computes the mezzanine term alone', () => {
      const result = qtyN5SteelStructures({
        mez0LengthM: 10,
        mez0WidthM: 8,
        mezzanineMaterialConsumptionKgPerSqft: 1.5,
        mezExt0LengthM: 6,
        mezExt0WidthM: 6,
        areaDeduction0AreaM2: 2,
        areaDeduction0Numbers: 3,
        stair0Length: 3,
        stair0Width: 2,
      })
      expect(result).toBeCloseTo(1678.56, 6)
    })

    it('computes the stair step term alone', () => {
      const result = qtyN5SteelStructures({ stair0Height: 4.5, stair0Width: 1.2 })
      expect(result).toBeCloseTo(381.51, 6)
    })

    it('computes the stair stringer term alone', () => {
      const result = qtyN5SteelStructures({
        stair0Height: 3,
        stair0NumberOfMidLanding: 1,
        stair0Length: 5,
        stair0UnitWeightOfStringer: 10,
      })
      expect(result).toBeCloseTo(254.1640786499874, 6)
    })
  })

  describe('qtyN6WindBracings', () => {
    it('returns 0 when inputs are empty or unit weight is 0', () => {
      expect(qtyN6WindBracings({})).toBe(0)
    })

    it('computes wind bracing quantity correctly', () => {
      const result = qtyN6WindBracings({
        buildingOverallWidth: 20,
        buildingOverallLength: 30,
        roofSlope: 0,
        roofWindBracingSegmentsInOneHalf: 2,
        mainRoofFrames: 5,
        endRoofFrames: 2,
        roofWindBracingProvidedBays: 2,
        windBracingUnitWeight: 5,
        columnWindBracingSegments: 2,
        columnWindBracingProvidedBays: 2,
        windBracingColumnHeight: 6,
      })
      expect(result).toBeGreaterThan(0)
    })
  })

  describe('qtyN7SagRod', () => {
    it('returns 0 when sag rod diameter is 0', () => {
      expect(qtyN7SagRod({})).toBe(0)
    })

    it('computes sag rod quantity with roof and cladding terms', () => {
      const result = qtyN7SagRod({
        buildingOverallWidth: 20,
        buildingOverallLength: 30,
        roofSlope: 5,
        roofPurlinSpacing: 1.5,
        mainRoofFrames: 5,
        endRoofFrames: 2,
        diaOfRoofSagRod: 12,
        claddingPurlins: 4,
        internalColumnsForEndRoofFrames: 2,
        diaOfCladdingSagRod: 10,
        eaveHeight: 6,
      })
      expect(result).toBeGreaterThan(0)
    })
  })

  describe('qtyN8FlangeBrace', () => {
    it('computes flange brace quantity', () => {
      const result = qtyN8FlangeBrace({
        buildingOverallWidth: 20,
        roofSlope: 0,
        roofPurlinSpacing: 1.5,
        mainRoofFrames: 4,
        endRoofFrames: 2,
        roofFlangeBraceAverageLength: 1.2,
        endFrameFlangeBraceAverageLength: 1.1,
        claddingPurlins: 3,
        claddingFlangeBraceAverageLength: 1.0,
      })
      expect(result).toBeGreaterThan(0)
    })
  })

  describe('qtyN9ZCPurlins', () => {
    it('computes Z/C purlins quantity', () => {
      const result = qtyN9ZCPurlins({
        buildingOverallLength: 30,
        buildingOverallWidth: 20,
        roofSlope: 5,
        mainRoofFrames: 5,
        endRoofFrames: 2,
        roofPurlinSpacing: 1.5,
        roofPurlinUnitWeight: 4.5,
        eaveHeight: 6,
        claddingPurlins: 4,
        claddingPurlinUnitWeight: 4.0,
      })
      expect(result).toBeGreaterThan(0)
    })
  })

  describe('qtyN10RoofSheet & qtyN26RoofInsulation', () => {
    it('computes roof sheet area', () => {
      const result = qtyN10RoofSheet({
        buildingOverallLength: 30,
        buildingOverallWidth: 20,
        roofSlope: 5,
        mainRoofFrames: 5,
        endRoofFrames: 2,
      })
      expect(result).toBeGreaterThan(0)
      expect(qtyN26RoofInsulation({
        buildingOverallLength: 30,
        buildingOverallWidth: 20,
        roofSlope: 5,
        mainRoofFrames: 5,
        endRoofFrames: 2,
      })).toEqual(result)
    })
  })

  describe('qtyN11CladdingSheet & qtyN27WallInsulation', () => {
    it('computes cladding sheet area', () => {
      const input = {
        buildingOverallLength: 30,
        buildingOverallWidth: 20,
        eaveHeight: 6,
        roofSlope: 5,
      }
      const result = qtyN11CladdingSheet(input)
      expect(result).toBeGreaterThan(0)
      expect(qtyN27WallInsulation(input)).toEqual(result)
    })
  })

  describe('qtyN12CanopySheet', () => {
    it('computes canopy sheet area', () => {
      expect(qtyN12CanopySheet({ canopy0Length: 5, canopy0Width: 4 })).toBe(20)
    })
  })

  describe('qtyN13PurlinBolts', () => {
    it('computes purlin bolts quantity', () => {
      const result = qtyN13PurlinBolts({
        buildingOverallWidth: 20,
        roofSlope: 0,
        roofPurlinSpacing: 1.5,
        mainRoofFrames: 4,
        endRoofFrames: 2,
        boltTypePurlinFlangeBraceNumberOfBolts: 4,
        claddingPurlins: 3,
        canopy0NumberOfPurlins: 2,
        canopy0NumberOfBeams: 3,
        boltTypeCladdingPurlinsNumberOfBolts: 2,
      })
      expect(result).toBeGreaterThan(0)
    })
  })

  describe('qtyN14JointBolts', () => {
    it('computes joint bolts quantity preserving canopy bolt quirk for extension secondary beams', () => {
      const result = qtyN14JointBolts({
        mainRoofFrames: 5,
        endRoofFrames: 2,
        jointANumberOfBolts: 8,
        jointBNumberOfBolts: 6,
        raftersInOneHalfOfMainFrame: 3,
        canopy0NumberOfBeams: 4,
        boltTypeCanopyNumberOfBolts: 4,
        mez0BeamsMidPrimary: 2,
        mez0JointsMidPrimary: 2,
        jointMNumberOfBolts: 4,
        mezExt0BeamsMidPrimary: 2,
        mezExt0JointsMidPrimary: 2,
        mezExt0BeamsSecondary: 3,
      })
      expect(result).toBeGreaterThan(0)
    })
  })

  describe('qtyN15FoundationBolts', () => {
    it('computes foundation bolts quantity', () => {
      const result = qtyN15FoundationBolts({
        foundationFB4NumberOfBolts: 4,
        mainRoofFrames: 5,
        endRoofFrames: 2,
        additionalFoundationBoltQuantity: 10,
      })
      expect(result).toBe(4 * 5 * 1 * 1 + 4 * 2 * 2 * 1 + 10) // 20 + 16 + 10 = 46
    })
  })

  describe('qtyN16AnchorBolts', () => {
    it('returns anchor bolt quantity', () => {
      expect(qtyN16AnchorBolts({ additionalAnchorBoltQuantity: 24 })).toBe(24)
    })
  })

  describe('qtyN17Ridge', () => {
    it('computes ridge length', () => {
      expect(qtyN17Ridge({ buildingOverallLength: 30, ridgeQuantityManual: 5 })).toBe(35)
    })
  })

  describe('qtyN18Gutter', () => {
    it('computes gutter length', () => {
      expect(qtyN18Gutter({ buildingOverallLength: 30, gutterQuantityManual: 2, canopy0Length: 6 })).toBe(68)
    })
  })

  describe('qtyN19Downtake', () => {
    it('computes downtake length', () => {
      const result = qtyN19Downtake({
        mainRoofFrames: 5,
        endRoofFrames: 2,
        eaveHeight: 6,
        downTakeQuantityManual: 4,
        canopy0NumberOfBeams: 2,
        canopy0Height: 3,
      })
      expect(result).toBe(7 * 6 + 4 + 2 * 3) // 42 + 4 + 6 = 52
    })
  })

  describe('qtyN20DripTrim', () => {
    it('computes drip trim length', () => {
      expect(qtyN20DripTrim({ buildingOverallLength: 30, buildingOverallWidth: 20, dripTrimQuantityManual: 10 })).toBe(110)
    })
  })

  describe('qtyN21Flashing', () => {
    it('computes flashing running length', () => {
      const result = qtyN21Flashing({
        canopy0Length: 5,
        canopy0Width: 3,
        buildingOverallWidth: 20,
        roofSlope: 5,
        eaveHeight: 6,
        cornerFlashQuantityManual: 8,
      })
      expect(result).toBeGreaterThan(0)
    })
  })

  describe('qtyN22RollingShutter', () => {
    it('computes rolling shutter area', () => {
      expect(qtyN22RollingShutter({ rollingShutterLength: 4, rollingShutterWidth: 3, rollingShutterNos: 2 })).toBe(24)
    })
  })

  describe('qtyN23Louvers', () => {
    it('computes louvers area', () => {
      expect(qtyN23Louvers({ louverLength: 2, louverWidth: 1.5, louverNos: 4 })).toBe(12)
    })
  })

  describe('qtyN24SkyLight', () => {
    it('computes sky light area', () => {
      expect(qtyN24SkyLight({ skyLightLength: 3, skyLightWidth: 1, skyLightNos: 6 })).toBe(18)
    })
  })

  describe('qtyN25WallLight', () => {
    it('computes wall light area', () => {
      expect(qtyN25WallLight({ wallLightLength: 2, wallLightWidth: 1, wallLightNos: 8 })).toBe(16)
    })
  })

  describe('qtyN28TurboVentilators', () => {
    it('returns turbo ventilators count', () => {
      expect(qtyN28TurboVentilators({ turboVentilatorNos: 5 })).toBe(5)
    })
  })

  describe('qtyN29DeckingSheet', () => {
    it('computes decking sheet area', () => {
      const result = qtyN29DeckingSheet({
        mez0LengthM: 10,
        mez0WidthM: 8,
        areaDeduction0AreaM2: 2,
        areaDeduction0Numbers: 1,
        stair0Length: 3,
        stair0Width: 2,
        mezzanineDeckSheetQuantityAdditional: 5,
      })
      // netArea = (80 - 2 - 6) * 1.1 = 72 * 1.1 = 79.2; + 5 = 84.2
      expect(result).toBeCloseTo(84.2, 6)
    })
  })

  describe('qtyN30ShearStuds', () => {
    it('computes shear studs quantity', () => {
      const result = qtyN30ShearStuds({
        mez0LengthM: 10,
        mez0BeamsSecondary: 4,
        mezzanineShearStudsQuantityAdditional: 20,
      })
      // 20 + 40 / 0.4 = 20 + 100 = 120
      expect(result).toBe(120)
    })
  })

  describe('qtyN31PolyCarbonateSheet', () => {
    it('returns polycarbonate sheet quantity', () => {
      expect(qtyN31PolyCarbonateSheet({ pebLengthOfpolyCarbonateSheetAdditional: 15 })).toBe(15)
    })
  })

  describe('qtyN32Stair1 & qtyN33Stair2', () => {
    it('computes stair 1 stringer weight', () => {
      const result = qtyN32Stair1({
        stair0Height: 3,
        stair0NumberOfMidLanding: 1,
        stair0Length: 5,
        stair0UnitWeightOfStringer: 10,
      })
      expect(result).toBeCloseTo(254.1640786499874, 6)
    })

    it('computes stair 2 steps weight', () => {
      const result = qtyN33Stair2({ stair0Height: 4.5, stair0Width: 1.2 })
      expect(result).toBeCloseTo(381.51, 6)
    })
  })

  describe('qtyN34Handrail', () => {
    it('returns handrail weight', () => {
      expect(qtyN34Handrail({ handrailWeightKg: 150 })).toBe(150)
    })
  })

  describe('qtyN35CanopySideCovering', () => {
    it('computes canopy side covering area', () => {
      expect(qtyN35CanopySideCovering({ canopy0Width: 3, canopy0Length: 5, canopy0CanopySideCoveringHeight: 2 })).toBe(22)
    })
  })

  describe('qtyN36Doors & qtyN37Windows', () => {
    it('computes doors area', () => {
      expect(qtyN36Doors({ doorHeight: 2.1, doorWidth: 1.2, doorNos: 3 })).toBeCloseTo(7.56, 6)
    })

    it('computes windows area', () => {
      expect(qtyN37Windows({ windowHeight: 1.5, windowWidth: 1.2, windowNos: 4 })).toBeCloseTo(7.2, 6)
    })
  })

  describe('qtyN38FasciaStructure & qtyN39FasciaCoveringSheetBoard', () => {
    it('computes fascia structure weight and covering sheet board area', () => {
      expect(qtyN39FasciaCoveringSheetBoard({ fasciaBoardArea: 25 })).toBe(25)
      expect(qtyN38FasciaStructure({ fasciaBoardArea: 25, fasciaMaterialWeightPerSqft: 2 })).toBeCloseTo(538, 6)
    })
  })

  describe('qtyN40InternalPartitions', () => {
    it('returns internal partitions quantity', () => {
      expect(qtyN40InternalPartitions({ partitionQuantityX11: 45 })).toBe(45)
    })
  })

  describe('calculateAmountQuantities', () => {
    it('returns an object containing all 36 line item quantities', () => {
      const res = calculateAmountQuantities({
        buildingOverallLength: 10,
        buildingOverallWidth: 10,
        roofSlope: 0,
        materialConsumptionExcludingPurlin: 1,
      })
      expect(Object.keys(res)).toHaveLength(36)
      expect(res.steelStructuresQuantity).toBeGreaterThan(0)
    })
  })
})
