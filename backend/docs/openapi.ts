import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

const {
  createAccessoriesSchema,
  createCanopySchema,
  createJobSchema,
  createJointSchema,
  createLoadSchema,
  createMezzanineSchema,
  createRoofSchema,
  createSpecSchema,
  createStairSchema,
  paginationSchema,
  updateAccessoriesSchema,
  updateCanopySchema,
  updateJobSchema,
  updateJointSchema,
  updateLoadSchema,
  updateMezzanineSchema,
  updateRoofSchema,
  updateSpecSchema,
  updateStairSchema,
} = await import('@floreat/shared/schemas')

const registry = new OpenAPIRegistry()

const schemas = {
  CreateAccessoriesRequest: createAccessoriesSchema.meta({ id: 'CreateAccessoriesRequest' }),
  UpdateAccessoriesRequest: updateAccessoriesSchema.meta({ id: 'UpdateAccessoriesRequest' }),
  CreateCanopyRequest: createCanopySchema.meta({ id: 'CreateCanopyRequest' }),
  UpdateCanopyRequest: updateCanopySchema.meta({ id: 'UpdateCanopyRequest' }),
  CreateJobRequest: createJobSchema.meta({ id: 'CreateJobRequest' }),
  UpdateJobRequest: updateJobSchema.meta({ id: 'UpdateJobRequest' }),
  CreateJointRequest: createJointSchema.meta({ id: 'CreateJointRequest' }),
  UpdateJointRequest: updateJointSchema.meta({ id: 'UpdateJointRequest' }),
  CreateLoadRequest: createLoadSchema.meta({ id: 'CreateLoadRequest' }),
  UpdateLoadRequest: updateLoadSchema.meta({ id: 'UpdateLoadRequest' }),
  CreateMezzanineRequest: createMezzanineSchema.meta({ id: 'CreateMezzanineRequest' }),
  UpdateMezzanineRequest: updateMezzanineSchema.meta({ id: 'UpdateMezzanineRequest' }),
  CreateRoofRequest: createRoofSchema.meta({ id: 'CreateRoofRequest' }),
  UpdateRoofRequest: updateRoofSchema.meta({ id: 'UpdateRoofRequest' }),
  CreateSpecRequest: createSpecSchema.meta({ id: 'CreateSpecRequest' }),
  UpdateSpecRequest: updateSpecSchema.meta({ id: 'UpdateSpecRequest' }),
  CreateStairRequest: createStairSchema.meta({ id: 'CreateStairRequest' }),
  UpdateStairRequest: updateStairSchema.meta({ id: 'UpdateStairRequest' }),
  PaginationQuery: paginationSchema.meta({ id: 'PaginationQuery' }),
}

registry.registerComponent('securitySchemes', 'LocalDevUserId', {
  type: 'apiKey',
  in: 'header',
  name: 'x-dev-user-id',
  description: 'Development-only user ID used when BYPASS_AUTH=true.',
})

const resourceResponseSchema = z.object({}).catchall(z.unknown())
const decimalStringSchema = z.string().regex(/^-?\d+(\.\d+)?$/).meta({
  id: 'DecimalString',
  description: 'Prisma Decimal values are serialized as JSON strings over HTTP.',
  example: '30.000',
})
const roofResponseSchema = z.object({
  id: z.string().optional(),
  jobId: z.string().optional(),
  buildingOverallLength: decimalStringSchema.optional(),
  buildingOverallWidth: decimalStringSchema.optional(),
  eaveHeight: decimalStringSchema.optional(),
  roofSlope: decimalStringSchema.optional(),
}).catchall(z.unknown())
const paginatedResponseSchema = z.object({
  data: z.array(z.unknown()),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
})
const apiErrorSchema = z.object({ error: z.union([z.string(), z.record(z.string(), z.unknown())]) })
const healthResponseSchema = z.object({ status: z.enum(['ok', 'error']), db: z.enum(['up', 'down']) })

