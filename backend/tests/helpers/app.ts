import Fastify from 'fastify'
import cors from '@fastify/cors'
import { clerkPlugin } from '@clerk/fastify'
import { registerRoutes } from '../../routes/index.js'

export async function buildApp() {
  const app = Fastify()
  app.decorateRequest('userId', '')
  await app.register(cors)
  await app.register(clerkPlugin)
  await registerRoutes(app)
  await app.ready()
  return app
}
