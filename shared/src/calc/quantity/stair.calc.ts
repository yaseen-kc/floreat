// @shared/src/calc/quantity/stair.calc.ts

const n = (v: unknown): number => (v == null ? 0 : Number(v));
const SQRT = (value: number) => Math.sqrt(value);

export interface StairCalculationInput {
    stair?: any;
    mezzanine?: any;
}

export function calculateStairQuantities(job: StairCalculationInput) {
    const stairItem = job.stair?.stairs?.[0] || {};
    const areaDed = job.mezzanine?.areaDeductions?.[0] || {};
    
    return {
        totalAreaOfStairQuantity: n(stairItem.length) * n(stairItem.width),
        totalWeightofStringerBeams: stairItem.typeOfStringer,
        totalWeightofStringerBeamsQuantity: (SQRT(n(stairItem.height) / (n(stairItem.numberOfMidLanding) + 1) * n(stairItem.height) / (n(stairItem.numberOfMidLanding) + 1) + (n(stairItem.length) - 2) * (n(stairItem.length) - 2)) + 2 + n(stairItem.numberOfMidLanding)) * (2 + n(stairItem.numberOfMidLanding) * 2) * n(stairItem.unitWeightOfStringer),
        totalWeightofSteps: stairItem.typeOfStep,
        totalWeightofStepsQuantity: n(stairItem.height) / 0.15 * n(stairItem.width) / 2 * 0.006 * 0.45 * 7850,
        totalWeightofStepsAdditional: 0
    };
}
