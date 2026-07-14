import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { convertV2, type CollectionResult, type Options } from 'openapi-to-postmanv2'
import { buildOpenApiDocument } from './openapi.js'

interface PostmanHeader {
  key: string
  value: string
  type?: string
}

interface PostmanUrl {
  raw?: string
}

interface PostmanRequest {
  url?: PostmanUrl
  header?: PostmanHeader[]
  auth?: unknown
}

interface PostmanItem {
  name?: string
  item?: PostmanItem[]
  request?: PostmanRequest
  response?: unknown
}

interface PostmanCollection {
  info: { name: string; schema: string; description?: string }
  item: PostmanItem[]
  auth?: unknown
  event?: unknown[]
  variable?: Array<{ key: string; value: string; type?: string }>
}

const currentDirectory = dirname(fileURLToPath(import.meta.url))
export const defaultDocsDirectory = currentDirectory

function convertOpenApiToPostman(document: object): Promise<PostmanCollection> {
  const options: Options = {
    folderStrategy: 'Tags',
    parametersResolution: 'Example',
    schemaFaker: false,
    includeAuthInfoInExample: false,
    alwaysInheritAuthentication: true,
  }

  return new Promise((resolveCollection, reject) => {
    convertV2({ type: 'json', data: document }, options, (error, result?: CollectionResult) => {
      if (error) return reject(new Error(error.message))
      if (!result?.result || !result.output?.[0]?.data) {
        return reject(new Error(result?.reason ?? 'Postman collection conversion failed.'))
      }
      resolveCollection(result.output[0].data as PostmanCollection)
    })
  })
}

function stripGeneratedIds(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach(stripGeneratedIds)
    return
  }
  if (typeof value !== 'object' || value === null) return
  const object = value as Record<string, unknown>
  delete object.id
  Object.values(object).forEach(stripGeneratedIds)
}

function normalizeRequest(item: PostmanItem): void {
  if (item.request) {
    if (item.request.url?.raw) {
      item.request.url.raw = item.request.url.raw.replace('http://localhost:3000', '{{baseUrl}}')
    }
    delete item.request.auth
    item.request.header = item.request.header?.filter((header) => header.key.toLowerCase() !== 'x-dev-user-id')
  }
  delete item.response
  item.item?.forEach(normalizeRequest)
}

function customizePostmanCollection(collection: PostmanCollection): PostmanCollection {
  normalizeRequest({ item: collection.item })
  collection.info = {
    name: 'Floreat API',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    description: 'Generated from backend/docs/openapi.json. Run npm run docs:generate instead of editing this collection manually.',
  }
  collection.auth = { type: 'noauth' }
  collection.variable = [
    { key: 'baseUrl', value: 'http://localhost:3000', type: 'string' },
    { key: 'devUserId', value: 'user_your_clerk_id_here', type: 'string' },
  ]
  collection.event = [{
    listen: 'prerequest',
    script: {
      type: 'text/javascript',
      exec: [
        "if (!pm.request.url.toString().includes('/api/health')) {",
        "  pm.request.headers.add({ key: 'x-dev-user-id', value: pm.variables.get('devUserId') });",
        '}',
      ],
    },
  }]
  return collection
}

export async function generateArtifacts(outputDirectory = defaultDocsDirectory): Promise<void> {
  await mkdir(outputDirectory, { recursive: true })
  const openApiDocument = buildOpenApiDocument()
  await writeFile(resolve(outputDirectory, 'openapi.json'), `${JSON.stringify(openApiDocument, null, 2)}\n`, 'utf8')
  const collection = customizePostmanCollection(await convertOpenApiToPostman(JSON.parse(JSON.stringify(openApiDocument)) as object))
  stripGeneratedIds(collection)
  await writeFile(resolve(outputDirectory, 'floreat-api.postman_collection.json'), `${JSON.stringify(collection, null, 2)}\n`, 'utf8')
}

export async function readGeneratedOpenApi(outputDirectory = defaultDocsDirectory): Promise<Record<string, unknown>> {
  const content = await readFile(resolve(outputDirectory, 'openapi.json'), 'utf8')
  return JSON.parse(content) as Record<string, unknown>
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(currentDirectory, 'generate.ts')) {
  await generateArtifacts(process.env.DOCS_OUTPUT_DIR ? resolve(process.env.DOCS_OUTPUT_DIR) : defaultDocsDirectory)
}
