/**
 * Centralized app configuration.
 * Reads from environment variables with sensible defaults for local development.
 */
export const config = {
  port: Number(process.env.PORT) || 3000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    timeWindow: process.env.RATE_LIMIT_WINDOW || '1 minute',
  },
}
