// @shared/src/calc/quantity/peb.calc.ts

// Helper to safely convert to number, defaulting to 0
const n = (v: unknown): number => (v == null ? 0 : Number(v));

const COS = (radians: number) => Math.cos(radians);
const PI = () => Math.PI;
const SQRT = (value: number) => Math.sqrt(value);

// DTO Interfaces
export interface PebCalculationInput {
    roof?: any;
    joint?: any;
    jointBoltRoofs?: any[];
    foundationBoltRoof?: any;
}

export function calculatePebQuantities(job: PebCalculationInput) {
    const roof = job.roof;
    const joint = job.joint;
    const jointBoltRoofs = job.jointBoltRoofs;
    const foundationBoltRoof = job.foundationBoltRoof;

    const pebRoof = {
        pebRoofValue: "TRUE",
        pebRoofQuantity:
            (n(roof?.buildingOverallLength) *
                (n(roof?.buildingOverallWidth) /
                    COS((n(roof?.roofSlope) * PI()) / 180) /
                    2 +
                    0.14) *
                2 *
                10.76 *
                n(roof?.materialConsumptionExcludingPurlin) +
                (n(roof?.buildingOverallLength) /
                    (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1) +
                    0.4) *
                ((n(roof?.buildingOverallWidth) /
                    COS((n(roof?.roofSlope) * PI()) / 180) /
                    2 +
                    0.14) /
                    n(roof?.roofPurlinSpacing) +
                    1) *
                2 *
                (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1) *
                n(roof?.roofPurlinUnitWeight) +
                (n(roof?.buildingOverallLength) /
                    (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1) +
                    0.4) *
                n(roof?.roofPurlinUnitWeight) *
                n(roof?.roofExtensionWidthHeight) /
                COS((n(roof?.roofSlope) * PI()) / 180) /
                n(roof?.roofPurlinSpacing) *
                (n(roof?.roofExtensionEndFrameCount) +
                    n(roof?.roofExtensionMidFrameCount) -
                    1)) /
            ((n(roof?.buildingOverallLength) *
                (n(roof?.buildingOverallWidth) /
                    COS((n(roof?.roofSlope) * PI()) / 180) /
                    2 +
                    0.14) *
                2 +
                n(roof?.roofExtensionWidthHeight) /
                COS((n(roof?.roofSlope) * PI()) / 180) *
                n(roof?.buildingOverallLength) /
                (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1) *
                (n(roof?.roofExtensionEndFrameCount) +
                    n(roof?.roofExtensionMidFrameCount) -
                    1) -
                n(roof?.roofAreaDeduction) -
                n(roof?.polycarbonateRoofLength) *
                n(roof?.polycarbonateRoofWidth) *
                n(roof?.polycarbonateRoofCount)) *
                10.76),
    };

    const raftersAndColumns = {
        raftersAndColumns: roof?.gradeOfPlateMaterial,
        raftersAndColumnsQuantity:
            n(roof?.buildingOverallLength) *
            (n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14) *
            2 *
            10.76 *
            n(roof?.materialConsumptionExcludingPurlin),
        lengthOfBuilding: n(roof?.buildingOverallLength),
        lengthOfBuildingQuantity: 0,
        inclinedLengthInOneHalf:
            n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14,
        roofArea:
            n(roof?.buildingOverallLength) *
            (n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14) *
            2 *
            10.76,
        materialConsumption: n(roof?.materialConsumptionExcludingPurlin),
    };

    const roofPurlins = {
        roofPurlinsValue:
            n(roof?.roofExtensionEndFrameCount) + n(roof?.roofExtensionMidFrameCount) - 1,
        roofPurlins: `${roof?.roofPurlinType || ""}PURLIN ${roof?.roofPurlinDepth || ""} MM DEPTH`,
        roofPurlinsQuantity:
            (n(roof?.buildingOverallLength) / (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1) + 0.4) *
            ((n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14) /
                n(roof?.roofPurlinSpacing) +
                1) *
            2 *
            (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1) *
            n(roof?.roofPurlinUnitWeight) +
            (n(roof?.buildingOverallLength) / (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1) + 0.4) *
            n(roof?.roofPurlinUnitWeight) *
            n(roof?.roofExtensionWidthHeight) /
            COS((n(roof?.roofSlope) * PI()) / 180) /
            n(roof?.roofPurlinSpacing) *
            (n(roof?.roofExtensionEndFrameCount) + n(roof?.roofExtensionMidFrameCount) - 1),
        lengthOfOnePurlin:
            n(roof?.buildingOverallLength) / (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1) + 0.4,
        lengthOfOnePurlinQuantity: 0,
        noOfPurlinsInOneFrame:
            ((n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14) /
                n(roof?.roofPurlinSpacing) +
                1) *
            2,
        totalNoOfPurlinBay: n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1,
        unitWeightOfPurlin: n(roof?.roofPurlinUnitWeight),
        noOfExtendedFrame:
            n(roof?.roofExtensionWidthHeight) /
            COS((n(roof?.roofSlope) * PI()) / 180) /
            n(roof?.roofPurlinSpacing),
        noOfExtendedPurlinBay:
            n(roof?.roofExtensionEndFrameCount) + n(roof?.roofExtensionMidFrameCount) - 1,
    };

    const roofSheet = {
        roofSheet: `${roof?.roofCoveringThickness || ""}MM THICK ${roof?.roofCoveringType || ""}`,
        roofSheetQuantity:
            n(roof?.buildingOverallLength) *
            (n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14) *
            2 +
            (n(roof?.roofExtensionWidthHeight) / COS((n(roof?.roofSlope) * PI()) / 180)) *
            (n(roof?.buildingOverallLength) / (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1)) *
            (n(roof?.roofExtensionEndFrameCount) + n(roof?.roofExtensionMidFrameCount) - 1) -
            n(roof?.roofAreaDeduction) -
            n(roof?.polycarbonateRoofLength) *
            n(roof?.polycarbonateRoofWidth) *
            n(roof?.polycarbonateRoofCount),
        roofSheetPurchaseQuantity:
            (n(roof?.buildingOverallLength) *
                (n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14) *
                2 +
                (n(roof?.roofExtensionWidthHeight) / COS((n(roof?.roofSlope) * PI()) / 180)) *
                (n(roof?.buildingOverallLength) / (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1)) *
                (n(roof?.roofExtensionEndFrameCount) + n(roof?.roofExtensionMidFrameCount) - 1) -
                n(roof?.roofAreaDeduction) -
                n(roof?.polycarbonateRoofLength) *
                n(roof?.polycarbonateRoofWidth) *
                n(roof?.polycarbonateRoofCount)) *
            1.1,
        extendedRoofWidth:
            n(roof?.roofExtensionWidthHeight) / COS((n(roof?.roofSlope) * PI()) / 180),
        extendedRoofWidthAdditional:
            n(roof?.roofExtensionWidthHeight) / COS((n(roof?.roofSlope) * PI()) / 180),
        extendedRoofLength:
            (n(roof?.buildingOverallLength) / (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1)) *
            (n(roof?.roofExtensionEndFrameCount) + n(roof?.roofExtensionMidFrameCount) - 1),
        roofAreaDeductions: n(roof?.roofAreaDeduction),
        polyCarbonateAreaDeductions:
            n(roof?.polycarbonateRoofLength) *
            n(roof?.polycarbonateRoofWidth) *
            n(roof?.polycarbonateRoofCount),
    };

    const polyCarbonateSheet = {
        polyCarbonateSheetQuantity:
            n(roof?.polycarbonateRoofLength) *
            n(roof?.polycarbonateRoofWidth) *
            n(roof?.polycarbonateRoofCount),
        polyCarbonateSheetPurchaseQuantity: 0,
        lengthOfpolyCarbonateSheet: n(roof?.polycarbonateRoofLength),
        lengthOfpolyCarbonateSheetAdditional: 0,
        widthOfpolyCarbonateSheet: n(roof?.polycarbonateRoofWidth),
        NosOfpolyCarbonateSheet: n(roof?.polycarbonateRoofCount),
    };

    const roofWindBracing = {
        roofWindBracing:
            SQRT(
                (n(roof?.buildingOverallWidth) /
                    2 /
                    COS((n(roof?.roofSlope) * PI()) / 180) /
                    n(roof?.roofWindBracingSegmentsInOneHalf)) **
                2 +
                (n(roof?.buildingOverallLength) /
                    (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1)) *
                (n(roof?.buildingOverallLength) /
                    (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1))
            ) *
            n(roof?.roofWindBracingSegmentsInOneHalf) *
            2 *
            2 *
            n(roof?.roofWindBracingProvidedBays) *
            n(roof?.windBracingUnitWeight),
        lengthOfSinlgeWindBracing: n(roof?.roofWindBracingLength),
        lengthOfSinlgeWindBracingAdditional: 0,
        totalNumberOfWindBracing:
            n(roof?.roofWindBracingSegmentsInOneHalf) * 2 * 2 * n(roof?.roofWindBracingProvidedBays),
        unitWeightOfRoofWindBracing: n(roof?.windBracingUnitWeight),
    };

    const extendedSagRodBayRaw =
        n(roof?.roofExtensionEndFrameCount) + n(roof?.roofExtensionMidFrameCount) - 1;

    const roofSagRoad = {
        roofSagRoadValue:
            n(roof?.roofExtensionWidthHeight) /
            COS((n(roof?.roofSlope) * PI()) / 180) /
            n(roof?.roofPurlinSpacing) -
            1,
        roofSagRoadQuantity:
            ((n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14) /
                n(roof?.roofPurlinSpacing) *
                2 *
                (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1) +
                (n(roof?.roofExtensionWidthHeight) /
                    COS((n(roof?.roofSlope) * PI()) / 180) /
                    n(roof?.roofPurlinSpacing) -
                    1) *
                (n(roof?.roofExtensionEndFrameCount) + n(roof?.roofExtensionMidFrameCount) - 1)) *
            n(roof?.diaOfRoofSagRod) *
            n(roof?.diaOfRoofSagRod) /
            162,
        lengthOfSingleSagRoad: n(roof?.roofPurlinSpacing) + 0.2,
        lengthOfSingleSagRoadAdditional: 0,
        noOfSagRodInASingleFrame:
            (n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14) /
            n(roof?.roofPurlinSpacing) *
            2,
        noOfBayInSagRodProvided: n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1,
        noOfSagRodInExtendedFrame:
            n(roof?.roofExtensionWidthHeight) /
            COS((n(roof?.roofSlope) * PI()) / 180) /
            n(roof?.roofPurlinSpacing) -
            1,
        noOfExtendedSagRodBay: extendedSagRodBayRaw < 1 ? 0 : extendedSagRodBayRaw,
        unitWeightOfSagRod: (n(roof?.diaOfRoofSagRod) * n(roof?.diaOfRoofSagRod)) / 162,
    };

    const roofFlangeBrace = {
        roofFlangeBraceQuantity:
            (n(roof?.roofFlangeBraceAverageLength) *
                ((n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14) /
                    n(roof?.roofPurlinSpacing) +
                    1) *
                4 *
                n(roof?.mainRoofFrames) +
                n(roof?.endFrameFlangeBraceAverageLength) *
                ((n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14) /
                    n(roof?.roofPurlinSpacing) +
                    1) *
                2 *
                n(roof?.endRoofFrames) +
                n(roof?.roofFlangeBraceAverageLength) *
                (n(roof?.roofExtensionWidthHeight) / COS((n(roof?.roofSlope) * PI()) / 180)) /
                n(roof?.roofPurlinSpacing) *
                2 *
                n(roof?.roofExtensionMidFrameCount) +
                n(roof?.roofFlangeBraceAverageLength) *
                (n(roof?.roofExtensionWidthHeight) / COS((n(roof?.roofSlope) * PI()) / 180)) /
                n(roof?.roofPurlinSpacing) *
                n(roof?.roofExtensionEndFrameCount)) *
            1.57,
        lengthOfMidFrameFlangeBrace: n(roof?.roofFlangeBraceAverageLength),
        lengthOfMidFrameFlangeBraceAdditional: 0,
        noOfFlangeBraceInMidFrame:
            ((n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14) /
                n(roof?.roofPurlinSpacing) +
                1) *
            4,
        noOfFlangeBraceInEndFrame:
            ((n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14) /
                n(roof?.roofPurlinSpacing) +
                1) *
            2,
        noOfMidFrame: n(roof?.mainRoofFrames),
        noOfEndFrame: n(roof?.endRoofFrames),
        noOfFlngBraceInExtendedFrame:
            (n(roof?.roofExtensionWidthHeight) /
                COS((n(roof?.roofSlope) * PI()) / 180) /
                n(roof?.roofPurlinSpacing)) *
            2,
        noOfFlngBraceInExtendedFrame2:
            n(roof?.roofExtensionWidthHeight) /
            COS((n(roof?.roofSlope) * PI()) / 180) /
            n(roof?.roofPurlinSpacing),
        noOfExtendedMidFrame: n(roof?.roofExtensionMidFrameCount),
        noOfExtendedEndFrame: n(roof?.roofExtensionEndFrameCount),
        lengthOfEndFrameFlangeBrace: n(roof?.endFrameFlangeBraceAverageLength),
    };

    const getRoofJointBolts = (id: string): number =>
        n(jointBoltRoofs?.find((j: any) => j.roofJointId === id)?.numberOfBolts);

    const getFoundationBolts = (id: string): number => {
        if (!foundationBoltRoof) return 0;
        if (Array.isArray(foundationBoltRoof)) {
            return n(foundationBoltRoof.find((f: any) => f.foundationJointId === id)?.numberOfBolts);
        }
        return (foundationBoltRoof.foundationJointId === id || !foundationBoltRoof.foundationJointId)
            ? n(foundationBoltRoof.numberOfBolts)
            : 0;
    };

    const numberOfRoofJointBoltsQuantity =
        getRoofJointBolts("D") * n(roof?.mainRoofFrames) * (n(roof?.columnSegmentsInMainFrame) - 1) * 2 +
        getRoofJointBolts("K") * n(roof?.mainRoofFrames) * (n(roof?.columnSegmentsInMainFrame) - 1) * n(roof?.internalColumnsForMainRoofFrames) +
        getRoofJointBolts("G") * n(roof?.roofExtensionMidFrameCount) * (n(roof?.columnSegmentsInMainFrame) - 1) +
        getRoofJointBolts("H") * n(roof?.roofExtensionMidFrameCount) * 1 +
        getRoofJointBolts("D_1") * n(roof?.endRoofFrames) * (n(roof?.columnSegmentsInEndFrame) - 1) +
        getRoofJointBolts("L") * n(roof?.mainRoofFrames) * n(roof?.internalColumnsForMainRoofFrames) +
        getRoofJointBolts("G_1") * n(roof?.roofExtensionEndFrameCount) * (n(roof?.columnSegmentsInEndFrame) - 1) +
        getRoofJointBolts("H_1") * n(roof?.roofExtensionEndFrameCount) * 1 +
        getRoofJointBolts("K_1") * n(roof?.endRoofFrames) * (n(roof?.columnSegmentsInEndFrame) - 1) * n(roof?.internalColumnsForEndRoofFrames) +
        getRoofJointBolts("L_1") * n(roof?.endRoofFrames) * (n(roof?.columnSegmentsInEndFrame) - 1) * n(roof?.internalColumnsForEndRoofFrames) +
        getRoofJointBolts("I") * n(roof?.roofExtensionMidFrameCount) * 1 +
        getRoofJointBolts("I_1") * n(roof?.roofExtensionEndFrameCount) * 1 +
        getRoofJointBolts("B") * n(roof?.mainRoofFrames) * (n(roof?.raftersInOneHalfOfMainFrame) - 1) * 2 +
        getRoofJointBolts("B_1") * n(roof?.mainRoofFrames) * (n(roof?.raftersInOneHalfOfMainFrame) - 1) * 2 +
        getRoofJointBolts("B_2") * n(roof?.endRoofFrames) * (n(roof?.raftersInOneHalfOfEndFrame) - 1) * 2 +
        getRoofJointBolts("A") * n(roof?.mainRoofFrames) * 1 +
        getRoofJointBolts("A_1") * n(roof?.endRoofFrames) * 1 +
        getRoofJointBolts("C") * n(roof?.mainRoofFrames) * 2 +
        getRoofJointBolts("C_1") * n(roof?.endRoofFrames) * 2;

    const numberOfFoundationBoltsQuantity =
        getFoundationBolts("FB4") * n(roof?.mainRoofFrames) * 1 +
        getFoundationBolts("FB4") * n(roof?.endRoofFrames) * 2 +
        getFoundationBolts("FB5") * (n(roof?.roofExtensionMidFrameCount) + n(roof?.roofExtensionEndFrameCount)) * 1 +
        getFoundationBolts("FB6") * n(roof?.mainRoofFrames) * n(roof?.internalColumnsForMainRoofFrames) +
        getFoundationBolts("FB6") * n(roof?.endRoofFrames) * n(roof?.internalColumnsForEndRoofFrames);

    const isAnchorBoltFixing = roof?.roofFrameBaseFixing === "ANCHOR BOLT" ? 1 : 0;
    const numberOfAnchorBoltsQuantity =
        getFoundationBolts("FB6") *
        (
            n(roof?.mainRoofFrames) +
            2 * n(roof?.endRoofFrames) +
            (n(roof?.roofExtensionMidFrameCount) + n(roof?.roofExtensionEndFrameCount)) +
            n(roof?.mainRoofFrames) * n(roof?.internalColumnsForMainRoofFrames) +
            n(roof?.endRoofFrames) * n(roof?.internalColumnsForEndRoofFrames)
        ) *
        isAnchorBoltFixing;

    const bolts = {
        numberOfPurlinBolts: `${n(joint?.purlinFlangeBraceBoltDiameter)} MM DIA ORDINARY BOLTS`,
        numberOfPurlinBoltsQuantity:
            ((n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14) /
                n(roof?.roofPurlinSpacing) +
                1) *
            2 *
            (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames)) *
            n(joint?.purlinFlangeBraceNumberOfBolts) +
            (n(roof?.roofExtensionWidthHeight) / COS((n(roof?.roofSlope) * PI()) / 180)) /
            n(roof?.roofPurlinSpacing) *
            (n(roof?.roofExtensionMidFrameCount) + n(roof?.roofExtensionEndFrameCount)) *
            n(joint?.purlinFlangeBraceNumberOfBolts),
        noOfPurlinJointInSingleFrame:
            ((n(roof?.buildingOverallWidth) / COS((n(roof?.roofSlope) * PI()) / 180) / 2 + 0.14) /
                n(roof?.roofPurlinSpacing) +
                1) *
            2,
        totalnoOfFrames: n(roof?.mainRoofFrames) + n(roof?.endRoofFrames),
        noOfPurlinnodeInExtendedFrame:
            n(roof?.roofExtensionWidthHeight) /
            COS((n(roof?.roofSlope) * PI()) / 180) /
            n(roof?.roofPurlinSpacing),
        noOfExtendedFrames: n(roof?.roofExtensionMidFrameCount) + n(roof?.roofExtensionEndFrameCount),
        noOfBoltsInSinglePurlinJoint: n(joint?.purlinFlangeBraceNumberOfBolts),
        numberOfRoofJointBolts: `${n(
            jointBoltRoofs?.find((j) => j.roofJointId === "A")?.boltDiameter
        )} MM DIA HSFG BOLTS`,
        numberOfRoofJointBoltsQuantity,
        numberOfFoundationBolts: `${n(
            (Array.isArray(foundationBoltRoof) ? foundationBoltRoof[0] : foundationBoltRoof)?.boltDiameter
        )} MM DIA FOUNDATION BOLTS`,
        numberOfFoundationBoltsQuantity,
        numberOfAnchorBolts: `${n(
            (Array.isArray(foundationBoltRoof) ? foundationBoltRoof[0] : foundationBoltRoof)?.boltDiameter
        )} MM DIA ANCHOR BOLTS`,
        numberOfAnchorBoltsQuantity,
    };

    return {
        pebRoof,
        raftersAndColumns,
        roofPurlins,
        roofSheet,
        polyCarbonateSheet,
        roofWindBracing,
        roofSagRoad,
        roofFlangeBrace,
        bolts,
    };
}