const responseSchemas = {
  AccessoriesResponse: resourceResponseSchema.meta({ id: 'AccessoriesResponse' }),
  CanopyResponse: resourceResponseSchema.meta({ id: 'CanopyResponse' }),
  JobResponse: resourceResponseSchema.meta({ id: 'JobResponse' }),
  JointResponse: resourceResponseSchema.meta({ id: 'JointResponse' }),
  LoadResponse: resourceResponseSchema.meta({ id: 'LoadResponse' }),
  MezzanineResponse: resourceResponseSchema.meta({ id: 'MezzanineResponse' }),
  RoofResponse: roofResponseSchema.meta({ id: 'RoofResponse' }),
  SpecResponse: resourceResponseSchema.meta({ id: 'SpecResponse' }),
  StairResponse: resourceResponseSchema.meta({ id: 'StairResponse' }),
  UserResponse: resourceResponseSchema.meta({ id: 'UserResponse' }),
  PaginatedAccessoriesResponse: paginatedResponseSchema.meta({ id: 'PaginatedAccessoriesResponse' }),
  PaginatedCanopyResponse: paginatedResponseSchema.meta({ id: 'PaginatedCanopyResponse' }),
  PaginatedJobResponse: paginatedResponseSchema.meta({ id: 'PaginatedJobResponse' }),
  PaginatedJointResponse: paginatedResponseSchema.meta({ id: 'PaginatedJointResponse' }),
  PaginatedLoadResponse: paginatedResponseSchema.meta({ id: 'PaginatedLoadResponse' }),
  PaginatedMezzanineResponse: paginatedResponseSchema.meta({ id: 'PaginatedMezzanineResponse' }),
  PaginatedRoofResponse: paginatedResponseSchema.meta({ id: 'PaginatedRoofResponse' }),
  PaginatedSpecResponse: paginatedResponseSchema.meta({ id: 'PaginatedSpecResponse' }),
  PaginatedStairResponse: paginatedResponseSchema.meta({ id: 'PaginatedStairResponse' }),
  ApiError: apiErrorSchema.meta({ id: 'ApiError' }),
  HealthResponse: healthResponseSchema.meta({ id: 'HealthResponse' }),
}

const jobIdParams = () => z.object({ jobId: z.string().meta({ example: 'job_cuid_123' }) })
const idParams = () => z.object({ id: z.string().meta({ example: 'cuid_123' }) })
const paginationQuery = () => paginationSchema

