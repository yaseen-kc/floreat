// @shared/src/calc/quantity/cladding.calc.ts

// Helper to safely convert to number, defaulting to 0
const n = (v: unknown): number => (v == null ? 0 : Number(v));

const TAN = (radians: number) => Math.tan(radians);
const PI = () => Math.PI;
const SQRT = (value: number) => Math.sqrt(value);

export interface CladdingCalculationInput {
    roof?: any;
}

export function calculateCladdingQuantities(job: CladdingCalculationInput) {
    const roof = job.roof;

    // Helper to extract sidewall heights by side
    const frontHeight = n(roof?.sidewalls?.find((w: any) => w.side === 'FRONT')?.height);
    const backHeight = n(roof?.sidewalls?.find((w: any) => w.side === 'BACK')?.height);
    const leftHeight = n(roof?.sidewalls?.find((w: any) => w.side === 'LEFT')?.height);
    const rightHeight = n(roof?.sidewalls?.find((w: any) => w.side === 'RIGHT')?.height);

    const claddingStructure = {
        claddingStructureQuantity:
            ((n(roof?.eaveHeight) - frontHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - frontHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - backHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - backHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - leftHeight) * n(roof?.buildingOverallLength) +
            (n(roof?.eaveHeight) - rightHeight) * n(roof?.buildingOverallLength) -
            (n(roof?.frontCladdingOpeningArea) + n(roof?.backCladdingOpeningArea) + n(roof?.rightCladdingOpeningArea) + n(roof?.leftCladdingOpeningArea)) -
            n(roof?.fasciaBoardArea)) *
            10.76 *
            (n(roof?.buildingOverallLength) * n(roof?.claddingPurlins) * 2 + n(roof?.claddingPurlins) * n(roof?.buildingOverallWidth) * 2 + n(roof?.claddingExtensionWidthHeight) * n(roof?.claddingPurlins) * 2 + 2 * n(roof?.buildingOverallWidth) * 0.45) *
            n(roof?.claddingPurlinUnitWeight) /
            (((n(roof?.eaveHeight) - frontHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - frontHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - backHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - backHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - leftHeight) * n(roof?.buildingOverallLength) +
            (n(roof?.eaveHeight) - rightHeight) * n(roof?.buildingOverallLength)) *
            10.76),
        claddingEaveHeightFront: n(roof?.eaveHeight) - frontHeight,
        claddingEaveHeightFrontAdditional: 0,
        claddingEaveHeightBack: n(roof?.eaveHeight) - backHeight,
        claddingEaveHeightRight: n(roof?.eaveHeight) - rightHeight,
        claddingEaveHeightLeft: n(roof?.eaveHeight) - leftHeight,
        extendedColumnHeight: n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight,
        widthOfExtendedFrame: n(roof?.claddingExtensionWidthHeight),
        noOfSideCladdingPurlin: n(roof?.claddingPurlins),
        noOfFaceCladdingPurlin: n(roof?.claddingPurlins) + 2,
        totalLengthOfCladdingPurlin: n(roof?.buildingOverallLength) * n(roof?.claddingPurlins) * 2 + n(roof?.claddingPurlins) * n(roof?.buildingOverallWidth) * 2 + n(roof?.claddingExtensionWidthHeight) * n(roof?.claddingPurlins) * 2 + 2 * n(roof?.buildingOverallWidth) * 0.45,
        totalWeightofCladdingPurlin: (n(roof?.buildingOverallLength) * n(roof?.claddingPurlins) * 2 + n(roof?.claddingPurlins) * n(roof?.buildingOverallWidth) * 2 + n(roof?.claddingExtensionWidthHeight) * n(roof?.claddingPurlins) * 2 + 2 * n(roof?.buildingOverallWidth) * 0.45) * n(roof?.claddingPurlinUnitWeight),
        claddingAreaWithoutAnyDeductions:
            (n(roof?.eaveHeight) - frontHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - frontHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - backHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - backHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - leftHeight) * n(roof?.buildingOverallLength) +
            (n(roof?.eaveHeight) - rightHeight) * n(roof?.buildingOverallLength),
        averageMaterialConsumption:
            (n(roof?.buildingOverallLength) * n(roof?.claddingPurlins) * 2 + n(roof?.claddingPurlins) * n(roof?.buildingOverallWidth) * 2 + n(roof?.claddingExtensionWidthHeight) * n(roof?.claddingPurlins) * 2 + 2 * n(roof?.buildingOverallWidth) * 0.45) * n(roof?.claddingPurlinUnitWeight) /
            (((n(roof?.eaveHeight) - frontHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - frontHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - backHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - backHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - leftHeight) * n(roof?.buildingOverallLength) +
            (n(roof?.eaveHeight) - rightHeight) * n(roof?.buildingOverallLength)) *
            10.76),
        totalCladdingOpenings: n(roof?.frontCladdingOpeningArea) + n(roof?.backCladdingOpeningArea) + n(roof?.rightCladdingOpeningArea) + n(roof?.leftCladdingOpeningArea),
        fasciaOpening: n(roof?.fasciaBoardArea)
    };

    const claddingSheet = {
        claddingSheetQuantity:
            (n(roof?.eaveHeight) - frontHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - frontHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - backHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - backHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - leftHeight) * n(roof?.buildingOverallLength) +
            (n(roof?.eaveHeight) - rightHeight) * n(roof?.buildingOverallLength) -
            (n(roof?.frontCladdingOpeningArea) + n(roof?.backCladdingOpeningArea) + n(roof?.rightCladdingOpeningArea) + n(roof?.leftCladdingOpeningArea)) -
            n(roof?.fasciaBoardArea),
        claddingSheetAdditional: 0,
        claddingSheetPurchase:
            ((n(roof?.eaveHeight) - frontHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - frontHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - backHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - backHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - leftHeight) * n(roof?.buildingOverallLength) +
            (n(roof?.eaveHeight) - rightHeight) * n(roof?.buildingOverallLength) -
            (n(roof?.frontCladdingOpeningArea) + n(roof?.backCladdingOpeningArea) + n(roof?.rightCladdingOpeningArea) + n(roof?.leftCladdingOpeningArea)) -
            n(roof?.fasciaBoardArea)) *
            1.1,
        columnWindBracings:
            n(roof?.columnWindBracingSegments) * 2 * 2 * n(roof?.columnWindBracingProvidedBays) * SQRT((n(roof?.windBracingColumnHeight) / n(roof?.columnWindBracingSegments)) ** 2 + n(roof?.buildingOverallLength) / (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1) * n(roof?.buildingOverallLength) / (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1)) * n(roof?.windBracingUnitWeight),
        columnWindBracingsAdditional: 0,
        claddingSagRod:
            ((n(roof?.eaveHeight) - frontHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - frontHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - backHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - backHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - leftHeight) * n(roof?.buildingOverallLength) +
            (n(roof?.eaveHeight) - rightHeight) * n(roof?.buildingOverallLength) -
            (n(roof?.frontCladdingOpeningArea) + n(roof?.backCladdingOpeningArea) + n(roof?.rightCladdingOpeningArea) + n(roof?.leftCladdingOpeningArea)) -
            n(roof?.fasciaBoardArea)) *
            10.76 *
            (n(roof?.claddingPurlins) * (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1) * 2 + (n(roof?.claddingPurlins) + 1) * (n(roof?.internalColumnsForEndRoofFrames) + 1) * 2 + (n(roof?.claddingPurlins) + 1) * 2) *
            1.7 *
            n(roof?.diaOfCladdingSagRod) *
            n(roof?.diaOfCladdingSagRod) /
            162 /
            (((n(roof?.eaveHeight) - frontHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - frontHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - backHeight + (n(roof?.buildingOverallWidth) / 2) * TAN((n(roof?.roofSlope) * PI()) / 180) + n(roof?.eaveHeight) - backHeight) / 2 * n(roof?.buildingOverallWidth) +
            (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN((n(roof?.roofSlope) * PI()) / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) +
            (n(roof?.eaveHeight) - leftHeight) * n(roof?.buildingOverallLength) +
            (n(roof?.eaveHeight) - rightHeight) * n(roof?.buildingOverallLength)) *
            10.76),
        claddingSagRodAdditional: 0,
        claddingFlangeBrace:
            ((n(roof?.mainRoofFrames) + n(roof?.endRoofFrames)) * n(roof?.claddingPurlins) * 2 + (n(roof?.internalColumnsForEndRoofFrames) + 2) * (n(roof?.claddingPurlins) + 1) * 2 + n(roof?.claddingPurlins) * 2) *
            n(roof?.claddingFlangeBraceAverageLength) *
            1.57 *
            2,
        claddingFlangeBraceAdditional: 0,
        numberOfCladdingPurlinBolts:
            ((n(roof?.mainRoofFrames) + n(roof?.endRoofFrames)) * n(roof?.claddingPurlins) * 2 + (n(roof?.internalColumnsForEndRoofFrames) + 2) * (n(roof?.claddingPurlins) + 1) * 2 + n(roof?.claddingPurlins) * 2) *
            4,
        numberOfCladdingPurlinBoltsAdditional: 0
    };

    return {
        claddingStructure,
        claddingSheet,
    };
}
