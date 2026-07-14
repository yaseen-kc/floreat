/**
 * Health service — liveness/readiness checks for the backend.
 * All DB access lives here per the layering rules (route → controller → service).
 */
import { prisma } from '../lib/prisma.js'

/**
 * Readiness probe: verifies the database is reachable with a lightweight
 * `SELECT 1`. Returns `true` when the query succeeds, `false` on any error.
 * The underlying error is intentionally swallowed so no connection details or
 * stack traces leak through the public health endpoint.
 */
export async function isDatabaseReady(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}
