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
