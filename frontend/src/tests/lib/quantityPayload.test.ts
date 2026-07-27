import { describe, it, expect } from 'vitest'
import {
  buildPebRoofPayload,
  buildCladdingPayload,
  buildCanopyPayload,
  buildAccessoriesPayload,
  buildMezzaninePayload,
  buildStairPayload,
  buildAdditionalBoltsPayload,
  buildFullQuantityPayload,
} from '@/lib/quantity-payload'
import {
  calculatePebQuantities,
  calculateCladdingQuantities,
  calculateCanopyQuantities,
  calculateAccessoriesQuantities,
  calculateMezzanineQuantities,
  calculateStairQuantities,
  calculateAdditionalBoltsQuantities,
} from '@floreat/shared/calc'
import { createQuantitySchema } from '@floreat/shared/schemas'

describe('quantityPayload', () => {
  const sampleRoof = {
    buildingOverallLength: 30,
    buildingOverallWidth: 15,
    eaveHeight: 6,
    roofSlope: 5,
    mainRoofFrames: 5,
    endRoofFrames: 2,
    roofPurlinSpacing: 1.2,
    roofPurlinType: 'Z_C',
    roofPurlinDepth: 150,
    roofPurlinUnitWeight: 4.5,
    roofCoveringType: 'PUFF_SHEET',
    roofCoveringThickness: 30,
    gradeOfPlateMaterial: 'FE_345',
    materialConsumptionExcludingPurlin: 12.5,
  }

  it('buildPebRoofPayload preserves string specification labels and float values', () => {
    const calc = calculatePebQuantities({ roof: sampleRoof })
    const payload = buildPebRoofPayload(calc, null, { raftersAndColumnsQuantity: '500' })

    expect(payload.raftersAndColumns).toBe('FE_345')
    expect(payload.roofSheet).toBe('30MM THICK PUFF_SHEET')
    expect(payload.roofPurlins).toBe('Z_CPURLIN 150 MM DEPTH')
    expect(payload.raftersAndColumnsQuantity).toBe(500)
    expect(typeof payload.noOfPurlinsInOneFrame).toBe('number')
  })

  it('buildCladdingPayload flattens cladding calculation correctly', () => {
    const calc = calculateCladdingQuantities({ roof: sampleRoof })
    const payload = buildCladdingPayload(calc, null, { claddingSheetAdditional: '100' })

    expect(payload.claddingSheetAdditional).toBe(100)
    expect(typeof payload.claddingStructureQuantity).toBe('number')
  })

  it('builds individual section payloads for canopy, accessories, mezzanine, stair, and additional bolts', () => {
    const canopyPayload = buildCanopyPayload(calculateCanopyQuantities({}), null, { canopyArea: '250' })
    expect(canopyPayload.canopyArea).toBe(250)

    const accPayload = buildAccessoriesPayload(calculateAccessoriesQuantities({}), null, { doors: '2' })
    expect(accPayload.doors).toBe('2')

    const mezPayload = buildMezzaninePayload(calculateMezzanineQuantities({}), null, { totalMezzanineAreaQuantity: '150' })
    expect(mezPayload.totalMezzanineAreaQuantity).toBe(150)

    const stairPayload = buildStairPayload(calculateStairQuantities({}), null, { totalWeightofStringerBeamsAdditional: '50' })
    expect(stairPayload.totalWeightofStringerBeamsAdditional).toBe(50)

    const boltsPayload = buildAdditionalBoltsPayload(calculateAdditionalBoltsQuantities({}), null, { jointBolt1Quantity: '12' })
    expect(boltsPayload.jointBolt1Quantity).toBe(12)
  })

  it('buildFullQuantityPayload produces a complete quantity object for all 7 sections', () => {
    const calcs = {
      pebRoof: calculatePebQuantities({ roof: sampleRoof }),
      cladding: calculateCladdingQuantities({ roof: sampleRoof }),
      canopy: calculateCanopyQuantities({}),
      accessories: calculateAccessoriesQuantities({}),
      mezzanine: calculateMezzanineQuantities({}),
      stair: calculateStairQuantities({}),
      additionalBolts: calculateAdditionalBoltsQuantities({}),
    }

    const fullPayload = buildFullQuantityPayload(calcs, null)

    expect(fullPayload.pebRoof?.raftersAndColumns).toBe('FE_345')
    expect(fullPayload.pebRoof).toBeDefined()
    expect(fullPayload.cladding).toBeDefined()
    expect(fullPayload.canopy).toBeDefined()
    expect(fullPayload.accessories).toBeDefined()
    expect(fullPayload.mezzanine).toBeDefined()
    expect(fullPayload.stair).toBeDefined()
    expect(fullPayload.additionalBolts).toBeDefined()

    const result = createQuantitySchema.safeParse(fullPayload)
    expect(result.success).toBe(true)
  })

  it('buildPebRoofPayload preserves initial user input overrides when draft is empty', () => {
    const calc = calculatePebQuantities({ roof: sampleRoof })
    const initialData = {
      lengthOfBuildingQuantity: 15.5,
      lengthOfOnePurlinQuantity: 22.4,
    }

    const payload = buildPebRoofPayload(calc, initialData, {})

    expect(payload.lengthOfBuildingQuantity).toBe(15.5)
    expect(payload.lengthOfOnePurlinQuantity).toBe(22.4)
  })

  it('buildFullQuantityPayload applies active sectionDrafts across all 7 sections', () => {
    const calcs = {
      pebRoof: calculatePebQuantities({ roof: sampleRoof }),
      cladding: calculateCladdingQuantities({ roof: sampleRoof }),
      canopy: calculateCanopyQuantities({}),
      accessories: calculateAccessoriesQuantities({}),
      mezzanine: calculateMezzanineQuantities({}),
      stair: calculateStairQuantities({}),
      additionalBolts: calculateAdditionalBoltsQuantities({}),
    }

    const sectionDrafts = {
      pebRoof: { lengthOfBuildingQuantity: '15.5' },
      cladding: { claddingSheetAdditional: '100' },
      canopy: { canopyArea: '250' },
      accessories: { doors: '2' },
      mezzanine: { totalMezzanineAreaQuantity: '150' },
      stair: { totalWeightofStringerBeamsAdditional: '50' },
      additionalBolts: { jointBolt1Quantity: '42' },
    }

    const fullPayload = buildFullQuantityPayload(calcs, null, sectionDrafts)

    expect(fullPayload.pebRoof?.lengthOfBuildingQuantity).toBe(15.5)
    expect(fullPayload.cladding?.claddingSheetAdditional).toBe(100)
    expect(fullPayload.canopy?.canopyArea).toBe(250)
    expect(fullPayload.accessories?.doors).toBe('2')
    expect(fullPayload.mezzanine?.totalMezzanineAreaQuantity).toBe(150)
    expect(fullPayload.stair?.totalWeightofStringerBeamsAdditional).toBe(50)
    expect(fullPayload.additionalBolts?.jointBolt1Quantity).toBe(42)
  })

  it('validates the user payload with numeric user inputs against createQuantitySchema', () => {
    const userPayloadWithNumericInputs = {
      pebRoof: {
        pebRoofValue: "TRUE",
        pebRoofQuantity: null,
        raftersAndColumns: "FE_345",
        raftersAndColumnsQuantity: null,
        lengthOfBuilding: 30,
        lengthOfBuildingQuantity: 456,
        inclinedLengthInOneHalf: 7.681,
        roofArea: 4959.055,
        materialConsumption: 1.25,
        roofPurlinsValue: 89,
        roofPurlins: "Z_CPURLIN 150 MM DEPTH",
        roofPurlinsQuantity: null,
        lengthOfOnePurlin: 6.4,
        lengthOfOnePurlinQuantity: 565,
        noOfPurlinsInOneFrame: 14.097,
        totalNoOfPurlinBay: 5,
        unitWeightOfPurlin: 4.72,
        noOfExtendedFrame: 9.501,
        noOfExtendedPurlinBay: 89,
        roofSheet: "30MM THICK PUFF_SHEET",
        roofSheetQuantity: null,
        roofSheetPurchaseQuantity: null,
        extendedRoofWidth: 12.066,
        extendedRoofWidthAdditonal: 456,
        extendedRoofLength: 534,
        roofAreaDeductions: 5,
        polyCarbonateAreaDeductions: 336,
        polyCarbonateSheetQuantity: null,
        polyCarbonateSheetPurchaseQuantity: null,
        lengthOfpolyCarbonateSheet: 6,
        lengthOfpolyCarbonateSheetAdditional: 4564,
        widthOfpolyCarbonateSheet: 7,
        NosOfpolyCarbonateSheet: 8,
        roofWindBracing: null,
        lengthOfSinlgeWindBracing: 9.637,
        lengthOfSinlgeWindBracingAdditional: 5432,
        totalNumberOfWindBracing: 8,
        unitWeightOfRoofWindBracing: 2.46,
        roofSagRoadValue: 8.501,
        roofSagRoadQuantity: null,
        lengthOfSingleSagRoad: 1.47,
        lengthOfSingleSagRoadAdditional: 6756,
        noOfSagRodInASingleFrame: 12.097,
        noOfBayInSagRodProvided: 5,
        noOfSagRodInExtendedFrame: 8.501,
        noOfExtendedSagRodBay: 89,
        unitWeightOfSagRod: 0.889,
        roofFlangeBraceQuantity: null,
        lengthOfMidFrameFlangeBrace: 1.5,
        lengthOfMidFrameFlangeBraceAdditional: 767,
        noOfFlangeBraceInMidFrame: 28.193,
        noOfFlangeBraceInEndFrame: 14.097,
        noOfMidFrame: 4,
        noOfEndFrame: 2,
        noOfFlngBraceInExtendedFrame: 19.002,
        noOfFlngBraceInExtendedFrame2: 9.501,
        noOfExtendedMidFrame: 45,
        noOfExtendedEndFrame: 45,
        lengthOfEndFrameFlangeBrace: 0.5,
        numberOfPurlinBolts: "12 MM DIA ORDINARY BOLTS",
        numberOfPurlinBoltsQuantity: null,
        noOfPurlinJointInSingleFrame: 14.097,
        totalnoOfFrames: 6,
        noOfPurlinnodeInExtendedFrame: 9.501,
        noOfExtendedFrames: 90,
        noOfBoltsInSinglePurlinJoint: 14,
        numberOfRoofJointBolts: "16 MM DIA HSFG BOLTS",
        numberOfRoofJointBoltsQuantity: null,
        numberOfFoundationBolts: "20 MM DIA FOUNDATION BOLTS",
        numberOfFoundationBoltsQuantity: null,
        numberOfAnchorBolts: "20 MM DIA ANCHOR BOLTS",
        numberOfAnchorBoltsQuantity: null
      },
      cladding: {
        claddingStructureQuantity: null,
        claddingEaveHeightFront: 3.25,
        claddingEaveHeightFrontAdditional: 3677,
        claddingEaveHeightBack: 3.25,
        claddingEaveHeightRight: 3.25,
        claddingEaveHeightLeft: 3.25,
        extendedColumnHeight: 1.989,
        widthOfExtendedFrame: 12,
        noOfSideCladdingPurlin: 2,
        noOfFaceCladdingPurlin: 4,
        totalLengthOfCladdingPurlin: 241.5,
        totalWeightofCladdingPurlin: 1139.88,
        claddingAreaWithoutAnyDeductions: 367.189,
        averageMaterialConsumption: 0.289,
        totalCladdingOpenings: 210,
        fasciaOpening: 51.7,
        claddingSheetQuantity: null,
        claddingSheetAdditional: 53,
        claddingSheetPurchase: null,
        columnWindBracings: null,
        columnWindBracingsAdditional: 44,
        claddingSagRod: null,
        claddingSagRodAdditional: 54,
        claddingFlangeBrace: null,
        claddingFlangeBraceAdditional: 65,
        numberOfCladdingPurlinBolts: null,
        numberOfCladdingPurlinBoltsAdditional: 75
      },
      canopy: {
        canopyStructureQuantity: 403.5,
        canopyArea: 322.8,
        canopyPurlinQuantity: 229.392,
        canopySheetQuantity: 30,
        canopySheetPurchaseQuantity: 33,
        canopyGutterQuantity: 15,
        canopyDownTakeQuantity: 14,
        canopySideCoveringQuantity: 9.5,
        canopyFlashingQuantity: 19,
        canopyPurlinBoltsQuantity: 120,
        canopyJointBoltsQuantity: 32
      },
      accessories: {
        doors: "1",
        doorsQuantity: 100,
        windows: "1",
        windowsQuantity: 100,
        fasciaStructureQuantity: 556.292,
        fasciaCoveringSheetBoardQuantity: 51.7,
        internalPartitionsQuantity: 900,
        ridgeQuantity: 442,
        gutterQuantity: 306,
        downtakeQuantity: 262.9,
        dripTrimQuantity: 546,
        gableEndFlashingQuantity: 109.757,
        cornerFlashQuantity: 33.477,
        rollingShutter: "1",
        rollingShutterQuantity: 100,
        louvers: "1",
        louversQuantity: 100,
        skyLight: "1",
        skyLightQuantity: 100,
        wallLight: "1",
        wallLightQuantity: 100,
        roofInsulation: "XLPE",
        roofInsulationQuantity: 6563.176,
        wallInsulation: "XLPE",
        wallInsulationQuantity: 105.489,
        turboVentilators: null,
        turboVentilatorsQuantity: 10,
        handrail: null,
        handrailQuantity: 250
      },
      mezzanine: {
        mezzanineStructure: null,
        mezzanineStructureQuantity: null,
        totalMezzanineArea: 171.4,
        totalMezzanineAreaQuantity: 4756,
        materialConsumption: null,
        deckSheetQuantity: null,
        deckSheetPurchaseQuantity: null,
        deckSheetQuantityAdditional: 46,
        shearStudsQuantity: null,
        shearStudsPurchaseQuantity: null,
        shearStudsQuantityAdditional: 5580,
        concreteFlashing: null,
        concreteFlashingAdditional: 6565,
        jointBolts: "16 MM DIA HSFG BOLTS",
        jointBoltsQuantity: null,
        foundationBoltsQuantity: null
      },
      stair: {
        totalAreaOfStairQuantity: null,
        totalWeightofStringerBeams: "HR_SECTION",
        totalWeightofStringerBeamsQuantity: null,
        totalWeightofStringerBeamsAdditional: 456,
        totalWeightofSteps: "CHQ_PLATE_6MM",
        totalWeightofStepsQuantity: null,
        totalWeightofStepsAdditional: 457
      },
      additionalBolts: {
        jointBolt1: null,
        jointBolt1Quantity: 10,
        jointBolt2: null,
        jointBolt2Quantity: 11,
        jointBolt3: null,
        jointBolt3Quantity: 12,
        purlinBolt: null,
        purlinBoltQuantity: 13,
        anchorBoltQuantity: 14,
        foundationBoltQuantity: 15
      }
    }

    const result = createQuantitySchema.safeParse(userPayloadWithNumericInputs)
    expect(result.success).toBe(true)
  })
})
