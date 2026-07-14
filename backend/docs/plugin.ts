import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { FastifyInstance } from 'fastify'

function openApiPath(): string {
  const here = dirname(fileURLToPath(import.meta.url))
  const candidates = [resolve(here, 'openapi.json'), resolve(here, '../../docs/openapi.json')]
  const path = candidates.find((candidate) => existsSync(candidate))
  if (!path) throw new Error('Generated OpenAPI document not found. Run npm run docs:generate first.')
  return path
}

/** Registers the generated OpenAPI document and Swagger UI for development only. */
export async function registerDevelopmentDocs(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    mode: 'static',
    specification: { path: openApiPath() },
  })
  await app.register(swaggerUi, {
    routePrefix: '/docs',
    staticCSP: true,
  })
}
