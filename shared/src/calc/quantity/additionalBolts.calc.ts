// @shared/src/calc/quantity/additionalBolts.calc.ts

export interface AdditionalBoltsCalculationInput {
    // Currently purely structural per schema
}

export function calculateAdditionalBoltsQuantities(job: AdditionalBoltsCalculationInput) {
    return {
        jointBolt1Quantity: "User Input",
        jointBolt2Quantity: "User Input",
        jointBolt3Quantity: "User Input",
        purlinBolt: "User Input",
        purlinBoltQuantity: "User Input",
        anchorBoltQuantity: "User Input",
        foundationBoltQuantity: "User Input"
    };
}
