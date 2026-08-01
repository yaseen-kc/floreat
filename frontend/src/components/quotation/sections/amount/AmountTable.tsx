import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { DEFAULT_AMOUNT_ITEMS, ITEM_PREFIX_MAP } from '@floreat/shared/schemas'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Badge } from '@/components/ui/badge'
import { Num } from '@/components/ui/num'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calculator } from 'lucide-react'
import { calculateAmountQuantities, deriveAmountItemRates } from '@floreat/shared/calc'
import { useRates } from '@/api/quotation/rate/getRate'
import { useMemo } from 'react'

/** Coerce a possibly undefined/null Decimal string or number from API/store to a number or undefined. */
const parseNum = (v?: string | number | null): number | undefined => (v == null ? undefined : Number(v))

/**
 * Read-only bill-of-quantities table for Step 12. Displays the 36 canonical
 * amount line items with quantities derived from earlier steps via shared calc.
 */
export function AmountTable() {
  const { roof, canopy, mezzanine, stair, joint, accessories, quantity, amount } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      canopy: s.canopy,
      mezzanine: s.mezzanine,
      stair: s.stair,
      joint: s.joint,
      accessories: s.accessories,
      quantity: s.quantity,
      amount: s.amount,
    })),
  )


  const { data: ratesPage } = useRates(1, 100)
  const rateByItem = new Map((ratesPage?.data ?? []).map((r) => [r.item, r]))

  const calculated = calculateAmountQuantities({    // Roof fields
    buildingOverallLength: roof.buildingOverallLength,
    buildingOverallWidth: roof.buildingOverallWidth,
    roofSlope: roof.roofSlope,
    materialConsumptionExcludingPurlin: roof.materialConsumptionExcludingPurlin,
    mainRoofFrames: roof.mainRoofFrames,
    endRoofFrames: roof.endRoofFrames,
    roofWindBracingSegmentsInOneHalf: roof.roofWindBracingSegmentsInOneHalf,
    roofWindBracingProvidedBays: roof.roofWindBracingProvidedBays,
    windBracingUnitWeight: roof.windBracingUnitWeight,
    columnWindBracingSegments: roof.columnWindBracingSegments,
    columnWindBracingProvidedBays: roof.columnWindBracingProvidedBays,
    windBracingColumnHeight: roof.windBracingColumnHeight,
    roofPurlinSpacing: roof.roofPurlinSpacing,
    roofExtensionWidthHeight: roof.roofExtensionWidthHeight,
    roofExtensionEndFrameCount: roof.roofExtensionEndFrameCount,
    roofExtensionMidFrameCount: roof.roofExtensionMidFrameCount,
    diaOfRoofSagRod: roof.diaOfRoofSagRod,
    eaveHeight: roof.eaveHeight,
    claddingExtensionWidthHeight: roof.claddingExtensionWidthHeight,
    frontCladdingOpeningArea: roof.frontCladdingOpeningArea,
    backCladdingOpeningArea: roof.backCladdingOpeningArea,
    rightCladdingOpeningArea: roof.rightCladdingOpeningArea,
    leftCladdingOpeningArea: roof.leftCladdingOpeningArea,
    fasciaBoardArea: roof.fasciaBoardArea,
    claddingPurlins: roof.claddingPurlins,
    internalColumnsForEndRoofFrames: roof.internalColumnsForEndRoofFrames,
    diaOfCladdingSagRod: roof.diaOfCladdingSagRod,
    roofFlangeBraceAverageLength: roof.roofFlangeBraceAverageLength,
    endFrameFlangeBraceAverageLength: roof.endFrameFlangeBraceAverageLength,
    claddingFlangeBraceAverageLength: roof.claddingFlangeBraceAverageLength,
    roofPurlinUnitWeight: roof.roofPurlinUnitWeight,
    claddingPurlinUnitWeight: roof.claddingPurlinUnitWeight,
    roofAreaDeduction: roof.roofAreaDeduction,
    polycarbonateRoofLength: roof.polycarbonateRoofLength,
    polycarbonateRoofWidth: roof.polycarbonateRoofWidth,
    polycarbonateRoofCount: roof.polycarbonateRoofCount,
    raftersInOneHalfOfMainFrame: roof.raftersInOneHalfOfMainFrame,
    raftersInOneHalfOfEndFrame: roof.raftersInOneHalfOfEndFrame,
    fasciaMaterialWeightPerSqft: roof.fasciaMaterialWeightPerSqft,

    // Sidewalls
    sidewallFrontHeight: roof.sidewalls?.find((s) => s.side === 'FRONT')?.height,
    sidewallBackHeight: roof.sidewalls?.find((s) => s.side === 'BACK')?.height,
    sidewallLeftHeight: roof.sidewalls?.find((s) => s.side === 'LEFT')?.height,
    sidewallRightHeight: roof.sidewalls?.find((s) => s.side === 'RIGHT')?.height,

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
    claddingEaveHeightFrontAdditional: parseNum(quantity?.cladding?.claddingStructureFrontEaveHeight),
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
    canopy0Length: canopy.canopies[0]?.length,
    canopy0Width: canopy.canopies[0]?.width,
    canopy0MaterialConsumptionKgPerSqft: canopy.canopies[0]?.materialConsumptionKgPerSqft,
    canopy0NumberOfPurlins: canopy.canopies[0]?.numberOfPurlins,
    canopy0NumberOfBeams: canopy.canopies[0]?.numberOfBeams,
    canopy0Height: canopy.canopies[0]?.height,
    canopy0CanopySideCoveringHeight: canopy.canopies[0]?.canopySideCoveringHeight,

    // MezzanineFloor fields (MEZ_1)
    mez0LengthM: mezzanine.floors[0]?.lengthM,
    mez0WidthM: mezzanine.floors[0]?.widthM,
    mezzanineMaterialConsumptionKgPerSqft: mezzanine.floors[0]?.materialConsumptionKgPerSqft,
    mez0BeamsMidPrimary: mezzanine.floors[0]?.beamsMidPrimary,
    mez0JointsMidPrimary: mezzanine.floors[0]?.jointsMidPrimary,
    mez0BeamsEndPrimary: mezzanine.floors[0]?.beamsEndPrimary,
    mez0JointsEndPrimary: mezzanine.floors[0]?.jointsEndPrimary,
    mez0InternalColumnsMidPrimary: mezzanine.floors[0]?.internalColumnsMidPrimary,
    mez0InternalColumnsEndPrimary: mezzanine.floors[0]?.internalColumnsEndPrimary,
    mez0BeamsSecondary: mezzanine.floors[0]?.beamsSecondary,

    // MezzanineFloorExt fields (EXT_1)
    mezExt0LengthM: mezzanine.extensions[0]?.lengthM,
    mezExt0WidthM: mezzanine.extensions[0]?.widthM,
    mezExt0BeamsMidPrimary: mezzanine.extensions[0]?.beamsMidPrimary,
    mezExt0JointsMidPrimary: mezzanine.extensions[0]?.jointsMidPrimary,
    mezExt0BeamsEndPrimary: mezzanine.extensions[0]?.beamsEndPrimary,
    mezExt0JointsEndPrimary: mezzanine.extensions[0]?.jointsEndPrimary,
    mezExt0ExtendedColumnsMidPrimary: mezzanine.extensions[0]?.extendedColumnsMidPrimary,
    mezExt0ExtendedColumnsEndPrimary: mezzanine.extensions[0]?.extendedColumnsEndPrimary,
    mezExt0BeamsSecondary: mezzanine.extensions[0]?.beamsSecondary,

    // AreaDeduction
    areaDeduction0AreaM2: stair.areaDeductions[0]?.areaM2,
    areaDeduction0Numbers: stair.areaDeductions[0]?.numbers,

    // StairItem fields (STAIR_1)
    stair0Length: stair.stairs[0]?.length,
    stair0Width: stair.stairs[0]?.width,
    stair0Height: stair.stairs[0]?.height,
    stair0NumberOfMidLanding: stair.stairs[0]?.numberOfMidLanding,
    stair0UnitWeightOfStringer: stair.stairs[0]?.unitWeightOfStringer,

    // BoltType fields
    boltTypePurlinFlangeBraceNumberOfBolts: joint.purlinFlangeBraceNumberOfBolts,
    boltTypeCladdingPurlinsNumberOfBolts: joint.claddingPurlinsNumberOfBolts,
    boltTypeCanopyNumberOfBolts: joint.canopyNumberOfBolts,
    boltTypeSecondaryBeamsNumberOfBolts: joint.secondaryBeamsNumberOfBolts,

    // Roof Joint Bolts
    jointHNumberOfBolts: joint.jointBoltRoof?.find((j) => j.roofJointId === 'H')?.numberOfBolts,
    jointLNumberOfBolts: joint.jointBoltRoof?.find((j) => j.roofJointId === 'L')?.numberOfBolts,
    jointH1NumberOfBolts: joint.jointBoltRoof?.find((j) => j.roofJointId === 'H_1')?.numberOfBolts,
    jointINumberOfBolts: joint.jointBoltRoof?.find((j) => j.roofJointId === 'I')?.numberOfBolts,
    jointI1NumberOfBolts: joint.jointBoltRoof?.find((j) => j.roofJointId === 'I_1')?.numberOfBolts,
    jointBNumberOfBolts: joint.jointBoltRoof?.find((j) => j.roofJointId === 'B')?.numberOfBolts,
    jointB1NumberOfBolts: joint.jointBoltRoof?.find((j) => j.roofJointId === 'B_1')?.numberOfBolts,
    jointB2NumberOfBolts: joint.jointBoltRoof?.find((j) => j.roofJointId === 'B_2')?.numberOfBolts,
    jointANumberOfBolts: joint.jointBoltRoof?.find((j) => j.roofJointId === 'A')?.numberOfBolts,
    jointA1NumberOfBolts: joint.jointBoltRoof?.find((j) => j.roofJointId === 'A_1')?.numberOfBolts,
    jointCNumberOfBolts: joint.jointBoltRoof?.find((j) => j.roofJointId === 'C')?.numberOfBolts,
    jointC1NumberOfBolts: joint.jointBoltRoof?.find((j) => j.roofJointId === 'C_1')?.numberOfBolts,

    // Mezzanine Joint Bolts
    jointMNumberOfBolts: joint.jointBoltMezzanine?.find((j) => j.mezzanineJointId === 'M')?.numberOfBolts,
    jointONumberOfBolts: joint.jointBoltMezzanine?.find((j) => j.mezzanineJointId === 'O')?.numberOfBolts,

    // Foundation Bolts
    foundationFB4NumberOfBolts: joint.foundationBoltRoof?.find((j) => j.foundationJointId === 'FB4')?.numberOfBolts,
    foundationFB5NumberOfBolts: joint.foundationBoltRoof?.find((j) => j.foundationJointId === 'FB5')?.numberOfBolts,
    foundationFB6NumberOfBolts: joint.foundationBoltRoof?.find((j) => j.foundationJointId === 'FB6')?.numberOfBolts,

    // Accessories fields
    ridgeQuantityManual: accessories.ridgeQuantityManual ? accessories.ridgeQuantity : undefined,
    gutterQuantityManual: accessories.gutterQuantityManual ? accessories.gutterQuantity : undefined,
    downTakeQuantityManual: accessories.downTakeQuantityManual ? accessories.downTakeQuantity : undefined,
    dripTrimQuantityManual: accessories.dripTrimQuantityManual ? accessories.dripTrimQuantity : undefined,
    gableEndFlashingQuantityManual: accessories.gableEndFlashingQuantityManual ? accessories.gableEndFlashingQuantity : undefined,
    cornerFlashQuantityManual: accessories.cornerFlashQuantityManual ? accessories.cornerFlashQuantity : undefined,
    rollingShutterLength: accessories.rollingShutterLength,
    rollingShutterWidth: accessories.rollingShutterWidth,
    rollingShutterNos: accessories.rollingShutterNos,
    louverLength: accessories.louverLength,
    louverWidth: accessories.louverWidth,
    louverNos: accessories.louverNos,
    skyLightLength: accessories.skyLightLength,
    skyLightWidth: accessories.skyLightWidth,
    skyLightNos: accessories.skyLightNos,
    wallLightLength: accessories.wallLightLength,
    wallLightWidth: accessories.wallLightWidth,
    wallLightNos: accessories.wallLightNos,
    turboVentilatorNos: accessories.turboVentilatorNos,
    handrailWeightKg: accessories.handrailWeightKg,
    doorHeight: accessories.doorHeight,
    doorWidth: accessories.doorWidth,
    doorNos: accessories.doorNos,
    windowHeight: accessories.windowHeight,
    windowWidth: accessories.windowWidth,
    windowNos: accessories.windowNos,
    partitionQuantity: accessories.partitionQuantity,
  })

  const quantities: Record<string, number> = {
    'STEEL STRUCTURES': calculated.steelStructuresQuantity,
    'WIND BRACINGS': calculated.windBracingsQuantity,
    'SAG ROD': calculated.sagRodQuantity,
    'FLANGE BRACE': calculated.flangeBraceQuantity,
    'Z/C PURLINS': calculated.zCPurlinsQuantity,
    'ROOF SHEET': calculated.roofSheetQuantity,
    'CLADDING SHEET': calculated.claddingSheetQuantity,
    'CANOPY SHEET': calculated.canopySheetQuantity,
    'PURLIN BOLTS': calculated.purlinBoltsQuantity,
    'JOINT BOLTS': calculated.jointBoltsQuantity,
    'FOUNDATION BOLTS': calculated.foundationBoltsQuantity,
    'ANCHOR BOLTS': calculated.anchorBoltsQuantity,
    'RIDGE': calculated.ridgeQuantity,
    'GUTTER': calculated.gutterQuantity,
    'DOWNTAKE': calculated.downtakeQuantity,
    'DRIP TRIM': calculated.dripTrimQuantity,
    'FLASHING': calculated.flashingQuantity,
    'ROLLING SHUTTER': calculated.rollingShutterQuantity,
    'LOUVERS': calculated.louversQuantity,
    'SKY LIGHT': calculated.skyLightQuantity,
    'WALL LIGHT': calculated.wallLightQuantity,
    'ROOF INSULATION': calculated.roofInsulationQuantity,
    'WALL INSULATION': calculated.wallInsulationQuantity,
    'TURBO VENTILATORS': calculated.turboVentilatorsQuantity,
    'DECKING SHEET': calculated.deckingSheetQuantity,
    'SHEAR STUDS': calculated.shearStudsQuantity,
    'POLY CARBONATE SHEET': calculated.polyCarbonateSheetQuantity,
    'STAIR - HR SECTION': calculated.stair1Quantity,
    'STAIR 6MM CHQ PLATE STEPS': calculated.stair2Quantity,
    'HANDRAIL': calculated.handrailQuantity,
    'CANOPY SIDE COVERING': calculated.canopySideCoveringQuantity,
    'DOORS': calculated.doorsQuantity,
    'WINDOWS': calculated.windowsQuantity,
    'FASCIA STRUCTURE': calculated.fasciaStructureQuantity,
    'FASCIA COVERING SHEET/ BOARD': calculated.fasciaCoveringSheetBoardQuantity,
    'INTERNAL PARTITIONS': calculated.internalPartitionsQuantity,
  }

  const rows = useMemo(() => DEFAULT_AMOUNT_ITEMS.map((item) => {
    const prefix = ITEM_PREFIX_MAP[item.description]
    const savedQty = prefix ? parseNum(amount?.[`${prefix}Quantity` as keyof typeof amount]) : undefined
    const qty = savedQty ?? quantities[item.description] ?? 0
    const ratesFromMaster = deriveAmountItemRates(item.rateItem ? rateByItem.get(item.rateItem) : null)
    const rateFab = prefix ? (parseNum(amount?.[`${prefix}FabricationRate` as keyof typeof amount]) ?? ratesFromMaster.rateFabrication) : ratesFromMaster.rateFabrication
    const rateErec = prefix ? (parseNum(amount?.[`${prefix}ErrectionRate` as keyof typeof amount]) ?? ratesFromMaster.rateErection) : ratesFromMaster.rateErection
    const rateLoad = prefix ? (parseNum(amount?.[`${prefix}LoadingRate` as keyof typeof amount]) ?? ratesFromMaster.rateLoading) : ratesFromMaster.rateLoading
    const amtFab = prefix ? (parseNum(amount?.[`${prefix}FabricationAmount` as keyof typeof amount]) ?? (qty * rateFab)) : (qty * rateFab)
    const amtErec = prefix ? (parseNum(amount?.[`${prefix}ErrectionAmount` as keyof typeof amount]) ?? (qty * rateErec)) : (qty * rateErec)
    const amtLoad = prefix ? (parseNum(amount?.[`${prefix}LoadingAmount` as keyof typeof amount]) ?? (qty * rateLoad)) : (qty * rateLoad)
    return { item, qty, rateFab, rateErec, rateLoad, amtFab, amtErec, amtLoad }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [amount, quantities, rateByItem])

  const totalFab = parseNum(amount?.totalFabricationAmount) ?? rows.reduce((s, r) => s + r.amtFab, 0)
  const totalErec = parseNum(amount?.totalErrectionAmount) ?? rows.reduce((s, r) => s + r.amtErec, 0)
  const totalLoad = parseNum(amount?.totalLoadingAmount) ?? rows.reduce((s, r) => s + r.amtLoad, 0)

  return (
    <SectionCard icon={<Calculator />} title="Amount">
      <Table className="min-w-[1200px] border-collapse text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead rowSpan={2} scope="col" className="w-12 border-r text-center">SL</TableHead>
            <TableHead rowSpan={2} scope="col" className="min-w-52 border-r">Description</TableHead>
            <TableHead rowSpan={2} scope="col" className="min-w-24 border-r">Unit</TableHead>
            <TableHead rowSpan={2} scope="col" className="min-w-28 border-r text-right">Quantity</TableHead>
            <TableHead colSpan={3} scope="colgroup" className="border-r text-center">Rate</TableHead>
            <TableHead colSpan={3} scope="colgroup" className="text-center">Amount</TableHead>
          </TableRow>
          <TableRow className="bg-muted/25">
            <TableHead scope="col" className="min-w-32 border-r text-center">Fabrication</TableHead>
            <TableHead scope="col" className="min-w-32 border-r text-center">Errection</TableHead>
            <TableHead scope="col" className="min-w-32 border-r text-center">Loading</TableHead>
            <TableHead scope="col" className="min-w-36 border-r text-center">Fabrication</TableHead>
            <TableHead scope="col" className="min-w-36 border-r text-center">Errection</TableHead>
            <TableHead scope="col" className="min-w-36 text-center">Loading</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ item, qty, rateFab, rateErec, rateLoad, amtFab, amtErec, amtLoad }, index) => (
            <TableRow key={item.description}>
              <TableCell className="border-r text-center text-muted-foreground">
                <Num>{index + 1}</Num>
              </TableCell>
              <TableCell className="border-r font-medium">{item.description}</TableCell>
              <TableCell className="border-r">
                <Badge variant="outline">{item.unit}</Badge>
              </TableCell>
              <TableCell className="border-r text-right font-medium">
                <Num>{qty.toFixed(2)}</Num>
              </TableCell>
              <TableCell className="border-r text-right text-muted-foreground">
                <Num>{rateFab}</Num>
              </TableCell>
              <TableCell className="border-r text-right text-muted-foreground">
                <Num>{rateErec}</Num>
              </TableCell>
              <TableCell className="border-r text-right text-muted-foreground">
                <Num>{rateLoad}</Num>
              </TableCell>
              <TableCell className="border-r text-right text-muted-foreground">
                <Num>{amtFab.toFixed(2)}</Num>
              </TableCell>
              <TableCell className="border-r text-right text-muted-foreground">
                <Num>{amtErec.toFixed(2)}</Num>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                <Num>{amtLoad.toFixed(2)}</Num>
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="border-t-2 bg-muted/50 font-semibold">
            <TableCell colSpan={4} className="border-r text-right">TOTAL</TableCell>
            <TableCell colSpan={3} className="border-r" />
            <TableCell className="border-r text-right"><Num>{totalFab.toFixed(2)}</Num></TableCell>
            <TableCell className="border-r text-right"><Num>{totalErec.toFixed(2)}</Num></TableCell>
            <TableCell className="text-right"><Num>{totalLoad.toFixed(2)}</Num></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </SectionCard>
  )
}

