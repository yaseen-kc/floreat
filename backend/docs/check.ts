import Fastify from 'fastify'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import SwaggerParser from '@apidevtools/swagger-parser'
import { registerRoutes } from '../routes/index.js'
import { defaultDocsDirectory, generateArtifacts } from './generate.js'
import { getExpectedRouteKeys } from './openapi.js'

function normalizeRoutePath(path: string): string {
  return path.replace(/:([A-Za-z0-9_]+)/g, '{$1}')
}

async function getRegisteredRouteKeys(): Promise<string[]> {
  const app = Fastify()
  const keys: string[] = []
  app.addHook('onRoute', (route) => {
    const methods = Array.isArray(route.method) ? route.method : [route.method]
    for (const method of methods) {
      if (method !== 'HEAD') keys.push(`${method.toUpperCase()} ${normalizeRoutePath(route.url)}`)
    }
  })
  await registerRoutes(app)
  await app.ready()
  await app.close()
  return keys.sort()
}

interface PostmanNode {
  item?: PostmanNode[]
  request?: unknown
}

function countPostmanRequests(items: PostmanNode[]): number {
  return items.reduce((total, item) => total + (item.item ? countPostmanRequests(item.item) : item.request ? 1 : 0), 0)
}

export async function checkDocumentation(): Promise<void> {
  const expectedRoutes = getExpectedRouteKeys()
  const registeredRoutes = await getRegisteredRouteKeys()
  if (JSON.stringify(expectedRoutes) !== JSON.stringify(registeredRoutes)) {
    throw new Error(`API documentation coverage mismatch. Missing or extra routes:\nExpected: ${expectedRoutes.join(', ')}\nRegistered: ${registeredRoutes.join(', ')}`)
  }

  const tempDirectory = await mkdtemp(resolve(tmpdir(), 'floreat-docs-'))
  try {
    await generateArtifacts(tempDirectory)
    await SwaggerParser.validate(resolve(tempDirectory, 'openapi.json'))

    const generatedOpenApi = await readFile(resolve(tempDirectory, 'openapi.json'), 'utf8')
    const committedOpenApi = await readFile(resolve(defaultDocsDirectory, 'openapi.json'), 'utf8')
    const generatedPostman = await readFile(resolve(tempDirectory, 'floreat-api.postman_collection.json'), 'utf8')
    const committedPostman = await readFile(resolve(defaultDocsDirectory, 'floreat-api.postman_collection.json'), 'utf8')
    if (generatedOpenApi !== committedOpenApi || generatedPostman !== committedPostman) {
      throw new Error('Generated documentation artifacts are stale. Run npm run docs:generate and commit the results.')
    }

    const postman = JSON.parse(committedPostman) as { item?: PostmanNode[] }
    const requestCount = countPostmanRequests(postman.item ?? [])
    if (requestCount !== expectedRoutes.length) {
      throw new Error(`Postman collection has ${requestCount} requests; expected ${expectedRoutes.length}.`)
    }
  } finally {
    await rm(tempDirectory, { recursive: true, force: true })
  }
}

if (process.argv[1]?.endsWith('check.ts')) {
  await checkDocumentation()
  console.log(`Documentation is current and covers ${getExpectedRouteKeys().length} API operations.`)
}
