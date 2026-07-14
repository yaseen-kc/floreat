/**
 * Resolves the CORS allowlist from CORS_ORIGIN (comma-separated, exact-match
 * origins). In production the variable is mandatory and may not be `*` — with
 * `credentials: true` an explicit allowlist is required (CWE-942). In
 * non-production it defaults to the local dev origin for DX.
 * @throws if production config is missing/empty or contains a `*` wildcard.
 */
export function resolveCorsOrigin(env: NodeJS.ProcessEnv): string[] {
  const isProd = env.NODE_ENV === 'production'
  const raw = (env.CORS_ORIGIN ?? '').trim()
  if (!raw) {
    if (isProd) {
      throw new Error('CORS_ORIGIN is required in production (no wildcard; set an explicit allowlist).')
    }
    return ['http://localhost:5173']
  }
  const origins = raw.split(',').map((o) => o.trim()).filter(Boolean)
  if (origins.includes('*')) {
    throw new Error('CORS_ORIGIN must not be "*" — credentials require an explicit origin allowlist.')
  }
  return origins
}

/**
 * Centralized app configuration.
 * Reads from environment variables with sensible defaults for local development.
 * `corsOrigins` is validated at import time, so a missing/invalid production
 * CORS_ORIGIN fails the process fast at startup.
 */
export const config = {
  port: Number(process.env.PORT) || 3000,
  corsOrigins: resolveCorsOrigin(process.env),
  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    timeWindow: process.env.RATE_LIMIT_WINDOW || '1 minute',
  },
  docs: {
    enabled: process.env.NODE_ENV !== 'production' && process.env.SWAGGER_UI !== 'false',
  },
}
