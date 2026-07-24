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
        lengthOfBuildingQuantity: "User Input",
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
        lengthOfOnePurlinQuantity: "User Input",
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
            n(roof?.roofExtensionEndFrameCount) +
            n(roof?.roofExtensionMidFrameCount) -
            1,
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
        lengthOfpolyCarbonateSheetAdditional: "User Input",
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
        lengthOfSinlgeWindBracingAdditional: "User Input",
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
        lengthOfSingleSagRoadAdditional: "User Input",
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
        lengthOfMidFrameFlangeBraceAdditional: "User Input",
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
            jointBoltRoofs?.find((j) => j.roofJointId === "A")?.numberOfBolts
        )} MM DIA HSFG BOLTS`,
        numberOfFoundationBolts: `${n(foundationBoltRoof?.boltDiameter11)} MM DIA FOUNDATION BOLTS`,
        numberOfAnchorBolts: `${n(foundationBoltRoof?.boltDiameter11)} MM DIA ANCHOR BOLTS`,
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
