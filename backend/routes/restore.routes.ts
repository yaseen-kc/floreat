import type { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { syncUser } from '../middlewares/sync-user.js'
import { loadAuthorization, requirePermission } from '../middlewares/authorization.js'
import { PERMISSIONS } from '../auth/authorization.js'
import * as controller from '../controllers/restore.controller.js'

export async function restoreRoutes(app: FastifyInstance) {
  app.post('/admin/deleted/:batchId/restore', { preHandler: [authMiddleware, syncUser, loadAuthorization, requirePermission(PERMISSIONS.SOFT_DELETE_RESTORE)] }, controller.restore)
}
