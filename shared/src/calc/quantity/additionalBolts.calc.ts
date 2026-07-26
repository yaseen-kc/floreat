// @shared/src/calc/quantity/additionalBolts.calc.ts

export interface AdditionalBoltsCalculationInput {
    // Currently purely structural per schema
}

export function calculateAdditionalBoltsQuantities(job: AdditionalBoltsCalculationInput) {
    return {
        jointBolt1: null,
        jointBolt1Quantity: 0,
        jointBolt2: null,
        jointBolt2Quantity: 0,
        jointBolt3: null,
        jointBolt3Quantity: 0,
        purlinBolt: null,
        purlinBoltQuantity: 0,
        anchorBoltQuantity: 0,
        foundationBoltQuantity: 0
    };
}
