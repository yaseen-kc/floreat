import Fastify from 'fastify'
import cors from '@fastify/cors'
import { clerkPlugin } from '@clerk/fastify'
import { authMiddleware } from './middlewares/auth.js'
import { syncUser } from './middlewares/sync-user.js'
import { prisma } from './lib/prisma.js'

const fastify = Fastify({ logger: true })

fastify.decorateRequest('userId', '')

await fastify.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true,
})

await fastify.register(clerkPlugin)

// Protected routes
fastify.get('/api/me', { preHandler: [authMiddleware, syncUser] }, async (request) => {
  return prisma.user.findUnique({ where: { clerkId: request.userId } })
})

// Start
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