const examples = {
  job: {
    projectNo: 'PRJ-001',
    subject: 'New Warehouse Design',
    refNo: 'REF-2026-001',
    date: '2026-06-05',
    designedByName: 'John Doe',
    designedByMobile: '+919876543210',
    clientName: 'ABC Corp',
    estimationEngineerName: 'Jane Smith',
    estimationEngineerMobile: '+919876543211',
    headOfSalesName: 'Bob Wilson',
    headOfSalesMobile: '+919876543212',
    firmName: 'Floreat Engineering',
    buildingUsage: 'Warehouse',
    numberOfBuilding: 2,
    frameType: 'Steel',
    configuration: 'Standard',
  },
  roof: {
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
    roofFrameBaseFixing: 'FOUNDATION_BOLT',
    columnSegmentsInMainFrame: 3,
    raftersInOneHalfOfMainFrame: 2,
    roofPurlinType: 'Z_C',
    roofPurlinDepth: 0.15,
    roofPurlinUnitWeight: 4.5,
    roofCoveringType: 'BARE_GALVALUME',
    roofCoveringThickness: 0.5,
    windBracingType: 'ROD',
    gradeOfPlateMaterial: 'FE_345',
    sidewalls: [
      { side: 'FRONT', wallType: 'BRICK', thickness: 0.23, height: 3.5 },
      { side: 'BACK', wallType: 'PANEL', thickness: 0.1, height: 4 },
    ],
  },
  mezzanine: {
    floors: [{
      code: 'MEZ-1', floor: 'FLOOR_1', type: 'DECK_SHEET', heightFrom: 'GROUND',
      thicknessMm: 150, lengthM: 12, widthM: 8, heightM: 3.5,
      materialConsumptionKgPerSqft: 4.5, beamsMidPrimary: 4, beamsEndPrimary: 2,
      beamsSecondary: 6, jointsMidPrimary: 2, jointsEndPrimary: 1,
      internalColumnsMidPrimary: 2, internalColumnsEndPrimary: 1,
    }],
    extensions: [{
      type: 'RCC_SLAB', heightFrom: 'FIRST_FLOOR', typicalTo: 'FLOOR_3',
      thicknessMm: 120, lengthM: 10, widthM: 6, heightM: 3,
      beamsMidPrimary: 3, beamsEndPrimary: 1, beamsSecondary: 4,
      jointsMidPrimary: 1, jointsEndPrimary: 1, extendedColumnsMidPrimary: 2,
      extendedColumnsEndPrimary: 1,
    }],
  },
  stair: {
    stairs: [{
      code: 'STAIR-1', typeOfStep: 'CHQ_PLATE_6MM', location: 'MEZ-1',
      startingFrom: 'GROUND', endingUpTo: 'FIRST_FLOOR', length: 4.2,
      width: 1.2, height: 3.5, numberOfMidLanding: 1,
      typeOfStringer: 'FAB_SECTION', unitWeightOfStringer: 18,
    }],
    areaDeductions: [{ type: 'LIFT', location: 'EXT-1', areaM2: 8, numbers: 1, deductionFor: 'BOTH' }],
  },
  canopy: {
    canopies: [{
      code: 'CANOPY-1', heightFrom: 'GROUND', length: 6, width: 3, height: 3.5,
      materialConsumptionKgPerSqft: 9.5, numberOfBeams: 4, numberOfPurlins: 6,
      purlinDepth: 150, unitWeightOfPurlin: 5.2, canopySheet: 'PPGL',
      sheetThick: 0.5, canopySideCoveringHeight: 1.2, gutter: true,
      downTake: false, flashing: true,
    }],
  },
  load: {
    deadLoadOnRoofRafters: 0.15, liveLoadOnRoofRafters: 0.75,
    collateralLoadOnRoofRafters: 0.1, windLoadOnRoofRaftersUpward: 1.2,
    windLoadHorizontal: 0.9, deadLoadOnRoofFloor: 0.2, liveLoadOnRoofFloor: 0.8,
    floorDeadLoad: 2.5, floorFinishLoad: 1, floorLiveLoad: 5, snowLoad: 0.5,
    earthquakeLoad: 0.3, approvalDrawingsTime: 2, approvalDrawingsUnit: 'WEEKS',
    supplyOfMaterialsDays: 30, erectionOfStructureDays: 45,
  },
  accessories: {
    gutterType: 'PPGL', gutterSize: 'IN_6', gutterQuantity: 2,
    downTakeType: 'UPVC', downTakeSize: 'IN_4', downTakeQuantity: 3,
    dripTrimType: 'NCGL', dripTrimThickness: 'MM_0_47', ridgeType: 'PPGL',
    ridgeThickness: 'MM_0_50', partitionType: 'AEROCON_PANEL', partitionThickness: 'MM_50',
    partitionQuantity: 4, roofInsulationType: 'GLASS_WOOL', wallInsulationType: 'ROCK_WOOL',
    turboVentilatorDiameter: 'FT_1', turboVentilatorNos: 2, handrailWeightKg: 45.5,
    deckSheetFlashingEnabled: true, gantryGirderEnabled: false, liftStructureEnabled: true,
    framesPrimerCoats: 1, framesPrimerType: 'EPOXY_PRIMER', framesPaintCoats: 2,
    framesPaintType: 'EPOXY_PAINT', purlinsGirtsFinish: 'PRE_GALVANISED',
    purlinsGirtsGsm: 120, purlinsGirtsPaint: 'UNPAINTED', foundationBoltFinish: 'BLACK_UNPAINTED',
    doors: [{ height: 2.1, width: 1.2, nos: 2, quantity: 2 }],
    windows: [{ height: 1.2, width: 1.5, nos: 4, quantity: 4 }],
    foldedPlates: [{ length: 6, width: 1.2, nos: 3, quantity: 3 }],
    openings: [{ kind: 'ROLLING_SHUTTER', length: 3.5, width: 3, nos: 1, quantity: 1 }],
  },
  joint: {
    secondaryBeamsBoltType: 'HSFG', secondaryBeamsBoltDiameter: 12, secondaryBeamsNumberOfBolts: 4,
    purlinFlangeBraceBoltType: 'ORD', purlinFlangeBraceBoltDiameter: 10, purlinFlangeBraceNumberOfBolts: 2,
    claddingPurlinsBoltType: 'ORD', claddingPurlinsBoltDiameter: 10, claddingPurlinsNumberOfBolts: 2,
    canopyBoltType: 'HSFG', canopyBoltDiameter: 12, canopyNumberOfBolts: 3,
    jointBoltRoof: [{ roofJointId: 'A', boltDiameter: 20, numberOfBolts: 6 }, { roofJointId: 'A_1', boltDiameter: 16, numberOfBolts: 4 }],
    jointBoltMezzanine: [{ mezzanineJointId: 'M', boltDiameter: 16, numberOfBolts: 4 }],
    foundationBoltRoof: [{ foundationJointId: 'FB4', boltDiameter: 24, numberOfBolts: 4 }],
  },
  spec: {
    description: 'Fabricated Columns and Beams',
    specifications: [
      'Fabricated from Plates or Stocks by continuous welding process.',
      'Conform to IS2062 Grade E345 / ASTM A572-12 Grade 50.',
      'Minimum plate thickness: 4 mm.',
    ],
    makeOrBrand: ['JSW', 'TATA'],
    yieldStrengthMpa: 345,
  },
}

