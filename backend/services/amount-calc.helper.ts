/**
 * Amount Calc Helper — computes server-authoritative baseline amounts for a job.
 * Loads canonical job input entities and rates from PostgreSQL and applies
 * pure equation functions from @floreat/shared/calc.
 */
import { prisma } from '../lib/prisma.js'
import { calculateAmountQuantities, deriveAmountItemRates, type AmountCalcInput } from '@floreat/shared/calc'
import { DEFAULT_AMOUNT_ITEMS, ITEM_PREFIX_MAP, type CreateAmountInput } from '@floreat/shared/schemas'

const parseNum = (v: unknown): number | undefined => {
  if (v == null || v === '' || v === 'User Input' || v === 'NA') return undefined
  const n = Number(v)
  return isNaN(n) ? undefined : n
}

export { ITEM_PREFIX_MAP }


/**
 * Computes baseline amount fields for a job from database job inputs & rate master data.
 */
export async function computeJobAmount(jobId: string): Promise<CreateAmountInput | null> {
  const [job, rates] = await Promise.all([
    prisma.job.findUnique({
      where: { id: jobId },
      include: {
        roof: { include: { sidewalls: { orderBy: [{ side: 'asc' }, { id: 'asc' }] } } },
        mezzanine: { include: { floors: { orderBy: [{ code: 'asc' }, { id: 'asc' }] }, extensions: { orderBy: [{ code: 'asc' }, { id: 'asc' }] } } },
        stair: { include: { stairs: { orderBy: [{ code: 'asc' }, { id: 'asc' }] }, areaDeductions: { orderBy: { id: 'asc' } } } },
        canopy: { include: { canopies: { orderBy: { id: 'asc' } } } },
        accessories: true,
        joint: {
          include: {
            jointBoltRoof: { orderBy: [{ roofJointId: 'asc' }, { id: 'asc' }] },
            jointBoltMezzanine: { orderBy: [{ mezzanineJointId: 'asc' }, { id: 'asc' }] },
            foundationBoltRoof: { orderBy: [{ foundationJointId: 'asc' }, { id: 'asc' }] },
          },
        },
        quantity: {
          include: {
            pebRoof: true,
            cladding: true,
            canopy: true,
            accessories: true,
            mezzanine: true,
            stair: true,
            additionalBolts: true,
          },
        },
      },
    }),
    prisma.rate.findMany(),
  ])

  if (!job) return null

  const roof = job.roof
  const canopy = job.canopy
  const mezzanine = job.mezzanine
  const stair = job.stair
  const joint = job.joint
  const accessories = job.accessories
  const quantity = job.quantity

  const input: AmountCalcInput = {
    buildingOverallLength: roof?.buildingOverallLength ? Number(roof.buildingOverallLength) : undefined,
    buildingOverallWidth: roof?.buildingOverallWidth ? Number(roof.buildingOverallWidth) : undefined,
    roofSlope: roof?.roofSlope ? Number(roof.roofSlope) : undefined,
    materialConsumptionExcludingPurlin: roof?.materialConsumptionExcludingPurlin ? Number(roof.materialConsumptionExcludingPurlin) : undefined,
    mainRoofFrames: roof?.mainRoofFrames ?? undefined,
    endRoofFrames: roof?.endRoofFrames ?? undefined,
    roofWindBracingSegmentsInOneHalf: roof?.roofWindBracingSegmentsInOneHalf ?? undefined,
    roofWindBracingProvidedBays: roof?.roofWindBracingProvidedBays ?? undefined,
    windBracingUnitWeight: roof?.windBracingUnitWeight ? Number(roof.windBracingUnitWeight) : undefined,
    columnWindBracingSegments: roof?.columnWindBracingSegments ?? undefined,
    columnWindBracingProvidedBays: roof?.columnWindBracingProvidedBays ?? undefined,
    windBracingColumnHeight: roof?.windBracingColumnHeight ? Number(roof.windBracingColumnHeight) : undefined,
    roofPurlinSpacing: roof?.roofPurlinSpacing ? Number(roof.roofPurlinSpacing) : undefined,
    roofExtensionWidthHeight: roof?.roofExtensionWidthHeight ? Number(roof.roofExtensionWidthHeight) : undefined,
    roofExtensionEndFrameCount: roof?.roofExtensionEndFrameCount ?? undefined,
    roofExtensionMidFrameCount: roof?.roofExtensionMidFrameCount ?? undefined,
    diaOfRoofSagRod: roof?.diaOfRoofSagRod ? Number(roof.diaOfRoofSagRod) : undefined,
    eaveHeight: roof?.eaveHeight ? Number(roof.eaveHeight) : undefined,
    claddingExtensionWidthHeight: roof?.claddingExtensionWidthHeight ? Number(roof.claddingExtensionWidthHeight) : undefined,
    frontCladdingOpeningArea: roof?.frontCladdingOpeningArea ? Number(roof.frontCladdingOpeningArea) : undefined,
    backCladdingOpeningArea: roof?.backCladdingOpeningArea ? Number(roof.backCladdingOpeningArea) : undefined,
    rightCladdingOpeningArea: roof?.rightCladdingOpeningArea ? Number(roof.rightCladdingOpeningArea) : undefined,
    leftCladdingOpeningArea: roof?.leftCladdingOpeningArea ? Number(roof.leftCladdingOpeningArea) : undefined,
    fasciaBoardArea: roof?.fasciaBoardArea ? Number(roof.fasciaBoardArea) : undefined,
    claddingPurlins: roof?.claddingPurlins ?? undefined,
    internalColumnsForEndRoofFrames: roof?.internalColumnsForEndRoofFrames ?? undefined,
    diaOfCladdingSagRod: roof?.diaOfCladdingSagRod ? Number(roof.diaOfCladdingSagRod) : undefined,
    roofFlangeBraceAverageLength: roof?.roofFlangeBraceAverageLength ? Number(roof.roofFlangeBraceAverageLength) : undefined,
    endFrameFlangeBraceAverageLength: roof?.endFrameFlangeBraceAverageLength ? Number(roof.endFrameFlangeBraceAverageLength) : undefined,
    claddingFlangeBraceAverageLength: roof?.claddingFlangeBraceAverageLength ? Number(roof.claddingFlangeBraceAverageLength) : undefined,
    roofPurlinUnitWeight: roof?.roofPurlinUnitWeight ? Number(roof.roofPurlinUnitWeight) : undefined,
    claddingPurlinUnitWeight: roof?.claddingPurlinUnitWeight ? Number(roof.claddingPurlinUnitWeight) : undefined,
    roofAreaDeduction: roof?.roofAreaDeduction ? Number(roof.roofAreaDeduction) : undefined,
    polycarbonateRoofLength: roof?.polycarbonateRoofLength ? Number(roof.polycarbonateRoofLength) : undefined,
    polycarbonateRoofWidth: roof?.polycarbonateRoofWidth ? Number(roof.polycarbonateRoofWidth) : undefined,
    polycarbonateRoofCount: roof?.polycarbonateRoofCount ?? undefined,
    raftersInOneHalfOfMainFrame: roof?.raftersInOneHalfOfMainFrame ?? undefined,
    raftersInOneHalfOfEndFrame: roof?.raftersInOneHalfOfEndFrame ?? undefined,
    fasciaMaterialWeightPerSqft: roof?.fasciaMaterialWeightPerSqft ? Number(roof.fasciaMaterialWeightPerSqft) : undefined,

    // Sidewalls
    sidewallFrontHeight: roof?.sidewalls?.find((s) => s.side === 'FRONT')?.height ? Number(roof.sidewalls.find((s) => s.side === 'FRONT')?.height) : undefined,
    sidewallBackHeight: roof?.sidewalls?.find((s) => s.side === 'BACK')?.height ? Number(roof.sidewalls.find((s) => s.side === 'BACK')?.height) : undefined,
    sidewallLeftHeight: roof?.sidewalls?.find((s) => s.side === 'LEFT')?.height ? Number(roof.sidewalls.find((s) => s.side === 'LEFT')?.height) : undefined,
    sidewallRightHeight: roof?.sidewalls?.find((s) => s.side === 'RIGHT')?.height ? Number(roof.sidewalls.find((s) => s.side === 'RIGHT')?.height) : undefined,

    // QuantityPebRoof fields
    pebLengthOfBuildingQuantity: parseNum(quantity?.pebRoof?.lengthOfBuildingQuantity),
    pebLengthOfSinlgeWindBracingAdditional: parseNum(quantity?.pebRoof?.lengthOfSinlgeWindBracingAdditional),
    pebLengthOfSingleSagRoadAdditional: parseNum(quantity?.pebRoof?.lengthOfSingleSagRoadAdditional),
    pebLengthOfMidFrameFlangeBraceAdditional: parseNum(quantity?.pebRoof?.lengthOfMidFrameFlangeBraceAdditional),
    pebLengthOfOnePurlinQuantity: parseNum(quantity?.pebRoof?.lengthOfOnePurlinQuantity),
    pebExtendedRoofWidthAdditonal: parseNum(quantity?.pebRoof?.extendedRoofWidthAdditonal),
    pebLengthOfpolyCarbonateSheetAdditional: parseNum(quantity?.pebRoof?.lengthOfpolyCarbonateSheetAdditional),

    // QuantityCladding fields
    claddingColumnWindBracingsAdditional: parseNum(quantity?.cladding?.columnWindBracingsAdditional),
    claddingSagRodAdditional: parseNum(quantity?.cladding?.claddingSagRodAdditional),
    claddingFlangeBraceAdditional: parseNum(quantity?.cladding?.claddingFlangeBraceAdditional),
    claddingEaveHeightFrontAdditional: parseNum(quantity?.cladding?.claddingEaveHeightFrontAdditional),
    claddingSheetAdditional: parseNum(quantity?.cladding?.claddingSheetAdditional),
    claddingNumberOfCladdingPurlinBoltsAdditional: parseNum(quantity?.cladding?.numberOfCladdingPurlinBoltsAdditional),

    // QuantityMezzanine fields
    mezzanineTotalMezzanineAreaQuantity: parseNum(quantity?.mezzanine?.totalMezzanineAreaQuantity),
    mezzanineConcreteFlashingAdditional: parseNum(quantity?.mezzanine?.concreteFlashingAdditional),
    mezzanineDeckSheetQuantityAdditional: parseNum(quantity?.mezzanine?.deckSheetQuantityAdditional),
    mezzanineShearStudsQuantityAdditional: parseNum(quantity?.mezzanine?.shearStudsQuantityAdditional),

    // QuantityStair fields
    stairTotalWeightofStringerBeamsAdditional: parseNum(quantity?.stair?.totalWeightofStringerBeamsAdditional),
    stairTotalWeightofStepsAdditional: parseNum(quantity?.stair?.totalWeightofStepsAdditional),

    // QuantityAdditionalBolts fields
    additionalPurlinBoltQuantity: parseNum(quantity?.additionalBolts?.purlinBoltQuantity),
    additionalJointBolt1Quantity: parseNum(quantity?.additionalBolts?.jointBolt1Quantity),
    additionalJointBolt2Quantity: parseNum(quantity?.additionalBolts?.jointBolt2Quantity),
    additionalJointBolt3Quantity: parseNum(quantity?.additionalBolts?.jointBolt3Quantity),
    additionalFoundationBoltQuantity: parseNum(quantity?.additionalBolts?.foundationBoltQuantity),
    additionalAnchorBoltQuantity: parseNum(quantity?.additionalBolts?.anchorBoltQuantity),

    // CanopyItem fields
    canopy0Length: canopy?.canopies?.[0]?.length ? Number(canopy.canopies[0].length) : undefined,
    canopy0Width: canopy?.canopies?.[0]?.width ? Number(canopy.canopies[0].width) : undefined,
    canopy0MaterialConsumptionKgPerSqft: canopy?.canopies?.[0]?.materialConsumptionKgPerSqft ? Number(canopy.canopies[0].materialConsumptionKgPerSqft) : undefined,
    canopy0NumberOfPurlins: canopy?.canopies?.[0]?.numberOfPurlins ?? undefined,
    canopy0NumberOfBeams: canopy?.canopies?.[0]?.numberOfBeams ?? undefined,
    canopy0Height: canopy?.canopies?.[0]?.height ? Number(canopy.canopies[0].height) : undefined,
    canopy0CanopySideCoveringHeight: canopy?.canopies?.[0]?.canopySideCoveringHeight ? Number(canopy.canopies[0].canopySideCoveringHeight) : undefined,

    // MezzanineFloor fields (MEZ_1)
    mez0LengthM: mezzanine?.floors?.[0]?.lengthM ? Number(mezzanine.floors[0].lengthM) : undefined,
    mez0WidthM: mezzanine?.floors?.[0]?.widthM ? Number(mezzanine.floors[0].widthM) : undefined,
    mezzanineMaterialConsumptionKgPerSqft: mezzanine?.floors?.[0]?.materialConsumptionKgPerSqft ? Number(mezzanine.floors[0].materialConsumptionKgPerSqft) : undefined,
    mez0BeamsMidPrimary: mezzanine?.floors?.[0]?.beamsMidPrimary ?? undefined,
    mez0JointsMidPrimary: mezzanine?.floors?.[0]?.jointsMidPrimary ?? undefined,
    mez0BeamsEndPrimary: mezzanine?.floors?.[0]?.beamsEndPrimary ?? undefined,
    mez0JointsEndPrimary: mezzanine?.floors?.[0]?.jointsEndPrimary ?? undefined,
    mez0InternalColumnsMidPrimary: mezzanine?.floors?.[0]?.internalColumnsMidPrimary ?? undefined,
    mez0InternalColumnsEndPrimary: mezzanine?.floors?.[0]?.internalColumnsEndPrimary ?? undefined,
    mez0BeamsSecondary: mezzanine?.floors?.[0]?.beamsSecondary ?? undefined,

    // MezzanineFloorExt fields (EXT_1)
    mezExt0LengthM: mezzanine?.extensions?.[0]?.lengthM ? Number(mezzanine.extensions[0].lengthM) : undefined,
    mezExt0WidthM: mezzanine?.extensions?.[0]?.widthM ? Number(mezzanine.extensions[0].widthM) : undefined,
    mezExt0BeamsMidPrimary: mezzanine?.extensions?.[0]?.beamsMidPrimary ?? undefined,
    mezExt0JointsMidPrimary: mezzanine?.extensions?.[0]?.jointsMidPrimary ?? undefined,
    mezExt0BeamsEndPrimary: mezzanine?.extensions?.[0]?.beamsEndPrimary ?? undefined,
    mezExt0JointsEndPrimary: mezzanine?.extensions?.[0]?.jointsEndPrimary ?? undefined,
    mezExt0ExtendedColumnsMidPrimary: mezzanine?.extensions?.[0]?.extendedColumnsMidPrimary ?? undefined,
    mezExt0ExtendedColumnsEndPrimary: mezzanine?.extensions?.[0]?.extendedColumnsEndPrimary ?? undefined,
    mezExt0BeamsSecondary: mezzanine?.extensions?.[0]?.beamsSecondary ?? undefined,

    // AreaDeduction
    areaDeduction0AreaM2: stair?.areaDeductions?.[0]?.areaM2 ? Number(stair.areaDeductions[0].areaM2) : undefined,
    areaDeduction0Numbers: stair?.areaDeductions?.[0]?.numbers ?? undefined,

    // StairItem fields (STAIR_1)
    stair0Length: stair?.stairs?.[0]?.length ? Number(stair.stairs[0].length) : undefined,
    stair0Width: stair?.stairs?.[0]?.width ? Number(stair.stairs[0].width) : undefined,
    stair0Height: stair?.stairs?.[0]?.height ? Number(stair.stairs[0].height) : undefined,
    stair0NumberOfMidLanding: stair?.stairs?.[0]?.numberOfMidLanding ?? undefined,
    stair0UnitWeightOfStringer: stair?.stairs?.[0]?.unitWeightOfStringer ? Number(stair.stairs[0].unitWeightOfStringer) : undefined,

    // BoltType fields
    boltTypePurlinFlangeBraceNumberOfBolts: joint?.purlinFlangeBraceNumberOfBolts ?? undefined,
    boltTypeCladdingPurlinsNumberOfBolts: joint?.claddingPurlinsNumberOfBolts ?? undefined,
    boltTypeCanopyNumberOfBolts: joint?.canopyNumberOfBolts ?? undefined,
    boltTypeSecondaryBeamsNumberOfBolts: joint?.secondaryBeamsNumberOfBolts ?? undefined,

    // Roof Joint Bolts
    jointHNumberOfBolts: joint?.jointBoltRoof?.find((j) => j.roofJointId === 'H')?.numberOfBolts ?? undefined,
    jointLNumberOfBolts: joint?.jointBoltRoof?.find((j) => j.roofJointId === 'L')?.numberOfBolts ?? undefined,
    jointH1NumberOfBolts: joint?.jointBoltRoof?.find((j) => j.roofJointId === 'H_1')?.numberOfBolts ?? undefined,
    jointINumberOfBolts: joint?.jointBoltRoof?.find((j) => j.roofJointId === 'I')?.numberOfBolts ?? undefined,
    jointI1NumberOfBolts: joint?.jointBoltRoof?.find((j) => j.roofJointId === 'I_1')?.numberOfBolts ?? undefined,
    jointBNumberOfBolts: joint?.jointBoltRoof?.find((j) => j.roofJointId === 'B')?.numberOfBolts ?? undefined,
    jointB1NumberOfBolts: joint?.jointBoltRoof?.find((j) => j.roofJointId === 'B_1')?.numberOfBolts ?? undefined,
    jointB2NumberOfBolts: joint?.jointBoltRoof?.find((j) => j.roofJointId === 'B_2')?.numberOfBolts ?? undefined,
    jointANumberOfBolts: joint?.jointBoltRoof?.find((j) => j.roofJointId === 'A')?.numberOfBolts ?? undefined,
    jointA1NumberOfBolts: joint?.jointBoltRoof?.find((j) => j.roofJointId === 'A_1')?.numberOfBolts ?? undefined,
    jointCNumberOfBolts: joint?.jointBoltRoof?.find((j) => j.roofJointId === 'C')?.numberOfBolts ?? undefined,
    jointC1NumberOfBolts: joint?.jointBoltRoof?.find((j) => j.roofJointId === 'C_1')?.numberOfBolts ?? undefined,

    // Mezzanine Joint Bolts
    jointMNumberOfBolts: joint?.jointBoltMezzanine?.find((j) => j.mezzanineJointId === 'M')?.numberOfBolts ?? undefined,
    jointONumberOfBolts: joint?.jointBoltMezzanine?.find((j) => j.mezzanineJointId === 'O')?.numberOfBolts ?? undefined,

    // Foundation Bolts
    foundationFB4NumberOfBolts: joint?.foundationBoltRoof?.find((j) => j.foundationJointId === 'FB4')?.numberOfBolts ?? undefined,
    foundationFB5NumberOfBolts: joint?.foundationBoltRoof?.find((j) => j.foundationJointId === 'FB5')?.numberOfBolts ?? undefined,
    foundationFB6NumberOfBolts: joint?.foundationBoltRoof?.find((j) => j.foundationJointId === 'FB6')?.numberOfBolts ?? undefined,

    // Accessories fields
    ridgeQuantityManual: accessories?.ridgeQuantityManual ? (accessories.ridgeQuantity ? Number(accessories.ridgeQuantity) : undefined) : undefined,
    gutterQuantityManual: accessories?.gutterQuantityManual ? (accessories.gutterQuantity ? Number(accessories.gutterQuantity) : undefined) : undefined,
    downTakeQuantityManual: accessories?.downTakeQuantityManual ? (accessories.downTakeQuantity ? Number(accessories.downTakeQuantity) : undefined) : undefined,
    dripTrimQuantityManual: accessories?.dripTrimQuantityManual ? (accessories.dripTrimQuantity ? Number(accessories.dripTrimQuantity) : undefined) : undefined,
    gableEndFlashingQuantityManual: accessories?.gableEndFlashingQuantityManual ? (accessories.gableEndFlashingQuantity ? Number(accessories.gableEndFlashingQuantity) : undefined) : undefined,
    cornerFlashQuantityManual: accessories?.cornerFlashQuantityManual ? (accessories.cornerFlashQuantity ? Number(accessories.cornerFlashQuantity) : undefined) : undefined,
    rollingShutterLength: accessories?.rollingShutterLength ? Number(accessories.rollingShutterLength) : undefined,
    rollingShutterWidth: accessories?.rollingShutterWidth ? Number(accessories.rollingShutterWidth) : undefined,
    rollingShutterNos: accessories?.rollingShutterNos ?? undefined,
    louverLength: accessories?.louverLength ? Number(accessories.louverLength) : undefined,
    louverWidth: accessories?.louverWidth ? Number(accessories.louverWidth) : undefined,
    louverNos: accessories?.louverNos ?? undefined,
    skyLightLength: accessories?.skyLightLength ? Number(accessories.skyLightLength) : undefined,
    skyLightWidth: accessories?.skyLightWidth ? Number(accessories.skyLightWidth) : undefined,
    skyLightNos: accessories?.skyLightNos ?? undefined,
    wallLightLength: accessories?.wallLightLength ? Number(accessories.wallLightLength) : undefined,
    wallLightWidth: accessories?.wallLightWidth ? Number(accessories.wallLightWidth) : undefined,
    wallLightNos: accessories?.wallLightNos ?? undefined,
    turboVentilatorNos: accessories?.turboVentilatorNos ?? undefined,
    handrailWeightKg: accessories?.handrailWeightKg ? Number(accessories.handrailWeightKg) : undefined,
    doorHeight: accessories?.doorHeight ? Number(accessories.doorHeight) : undefined,
    doorWidth: accessories?.doorWidth ? Number(accessories.doorWidth) : undefined,
    doorNos: accessories?.doorNos ?? undefined,
    windowHeight: accessories?.windowHeight ? Number(accessories.windowHeight) : undefined,
    windowWidth: accessories?.windowWidth ? Number(accessories.windowWidth) : undefined,
    windowNos: accessories?.windowNos ?? undefined,
    partitionQuantity: accessories?.partitionQuantity ? Number(accessories.partitionQuantity) : undefined,
  }

  const calculatedQuantities = calculateAmountQuantities(input)
  const rateByItem = new Map(rates.map((r) => [r.item, r]))

  const missingRates = DEFAULT_AMOUNT_ITEMS
    .map((item) => item.rateItem)
    .filter((item): item is string => Boolean(item && !rateByItem.has(item)))
  if (missingRates.length) {
    throw new Error(`Missing required rate items: ${missingRates.join(', ')}`)
  }

  const payload: Record<string, number | null> = {}

  for (const item of DEFAULT_AMOUNT_ITEMS) {
    const prefix = ITEM_PREFIX_MAP[item.description]
    if (!prefix) continue

    const qtyKey = `${prefix}Quantity` as keyof typeof calculatedQuantities
    const qty = calculatedQuantities[qtyKey] ?? 0
    const ratesForDesc = deriveAmountItemRates(item.rateItem ? rateByItem.get(item.rateItem) : null)

    const amtFab = qty * ratesForDesc.rateFabrication
    const amtErec = qty * ratesForDesc.rateErection
    const amtLoad = qty * ratesForDesc.rateLoading

    payload[`${prefix}Quantity`] = qty
    payload[`${prefix}FabricationRate`] = ratesForDesc.rateFabrication
    payload[`${prefix}ErrectionRate`] = ratesForDesc.rateErection
    payload[`${prefix}LoadingRate`] = ratesForDesc.rateLoading
    payload[`${prefix}FabricationAmount`] = amtFab
    payload[`${prefix}ErrectionAmount`] = amtErec
    payload[`${prefix}LoadingAmount`] = amtLoad
  }

  return payload as CreateAmountInput
}
