import { faker } from '@faker-js/faker'

export function makeJobInput() {
  return {
    projectNo: faker.string.alphanumeric(8),
    subject: faker.lorem.sentence(),
    refNo: faker.string.alphanumeric(6),
    date: faker.date.recent().toISOString(),
    designedByName: faker.person.fullName(),
    designedByMobile: faker.phone.number(),
    clientName: faker.company.name(),
    buildingUsage: faker.lorem.word(),
    numberOfBuilding: faker.number.int({ min: 1, max: 10 }),
    frameType: faker.lorem.word(),
    configuration: faker.lorem.word(),
  }
}

export function makeJob(overrides = {}) {
  return {
    id: faker.string.uuid(),
    userId: `user_${faker.string.alphanumeric(24)}`,
    ...makeJobInput(),
    estimationEngineerName: null,
    estimationEngineerMobile: null,
    headOfSalesName: null,
    headOfSalesMobile: null,
    firmName: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function makeUser(overrides = {}) {
  return {
    id: faker.string.uuid(),
    clerkId: `user_${faker.string.alphanumeric(24)}`,
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    imageUrl: faker.image.avatar(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function makeRoofInput(jobId = faker.string.uuid()) {
  return {
    jobId,
    buildingOverallLength: 30,
    buildingOverallWidth: 15,
    eaveHeight: 5.645,
    roofSlope: 6,
    mainRoofFrames: 4,
    endRoofFrames: 2,
    roofPurlinSpacing: 1.27,
    claddingPurlins: 2,
    internalColumnsForMainRoofFrames: 2,
    internalColumnsForEndRoofFrames: 2,
    roofFrameBaseFixing: 'FOUNDATION_BOLT' as const,
  }
}

export function makeRoof(overrides = {}) {
  return {
    id: faker.string.uuid(),
    ...makeRoofInput(),
    member: null,
    purlin: null,
    covering: null,
    flangeBrace: null,
    polycarbonate: null,
    windBracing: null,
    claddingOpening: null,
    fasciaBoard: null,
    sideExtension: null,
    roofMaterialStrengthOrGuide: null,
    sidewalls: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function makeMezzanineFloor(overrides = {}) {
  return {
    code: 'MEZ-1',
    floor: 'FLOOR_1' as const,
    type: 'DECK_SHEET' as const,
    heightFrom: 'GROUND' as const,
    thicknessMm: 0.8,
    lengthM: 15,
    widthM: 6,
    heightM: 2.75,
    materialConsumptionKgPerSqft: 3.5,
    beamsMidPrimary: 1,
    beamsEndPrimary: 1,
    beamsSecondary: 12,
    jointsMidPrimary: 3,
    jointsEndPrimary: 3,
    internalColumnsMidPrimary: 2,
    internalColumnsEndPrimary: 2,
    ...overrides,
  }
}

export function makeMezzanineExtension(overrides = {}) {
  return {
    type: 'DECK_SHEET' as const,
    heightFrom: 'GROUND' as const,
    typicalTo: 'FLOOR_1' as const,
    thicknessMm: 0.8,
    lengthM: 15,
    widthM: 6,
    heightM: 2.75,
    ...overrides,
  }
}

export function makeMezzanineInput(jobId = faker.string.uuid()) {
  return {
    jobId,
    floors: [makeMezzanineFloor()],
    extensions: [makeMezzanineExtension()],
  }
}

export function makeMezzanine(overrides = {}) {
  return {
    id: faker.string.uuid(),
    jobId: faker.string.uuid(),
    floors: [],
    extensions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function makeStairItem(overrides = {}) {
  return {
    code: 'STAIR-1',
    typeOfStep: 'CHQ_PLATE_6MM' as const,
    location: 'MEZ-1',
    startingFrom: 'GROUND' as const,
    endingUpTo: 'FIRST_FLOOR' as const,
    length: 4,
    width: 1.25,
    height: 2.75,
    numberOfMidLanding: 1,
    typeOfStringer: 'HR_SECTION' as const,
    unitWeightOfStringer: 22.3,
    ...overrides,
  }
}

export function makeAreaDeduction(overrides = {}) {
  return {
    type: 'CUT_OUT' as const,
    location: 'MEZ-1',
    areaM2: 3.6,
    numbers: 1,
    deductionFor: 'BOTH' as const,
    ...overrides,
  }
}

export function makeStairInput(jobId = faker.string.uuid()) {
  return {
    jobId,
    stairs: [makeStairItem()],
    areaDeductions: [makeAreaDeduction()],
  }
}

export function makeStair(overrides = {}) {
  return {
    id: faker.string.uuid(),
    jobId: faker.string.uuid(),
    stairs: [],
    areaDeductions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function makeLoadInput(jobId = faker.string.uuid()) {
  return {
    jobId,
    deadLoadOnRoofRafters: 0.15,
    liveLoadOnRoofRafters: 0.6,
    collateralLoadOnRoofRafters: 0.6,
    windLoadOnRoofRaftersUpward: 140,
    windLoadHorizontal: 140,
    deadLoadOnRoofFloor: 0.6,
    liveLoadOnRoofFloor: 0.6,
    floorDeadLoad: 2.25,
    floorFinishLoad: 0.25,
    floorLiveLoad: 3,
    snowLoad: 3,
    earthquakeLoad: 3,
    approvalDrawingsTime: 7,
    approvalDrawingsUnit: 'DAYS' as const,
    supplyOfMaterialsDays: 60,
    erectionOfStructureDays: 30,
  }
}

export function makeLoad(overrides = {}) {
  return {
    id: faker.string.uuid(),
    ...makeLoadInput(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}


export function makeCanopyItem(overrides = {}) {
  return {
    code: 'CANOPY-1',
    heightFrom: 'GROUND' as const,
    length: 6,
    width: 3,
    height: 3.2,
    materialConsumptionKgPerSqft: 4.2,
    numberOfBeams: 2,
    numberOfPurlins: 6,
    purlinDepth: 0.15,
    unitWeightOfPurlin: 5.4,
    canopySheet: 'NCGL' as const,
    sheetThick: 0.5,
    canopySideCoveringHeight: 1.2,
    gutter: true,
    downTake: false,
    flashing: true,
    ...overrides,
  }
}

export function makeCanopyInput(jobId = faker.string.uuid()) {
  return {
    jobId,
    canopies: [makeCanopyItem()],
  }
}

export function makeCanopy(overrides = {}) {
  return {
    id: faker.string.uuid(),
    jobId: faker.string.uuid(),
    canopies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}


export function makeAccessoryDoor(overrides = {}) {
  return {
    height: 2.1,
    width: 1.2,
    nos: 2,
    quantity: 2,
    ...overrides,
  }
}

export function makeAccessoryWindow(overrides = {}) {
  return {
    height: 1.2,
    width: 1.5,
    nos: 4,
    quantity: 4,
    ...overrides,
  }
}

export function makeAccessoryFoldedPlate(overrides = {}) {
  return {
    length: 6,
    width: 1.2,
    nos: 3,
    quantity: 3,
    ...overrides,
  }
}

export function makeAccessoryOpening(overrides = {}) {
  return {
    kind: 'ROLLING_SHUTTER' as const,
    length: 3.5,
    width: 3,
    nos: 1,
    quantity: 1,
    ...overrides,
  }
}

export function makeAccessoriesInput(jobId = faker.string.uuid()) {
  return {
    jobId,
    gutterType: 'PPGL' as const,
    gutterSize: 'IN_6' as const,
    gutterQuantity: 2,
    partitionType: 'AEROCON_PANEL' as const,
    partitionThickness: 'MM_50' as const,
    roofInsulationType: 'GLASS_WOOL' as const,
    handrailWeightKg: 45.5,
    gantryGirderEnabled: true,
    framesPrimerCoats: 1,
    framesPrimerType: 'EPOXY_PRIMER' as const,
    purlinsGirtsFinish: 'PRE_GALVANISED' as const,
    foundationBoltFinish: 'BLACK_UNPAINTED' as const,
    doors: [makeAccessoryDoor()],
    windows: [makeAccessoryWindow()],
    foldedPlates: [makeAccessoryFoldedPlate()],
    openings: [makeAccessoryOpening()],
  }
}

export function makeAccessories(overrides = {}) {
  return {
    id: faker.string.uuid(),
    jobId: faker.string.uuid(),
    // Server-derived quantity columns (Decimal → serialised as strings over the
    // wire). Default to null; override per test to assert derived values.
    gutterQuantity: null,
    downTakeQuantity: null,
    dripTrimQuantity: null,
    gableEndFlashingQuantity: null,
    cornerFlashQuantity: null,
    ridgeQuantity: null,
    // Per-field manual-override flags (default false → server-derived).
    gutterQuantityManual: false,
    downTakeQuantityManual: false,
    dripTrimQuantityManual: false,
    gableEndFlashingQuantityManual: false,
    cornerFlashQuantityManual: false,
    ridgeQuantityManual: false,
    doors: [],
    windows: [],
    foldedPlates: [],
    openings: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}


export function makeJointBoltRoofItem(overrides = {}) {
  return {
    roofJointId: 'A' as const,
    boltDiameter: 16,
    numberOfBolts: 8,
    ...overrides,
  }
}

export function makeJointBoltMezzanineItem(overrides = {}) {
  return {
    mezzanineJointId: 'M' as const,
    boltDiameter: 16,
    numberOfBolts: 8,
    ...overrides,
  }
}

export function makeFoundationBoltRoofItem(overrides = {}) {
  return {
    foundationJointId: 'FB4' as const,
    boltDiameter: 20,
    numberOfBolts: 8,
    ...overrides,
  }
}

export function makeJointInput(jobId = faker.string.uuid()) {
  return {
    jobId,
    secondaryBeamsBoltType: 'HSFG' as const,
    secondaryBeamsBoltDiameter: 16,
    secondaryBeamsNumberOfBolts: 6,
    purlinFlangeBraceBoltType: 'ORD' as const,
    purlinFlangeBraceBoltDiameter: 12,
    purlinFlangeBraceNumberOfBolts: 14,
    claddingPurlinsBoltType: 'ORD' as const,
    claddingPurlinsBoltDiameter: 12,
    claddingPurlinsNumberOfBolts: 10,
    canopyBoltType: 'ORD' as const,
    canopyBoltDiameter: 16,
    canopyNumberOfBolts: 8,
    jointBoltRoof: [makeJointBoltRoofItem()],
    jointBoltMezzanine: [makeJointBoltMezzanineItem()],
    foundationBoltRoof: [makeFoundationBoltRoofItem()],
  }
}

export function makeJoint(overrides = {}) {
  return {
    id: faker.string.uuid(),
    jobId: faker.string.uuid(),
    secondaryBeamsBoltType: null,
    secondaryBeamsBoltDiameter: null,
    secondaryBeamsNumberOfBolts: null,
    purlinFlangeBraceBoltType: null,
    purlinFlangeBraceBoltDiameter: null,
    purlinFlangeBraceNumberOfBolts: null,
    claddingPurlinsBoltType: null,
    claddingPurlinsBoltDiameter: null,
    claddingPurlinsNumberOfBolts: null,
    canopyBoltType: null,
    canopyBoltDiameter: null,
    canopyNumberOfBolts: null,
    jointBoltRoof: [],
    jointBoltMezzanine: [],
    foundationBoltRoof: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}
