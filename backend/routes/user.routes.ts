/**
 * User route definitions.
 * All routes here require authentication and user sync before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { syncUser } from '../middlewares/sync-user.js'
import { getMe } from '../controllers/user.controller.js'

export async function userRoutes(app: FastifyInstance) {
  // GET /api/me — returns the authenticated user's profile
  app.get('/me', { preHandler: [authMiddleware, syncUser] }, getMe)
}