interface ResourceDefinition {
  singular: string
  plural: string
  tag: string
  createSchema: z.ZodType
  updateSchema: z.ZodType
  responseSchema: z.ZodType
  paginatedSchema: z.ZodType
  example: Record<string, unknown>
}

const resourceDefinitions: ResourceDefinition[] = [
  { singular: 'Roof', plural: 'roofs', tag: 'Roof', createSchema: schemas.CreateRoofRequest, updateSchema: schemas.UpdateRoofRequest, responseSchema: responseSchemas.RoofResponse, paginatedSchema: responseSchemas.PaginatedRoofResponse, example: examples.roof },
  { singular: 'Mezzanine', plural: 'mezzanines', tag: 'Mezzanine', createSchema: schemas.CreateMezzanineRequest, updateSchema: schemas.UpdateMezzanineRequest, responseSchema: responseSchemas.MezzanineResponse, paginatedSchema: responseSchemas.PaginatedMezzanineResponse, example: examples.mezzanine },
  { singular: 'Stair', plural: 'stairs', tag: 'Stair', createSchema: schemas.CreateStairRequest, updateSchema: schemas.UpdateStairRequest, responseSchema: responseSchemas.StairResponse, paginatedSchema: responseSchemas.PaginatedStairResponse, example: examples.stair },
  { singular: 'Canopy', plural: 'canopies', tag: 'Canopy', createSchema: schemas.CreateCanopyRequest, updateSchema: schemas.UpdateCanopyRequest, responseSchema: responseSchemas.CanopyResponse, paginatedSchema: responseSchemas.PaginatedCanopyResponse, example: examples.canopy },
  { singular: 'Load', plural: 'loads', tag: 'Load', createSchema: schemas.CreateLoadRequest, updateSchema: schemas.UpdateLoadRequest, responseSchema: responseSchemas.LoadResponse, paginatedSchema: responseSchemas.PaginatedLoadResponse, example: examples.load },
  { singular: 'Accessories', plural: 'accessories', tag: 'Accessories', createSchema: schemas.CreateAccessoriesRequest, updateSchema: schemas.UpdateAccessoriesRequest, responseSchema: responseSchemas.AccessoriesResponse, paginatedSchema: responseSchemas.PaginatedAccessoriesResponse, example: examples.accessories },
  { singular: 'Joint', plural: 'joints', tag: 'Joint', createSchema: schemas.CreateJointRequest, updateSchema: schemas.UpdateJointRequest, responseSchema: responseSchemas.JointResponse, paginatedSchema: responseSchemas.PaginatedJointResponse, example: examples.joint },
  { singular: 'Spec', plural: 'specs', tag: 'Specs', createSchema: schemas.CreateSpecRequest, updateSchema: schemas.UpdateSpecRequest, responseSchema: responseSchemas.SpecResponse, paginatedSchema: responseSchemas.PaginatedSpecResponse, example: examples.spec },
]

