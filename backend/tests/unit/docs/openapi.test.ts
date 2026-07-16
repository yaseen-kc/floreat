import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import SwaggerParser from '@apidevtools/swagger-parser'
import { describe, expect, it } from 'vitest'
import '../../mocks/clerk.js'
import { buildApp } from '../../helpers/app.js'
import { checkDocumentation } from '../../../docs/check.js'
import { buildOpenApiDocument, getExpectedRouteKeys } from '../../../docs/openapi.js'

type Operation = {
  operationId?: string
  security?: unknown[]
  requestBody?: unknown
  responses?: Record<string, unknown>
}

type OpenApiDocument = ReturnType<typeof buildOpenApiDocument>

function operations(document: OpenApiDocument): Operation[] {
  return Object.values(document.paths).flatMap((pathItem) => Object.values(pathItem).filter((value): value is Operation => typeof value === 'object' && value !== null && 'operationId' in value))
}

type PostmanNode = { name?: string; item?: PostmanNode[]; request?: unknown }

function flattenPostman(items: PostmanNode[]): PostmanNode[] {
  return items.flatMap((item) => item.item ? flattenPostman(item.item) : [item])
}

describe('generated API documentation', () => {
  it('generates all registered operations with stable metadata', async () => {
    const document = buildOpenApiDocument()
    const generatedOperations = operations(document)
    expect(generatedOperations).toHaveLength(52)
    expect(generatedOperations.every((operation) => operation.operationId)).toBe(true)
    expect(Object.keys(document.paths).every((path) => !path.includes(':'))).toBe(true)
    expect(document.components?.securitySchemes).toHaveProperty('LocalDevUserId')
    expect(document.paths['/api/health']?.get).toMatchObject({ security: [] })
    expect(document.paths['/api/jobs']?.post).toHaveProperty('requestBody')
    expect(document.paths['/api/jobs/{id}']?.delete?.responses).toHaveProperty('204')
    expect(document.paths['/api/jobs/{id}']?.delete?.responses).toHaveProperty('401')
    expect(document.paths['/api/rates/{id}']?.delete?.responses).toHaveProperty('204')
    expect(document.paths['/api/rates/{id}']?.delete?.responses).toHaveProperty('404')
    expect(document.paths['/api/rates']?.post?.responses).toHaveProperty('409')
    expect(document.paths['/api/rates/{id}']?.put?.responses).toHaveProperty('404')
    expect(document.components?.schemas).toHaveProperty('CreateRoofRequest')
    expect(document.components?.schemas).toHaveProperty('CreateStairRequest')
    expect(document.components?.schemas).toHaveProperty('DecimalString')
    expect(document.components?.schemas?.CreateJobRequest).toMatchObject({
      required: expect.arrayContaining(['projectNo', 'date', 'numberOfBuilding']),
    })
    expect(document.components?.schemas?.CreateJobRequest?.properties?.date).toMatchObject({ type: 'string', format: 'date-time' })
    expect(document.components?.schemas?.CreateRoofRequest?.properties?.sidewalls?.items?.properties?.side).toMatchObject({
      enum: ['FRONT', 'BACK', 'RIGHT', 'LEFT'],
    })
    expect(document.components?.schemas?.DecimalString).toMatchObject({ type: 'string', example: '30.000' })
    expect(document.components?.schemas?.RoofResponse?.properties?.eaveHeight).toMatchObject({ $ref: '#/components/schemas/DecimalString' })
    await SwaggerParser.validate(document)
  })

  it('keeps route coverage synchronized with the Fastify registry', async () => {
    await checkDocumentation()
    expect(getExpectedRouteKeys()).toHaveLength(52)
  })

  it('generates one Postman request per documented operation with local auth variables', async () => {
    const collectionPath = fileURLToPath(new URL('../../../docs/floreat-api.postman_collection.json', import.meta.url))
    const collection = JSON.parse(await readFile(collectionPath, 'utf8')) as {
      item: PostmanNode[]
      variable: Array<{ key: string; value: string }>
      event: unknown[]
    }
    const requests = flattenPostman(collection.item)
    expect(requests).toHaveLength(52)
    expect(requests.some((request) => request.name?.toLowerCase().includes('stair'))).toBe(true)
    expect(collection.variable).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'baseUrl', value: 'http://localhost:3000' }),
      expect.objectContaining({ key: 'devUserId', value: 'user_your_clerk_id_here' }),
    ]))
    expect(collection.event).toHaveLength(1)
  })

  it('serves Swagger UI only when explicitly enabled by the test app', async () => {
    const app = await buildApp({ docs: true })
    const response = await app.inject({ method: 'GET', url: '/docs' })
    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/html')
    await app.close()
  })
})


  it('does not expose Swagger UI by default', async () => {
    const app = await buildApp()
    const response = await app.inject({ method: 'GET', url: '/docs' })
    expect(response.statusCode).toBe(404)
    await app.close()
  })
