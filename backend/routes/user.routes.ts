/**
 * User route definitions.
 * All routes here require authentication and user sync before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { syncUser } from '../middlewares/sync-user.js'
import { getMe, listUsers, assignRole, inviteUser, resendInvitation, revokeInvitation, deactivateUser, reactivateUser } from '../controllers/user.controller.js'
import { loadAuthorization, requirePermission } from '../middlewares/authorization.js'
import { PERMISSIONS } from '../auth/authorization.js'

export async function userRoutes(app: FastifyInstance) {
  // GET /api/me — returns the authenticated user's profile.
  // Tighter rate limit: auth-adjacent route.
  app.get(
    '/me',
    {
      preHandler: [authMiddleware, syncUser, loadAuthorization],
      config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    },
    getMe,
  )
  const auth = [authMiddleware, syncUser, loadAuthorization]
  app.get('/users', { preHandler: [...auth, requirePermission(PERMISSIONS.USER_LIST)] }, listUsers)
  app.patch('/users/:clerkId/role', { preHandler: [...auth, requirePermission(PERMISSIONS.USER_ROLE_ASSIGN)], config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }, assignRole)
  app.post('/users/invitations', { preHandler: [...auth, requirePermission(PERMISSIONS.USER_INVITE)], config: { rateLimit: { max: 10, timeWindow: '1 minute' } } }, inviteUser)
  app.post('/users/invitations/:id/resend', { preHandler: [...auth, requirePermission(PERMISSIONS.USER_INVITATION_RESEND)], config: { rateLimit: { max: 10, timeWindow: '1 minute' } } }, resendInvitation)
  app.post('/users/invitations/:id/revoke', { preHandler: [...auth, requirePermission(PERMISSIONS.USER_INVITATION_REVOKE)], config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }, revokeInvitation)
  app.post('/users/:clerkId/deactivate', { preHandler: [...auth, requirePermission(PERMISSIONS.USER_DEACTIVATE)], config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }, deactivateUser)
  app.post('/users/:clerkId/reactivate', { preHandler: [...auth, requirePermission(PERMISSIONS.USER_REACTIVATE)], config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }, reactivateUser)
}