export const documentedOperations: string[] = []

function operationKey(method: string, path: string): string {
  return `${method.toUpperCase()} ${path}`
}

function registerOperation(options: {
  method: 'get' | 'post' | 'put' | 'delete'
  path: string
  operationId: string
  tag: string
  summary: string
  description: string
  auth?: boolean
  params?: z.ZodObject
  query?: z.ZodObject
  body?: { schema: z.ZodType; example: Record<string, unknown>; description: string }
  responseSchema?: z.ZodType
  responseDescription: string
  status?: 200 | 201
}) {
  const request: RouteConfig['request'] = {}
  if (options.params) request.params = options.params
  if (options.query) request.query = options.query
  if (options.body) {
    request.body = {
      description: options.body.description,
      content: {
        'application/json': {
          schema: options.body.schema,
          example: options.body.example,
        },
      },
    }
  }

  const responses: RouteConfig['responses'] = {}
  if (options.responseSchema) {
    responses[String(options.status ?? 200)] = {
      description: options.responseDescription,
      content: { 'application/json': { schema: options.responseSchema } },
    }
  } else {
    responses['204'] = { description: options.responseDescription }
  }
  responses['400'] = { description: 'Validation error', content: { 'application/json': { schema: responseSchemas.ApiError } } }
  if (options.auth !== false) {
    responses['401'] = { description: 'Authentication required', content: { 'application/json': { schema: responseSchemas.ApiError } } }
  }

  registry.registerPath({
    method: options.method,
    path: options.path,
    operationId: options.operationId,
    tags: [options.tag],
    summary: options.summary,
    description: options.description,
    security: options.auth === false ? [] : [{ LocalDevUserId: [] }],
    request,
    responses,
  })
  documentedOperations.push(operationKey(options.method, options.path))
}

function registerResourceOperations(resource: ResourceDefinition) {
  const nestedPath = `/api/jobs/{jobId}/${resource.singular.toLowerCase()}`
  registerOperation({
    method: 'post', path: nestedPath, operationId: `upsert${resource.singular}`, tag: resource.tag,
    summary: `Create or replace a job's ${resource.singular.toLowerCase()}`, auth: true,
    description: `Creates or replaces the ${resource.singular.toLowerCase()} configuration for the specified job.`,
    params: jobIdParams(), body: { schema: resource.createSchema, example: resource.example, description: `Validated ${resource.singular.toLowerCase()} payload.` },
    responseSchema: resource.responseSchema, responseDescription: 'Resource saved.',
  })
  registerOperation({
    method: 'get', path: nestedPath, operationId: `get${resource.singular}ByJob`, tag: resource.tag,
    summary: `Get a job's ${resource.singular.toLowerCase()}`, auth: true,
    description: `Returns the ${resource.singular.toLowerCase()} configuration belonging to the specified job.`,
    params: jobIdParams(), responseSchema: resource.responseSchema, responseDescription: 'Resource returned.',
  })
  registerOperation({
    method: 'put', path: nestedPath, operationId: `update${resource.singular}`, tag: resource.tag,
    summary: `Update a job's ${resource.singular.toLowerCase()}`, auth: true,
    description: `Partially updates the ${resource.singular.toLowerCase()} configuration for the specified job.`,
    params: jobIdParams(), body: { schema: resource.updateSchema, example: resource.example, description: `Partial ${resource.singular.toLowerCase()} payload.` },
    responseSchema: resource.responseSchema, responseDescription: 'Resource updated.',
  })
  registerOperation({
    method: 'delete', path: nestedPath, operationId: `delete${resource.singular}`, tag: resource.tag,
    summary: `Delete a job's ${resource.singular.toLowerCase()}`, auth: true,
    description: `Deletes the ${resource.singular.toLowerCase()} configuration for the specified job.`,
    params: jobIdParams(), responseDescription: 'Resource deleted. No response body is returned.',
  })
  registerOperation({
    method: 'get', path: `/api/${resource.plural}`, operationId: `list${resource.plural[0].toUpperCase()}${resource.plural.slice(1)}`,
    tag: resource.tag, summary: `List ${resource.plural}`, auth: true,
    description: `Returns a paginated list of ${resource.plural}.`, query: paginationQuery(),
    responseSchema: resource.paginatedSchema, responseDescription: 'Paginated resource list returned.',
  })
}

