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
