// @shared/src/calc/quantity/accessories.calc.ts

const n = (v: unknown): number => (v == null ? 0 : Number(v));
const TAN = (radians: number) => Math.tan(radians);
const COS = (radians: number) => Math.cos(radians);
const PI = () => Math.PI;

export interface AccessoriesCalculationInput {
    accessories?: any;
    roof?: any;
}

export function calculateAccessoriesQuantities(job: AccessoriesCalculationInput) {
    const acc = job.accessories;
    const roof = job.roof;

    const frontHeight = n(roof?.sidewalls?.find((w: any) => w.side === 'FRONT')?.height);
    const backHeight = n(roof?.sidewalls?.find((w: any) => w.side === 'BACK')?.height);
    const leftHeight = n(roof?.sidewalls?.find((w: any) => w.side === 'LEFT')?.height);
    const rightHeight = n(roof?.sidewalls?.find((w: any) => w.side === 'RIGHT')?.height);

    return {
        doors: acc?.doorNos,
        doorsQuantity: n(acc?.doorHeight) * n(acc?.doorWidth) * n(acc?.doorNos),
        windows: acc?.windowNos,
        windowsQuantity: n(acc?.windowHeight) * n(acc?.windowWidth) * n(acc?.windowNos),
        fasciaStructureQuantity: n(roof?.fasciaBoardArea) * n(roof?.fasciaMaterialWeightPerSqft) * 10.76,
        fasciaCoveringSheetBoardQuantity: n(roof?.fasciaBoardArea),
        internalPartitionsQuantity: n(acc?.partitionQuantity),
        ridgeQuantity: n(roof?.buildingOverallLength) + n(acc?.ridgeQuantity),
        gutterQuantity: n(roof?.buildingOverallLength) * 2 + n(acc?.gutterQuantity),
        downtakeQuantity: (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames)) * n(roof?.eaveHeight) + n(acc?.downTakeQuantity),
        dripTrimQuantity: n(roof?.buildingOverallLength) * 2 + n(roof?.buildingOverallWidth) * 2 + n(acc?.dripTrimQuantity),
        gableEndFlashingQuantity: (n(roof?.buildingOverallWidth) / COS(n(roof?.roofSlope) * PI() / 180) + 0.14) * 2 + (n(roof?.roofExtensionWidthHeight) / COS(n(roof?.roofSlope) * PI() / 180) + 0.14) * 2 + n(acc?.gableEndFlashingQuantity),
        cornerFlashQuantity: n(roof?.eaveHeight) - frontHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN(n(roof?.roofSlope) * PI() / 180) - leftHeight + n(roof?.eaveHeight) - backHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN(n(roof?.roofSlope) * PI() / 180) - leftHeight + n(acc?.cornerFlashQuantity),
        rollingShutter: acc?.rollingShutterNos,
        rollingShutterQuantity: n(acc?.rollingShutterLength) * n(acc?.rollingShutterWidth) * n(acc?.rollingShutterNos),
        louvers: acc?.louverNos,
        louversQuantity: n(acc?.louverLength) * n(acc?.louverWidth) * n(acc?.louverNos),
        skyLight: acc?.skyLightNos,
        skyLightQuantity: n(acc?.skyLightLength) * n(acc?.skyLightWidth) * n(acc?.skyLightNos),
        wallLight: acc?.wallLightNos,
        wallLightQuantity: n(acc?.wallLightLength) * n(acc?.wallLightWidth) * n(acc?.wallLightNos),
        roofInsulation: acc?.roofInsulationType,
        roofInsulationQuantity: n(roof?.buildingOverallLength) * (n(roof?.buildingOverallWidth) / COS(n(roof?.roofSlope) * PI() / 180) / 2 + 0.14) * 2 + n(roof?.roofExtensionWidthHeight) / COS(n(roof?.roofSlope) * PI() / 180) * n(roof?.buildingOverallLength) / (n(roof?.mainRoofFrames) + n(roof?.endRoofFrames) - 1) * (n(roof?.roofExtensionEndFrameCount) + n(roof?.roofExtensionMidFrameCount) - 1) - n(roof?.roofAreaDeduction) - n(roof?.polycarbonateRoofLength) * n(roof?.polycarbonateRoofWidth) * n(roof?.polycarbonateRoofCount),
        wallInsulation: acc?.wallInsulationType,
        wallInsulationQuantity: (n(roof?.eaveHeight) - frontHeight + (n(roof?.buildingOverallWidth) / 2) * TAN(n(roof?.roofSlope) * PI() / 180) + n(roof?.eaveHeight) - frontHeight) / 2 * n(roof?.buildingOverallWidth) + (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN(n(roof?.roofSlope) * PI() / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) + (n(roof?.eaveHeight) - backHeight + (n(roof?.buildingOverallWidth) / 2) * TAN(n(roof?.roofSlope) * PI() / 180) + n(roof?.eaveHeight) - backHeight) / 2 * n(roof?.buildingOverallWidth) + (n(roof?.eaveHeight) - leftHeight + n(roof?.eaveHeight) - n(roof?.claddingExtensionWidthHeight) * TAN(n(roof?.roofSlope) * PI() / 180) - leftHeight) / 2 * n(roof?.claddingExtensionWidthHeight) + (n(roof?.eaveHeight) - leftHeight) * n(roof?.buildingOverallLength) + (n(roof?.eaveHeight) - rightHeight) * n(roof?.buildingOverallLength) - (n(roof?.frontCladdingOpeningArea) + n(roof?.backCladdingOpeningArea) + n(roof?.rightCladdingOpeningArea) + n(roof?.leftCladdingOpeningArea)) - n(roof?.fasciaBoardArea),
        turboVentilators: acc?.turboVentilatorDiameter ? String(acc.turboVentilatorDiameter) : (acc?.turboVentilators ? String(acc.turboVentilators) : null),
        turboVentilatorsQuantity: n(acc?.turboVentilatorNos),
        handrail: acc?.handrailWeightKg != null ? String(acc.handrailWeightKg) : (acc?.handrail ? String(acc.handrail) : null),
        handrailQuantity: n(acc?.handrailWeightKg)
    };
}