registerOperation({
  method: 'get', path: '/api/health', operationId: 'getHealth', tag: 'Health', auth: false,
  summary: 'Get API and database health', description: 'Public liveness and readiness probe.',
  responseSchema: responseSchemas.HealthResponse, responseDescription: 'The API and database are healthy.',
})
registerOperation({
  method: 'get', path: '/api/me', operationId: 'getMe', tag: 'User', auth: true,
  summary: 'Get the authenticated user', description: 'Returns the local profile for the authenticated Clerk user.',
  responseSchema: responseSchemas.UserResponse, responseDescription: 'Authenticated user returned.',
})
registerOperation({
  method: 'post', path: '/api/jobs', operationId: 'createJob', tag: 'Jobs', auth: true,
  summary: 'Create a job', description: 'Creates a new structural quotation job.',
  body: { schema: schemas.CreateJobRequest, example: examples.job, description: 'New job payload.' },
  responseSchema: responseSchemas.JobResponse, responseDescription: 'Job created.', status: 201,
})
registerOperation({
  method: 'get', path: '/api/jobs', operationId: 'listJobs', tag: 'Jobs', auth: true,
  summary: 'List jobs', description: 'Returns a paginated list of jobs.', query: paginationQuery(),
  responseSchema: responseSchemas.PaginatedJobResponse, responseDescription: 'Paginated job list returned.',
})
registerOperation({
  method: 'get', path: '/api/jobs/{id}', operationId: 'getJobById', tag: 'Jobs', auth: true,
  summary: 'Get a job by ID', description: 'Returns one job by its identifier.', params: idParams(),
  responseSchema: responseSchemas.JobResponse, responseDescription: 'Job returned.',
})
registerOperation({
  method: 'put', path: '/api/jobs/{id}', operationId: 'updateJob', tag: 'Jobs', auth: true,
  summary: 'Update a job', description: 'Partially updates a job by its identifier.', params: idParams(),
  body: { schema: schemas.UpdateJobRequest, example: { subject: 'Updated Warehouse Design', buildingUsage: 'Factory', numberOfBuilding: 3 }, description: 'Partial job payload.' },
  responseSchema: responseSchemas.JobResponse, responseDescription: 'Job updated.',
})
registerOperation({
  method: 'delete', path: '/api/jobs/{id}', operationId: 'deleteJob', tag: 'Jobs', auth: true,
  summary: 'Delete a job', description: 'Deletes a job by its identifier.', params: idParams(),
  responseDescription: 'Job deleted. No response body is returned.',
})

for (const resource of resourceDefinitions) registerResourceOperations(resource)

export const documentedRouteKeys = [...documentedOperations].sort()

export function buildOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions)
  return generator.generateDocument({
    openapi: '3.0.3',
    info: {
      title: 'Floreat API',
      version: '1.0.0',
      description: 'Structural quotation API for Floreat.',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local development server' }],
    tags: [
      { name: 'Health', description: 'Liveness and readiness endpoints.' },
      { name: 'User', description: 'Authenticated user endpoints.' },
      { name: 'Jobs', description: 'Structural quotation jobs.' },
      { name: 'Roof', description: 'Roof configuration endpoints.' },
      { name: 'Mezzanine', description: 'Mezzanine configuration endpoints.' },
      { name: 'Stair', description: 'Stair configuration endpoints.' },
      { name: 'Canopy', description: 'Canopy configuration endpoints.' },
      { name: 'Load', description: 'Load configuration endpoints.' },
      { name: 'Accessories', description: 'Accessories configuration endpoints.' },
      { name: 'Joint', description: 'Joint configuration endpoints.' },
      { name: 'Specs', description: 'Job product specification endpoints.' },
    ],
  })
}

export function getExpectedRouteKeys(): string[] {
  return documentedRouteKeys
}
