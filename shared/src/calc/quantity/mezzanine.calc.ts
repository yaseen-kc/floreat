// @shared/src/calc/quantity/mezzanine.calc.ts

const n = (v: unknown): number => (v == null ? 0 : Number(v));

export interface MezzanineCalculationInput {
    mezzanine?: any;
    joint?: any;
    jointBoltMezzanines?: any[];
    stair?: any;
}

export function calculateMezzanineQuantities(job: MezzanineCalculationInput) {
    const mez1 = job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_1');
    const ext1 = job.mezzanine?.extensions?.find((f: any) => f.code === 'EXT_1') 
              || job.mezzanine?.extensions?.[0] 
              || job.mezzanine?.floorExtensions?.find((f: any) => f.code === 'EXT_1');
    const areaDed0 = job.stair?.areaDeductions?.[0] || job.mezzanine?.areaDeductions?.[0];
    const stair0 = job.stair?.stairs?.[0];

    // Stair & cut-out deduction area = (areaM2 * numbers) + (stair.length * stair.width)
    const stairDeductionArea = (n(areaDed0?.areaM2) * n(areaDed0?.numbers)) 
                             + (n(stair0?.length) * n(stair0?.width));

    // Base floor & extension areas for MEZ_1 and EXT_1
    const mez1Area = n(mez1?.lengthM) * n(mez1?.widthM);
    const ext1Area = n(ext1?.lengthM) * n(ext1?.widthM);

    // Sum of all other floor areas (MEZ_2 through MEZ_12)
    const otherFloorsArea = 
        n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_2')?.lengthM) * n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_2')?.widthM) +
        n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_3')?.lengthM) * n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_3')?.widthM) +
        n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_4')?.lengthM) * n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_4')?.widthM) +
        n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_5')?.lengthM) * n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_5')?.widthM) +
        n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_6')?.lengthM) * n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_6')?.widthM) +
        n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_7')?.lengthM) * n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_7')?.widthM) +
        n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_8')?.lengthM) * n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_8')?.widthM) +
        n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_9')?.lengthM) * n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_9')?.widthM) +
        n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_10')?.lengthM) * n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_10')?.widthM) +
        n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_11')?.lengthM) * n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_11')?.widthM) +
        n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_12')?.lengthM) * n(job.mezzanine?.floors?.find((f: any) => f.code === 'MEZ_12')?.widthM);

    // Sum of all other extension areas (EXT_2, EXT_3)
    const otherExtensionsArea = 
        n(job.mezzanine?.floorExtensions?.find((f: any) => f.code === 'EXT_2')?.lengthM) * n(job.mezzanine?.floorExtensions?.find((f: any) => f.code === 'EXT_2')?.widthM) +
        n(job.mezzanine?.floorExtensions?.find((f: any) => f.code === 'EXT_3')?.lengthM) * n(job.mezzanine?.floorExtensions?.find((f: any) => f.code === 'EXT_3')?.widthM);

    // Net mezzanine area across all floors and extensions minus deductions
    const netMezzanineArea = mez1Area - stairDeductionArea + ext1Area + otherFloorsArea + otherExtensionsArea;

    const matCons = job.mezzanine?.materialConsumptionKgPerSqft || mez1?.materialConsumptionKgPerSqft;
    const mezzanineStructureQuantity = netMezzanineArea * n(matCons) * 10.76;
    const totalMezzanineArea = netMezzanineArea;
    const deckSheetQuantity = netMezzanineArea;
    const deckSheetPurchaseQuantity = netMezzanineArea * 1.1;

    const shearStudsQuantity = (n(mez1?.lengthM) * n(mez1?.beamsSecondary) + n(ext1?.lengthM) * n(ext1?.beamsSecondary)) / 0.4;
    const shearStudsPurchaseQuantity = shearStudsQuantity * 1.1;
    const concreteFlashing = (n(mez1?.lengthM) + n(mez1?.widthM)) * 2 + (n(ext1?.lengthM) + n(ext1?.widthM)) * 2;

    const jointBoltsQuantity =
        n(mez1?.beamsMidPrimary) * n(mez1?.jointsMidPrimary) * n(job.jointBoltMezzanines?.find((j: any) => j.mezzanineJointId === 'M')?.numberOfBolts) +
        n(mez1?.beamsEndPrimary) * n(mez1?.jointsEndPrimary) * n(job.jointBoltMezzanines?.find((j: any) => j.mezzanineJointId === 'M')?.numberOfBolts) +
        (n(mez1?.beamsMidPrimary) + n(mez1?.beamsEndPrimary)) * 2 * n(job.jointBoltMezzanines?.find((j: any) => j.mezzanineJointId === 'Q')?.numberOfBolts) +
        n(mez1?.beamsMidPrimary) * n(mez1?.internalColumnsMidPrimary) * n(job.jointBoltMezzanines?.find((j: any) => j.mezzanineJointId === 'Q')?.numberOfBolts) +
        n(mez1?.beamsEndPrimary) * n(mez1?.internalColumnsEndPrimary) * n(job.jointBoltMezzanines?.find((j: any) => j.mezzanineJointId === 'Q')?.numberOfBolts) +
        n(ext1?.beamsMidPrimary) * n(ext1?.jointsMidPrimary) * n(job.jointBoltMezzanines?.find((j: any) => j.mezzanineJointId === 'M')?.numberOfBolts) +
        n(ext1?.beamsEndPrimary) * n(ext1?.jointsEndPrimary) * n(job.jointBoltMezzanines?.find((j: any) => j.mezzanineJointId === 'M')?.numberOfBolts) +
        (n(ext1?.beamsMidPrimary) + n(ext1?.beamsEndPrimary)) * 2 * n(job.jointBoltMezzanines?.find((j: any) => j.mezzanineJointId === 'Q')?.numberOfBolts) +
        n(ext1?.beamsMidPrimary) * n(ext1?.extendedColumnsMidPrimary) * n(job.jointBoltMezzanines?.find((j: any) => j.mezzanineJointId === 'Q')?.numberOfBolts) +
        n(ext1?.beamsEndPrimary) * n(ext1?.extendedColumnsEndPrimary) * n(job.jointBoltMezzanines?.find((j: any) => j.mezzanineJointId === 'Q')?.numberOfBolts) +
        (n(mez1?.beamsMidPrimary) + n(mez1?.beamsEndPrimary) - 1) * n(mez1?.beamsSecondary) * n(job.joint?.secondaryBeamsNumberOfBolts) +
        (n(ext1?.beamsMidPrimary) + n(ext1?.beamsEndPrimary) - 1) * n(ext1?.beamsSecondary) * n(job.joint?.canopyNumberOfBolts);

    const boltDiameter = n(job.jointBoltMezzanines?.find((j: any) => j.mezzanineJointId === 'Q')?.boltDiameter || job.joint?.secondaryBeamsBoltDiameter);

    return {
        mezzanineStructure: mez1?.type ? String(mez1.type) : (job.mezzanine?.structureType ? String(job.mezzanine.structureType) : null),
        mezzanineStructureQuantity,
        totalMezzanineArea,
        totalMezzanineAreaQuantity: 0,
        materialConsumption: matCons,
        deckSheetQuantity,
        deckSheetPurchaseQuantity,
        deckSheetQuantityAdditional: 0,
        shearStudsQuantity,
        shearStudsPurchaseQuantity,
        shearStudsQuantityAdditional: 0,
        concreteFlashing,
        concreteFlashingAdditional: 0,
        jointBolts: `${boltDiameter} MM DIA HSFG BOLTS`,
        jointBoltsQuantity,
        foundationBoltsQuantity: 0
    };
}
