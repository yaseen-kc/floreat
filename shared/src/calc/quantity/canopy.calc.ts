// @shared/src/calc/quantity/canopy.calc.ts

const n = (v: unknown): number => (v == null ? 0 : Number(v));

export interface CanopyCalculationInput {
    canopy?: any;
    joint?: any;
}

export function calculateCanopyQuantities(job: CanopyCalculationInput) {
    const joint = job.joint;
    const cItem = job.canopy?.canopies?.[0] || {};
    
    return {
        canopyStructureQuantity: n(cItem.length) * n(cItem.width) * n(cItem.materialConsumptionKgPerSqft) * 10.76,
        canopyArea: n(cItem.length) * n(cItem.width) * 10.76,
        canopyPurlinQuantity: n(cItem.numberOfPurlins) * n(cItem.unitWeightOfPurlin) * (n(cItem.numberOfBeams) - 1) * (n(cItem.length) / (n(cItem.numberOfBeams) - 1) + 0.4),
        canopySheetQuantity: n(cItem.length) * n(cItem.width),
        canopySheetPurchaseQuantity: n(cItem.length) * n(cItem.width) * 1.1,
        canopyGutterQuantity: n(cItem.length),
        canopyDownTakeQuantity: n(cItem.numberOfBeams) * n(cItem.height),
        canopySideCoveringQuantity: (n(cItem.width) * 2 + n(cItem.length)) * n(cItem.canopySideCoveringHeight),
        canopyFlashingQuantity: n(cItem.width) * 2 + n(cItem.length),
        canopyPurlinBoltsQuantity: n(cItem.numberOfPurlins) * n(cItem.numberOfBeams) * n(joint?.claddingPurlinsNumberOfBolts),
        canopyJointBoltsQuantity: n(cItem.numberOfBeams) * n(joint?.canopyNumberOfBolts)
    };
}
