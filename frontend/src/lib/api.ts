const API_URL = import.meta.env.VITE_API_URL

/**
 * Error thrown by `apiFetch` for non-2xx responses. Carries the HTTP `status`
 * and the parsed response `body` (when available) so callers can react
 * programmatically. The `message` is the server-provided `{ error: "..." }`
 * string when present, otherwise a generic `API error: <status>` fallback.
 */
export class ApiError extends Error {
  status: number
  body: unknown
  constructor(status: number, message: string, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/**
 * Thin `fetch` wrapper. Attaches the JSON content type and bearer token, maps
 * 204 / empty bodies to `null`, and parses JSON otherwise. On a non-ok status
 * it throws an `ApiError`: the message is the backend's `{ error }` string when
 * that field is a string, otherwise `API error: <status>`. Structured bodies
 * (e.g. Zod `flatten()` objects) are never surfaced as the message, but remain
 * available via `ApiError.body`.
 */
export async function apiFetch(path: string, token: string | null, options?: RequestInit) {
  // Only declare a JSON body when one is actually present — sending
  // Content-Type: application/json with no body causes Fastify to return 400.
  const hasBody = options?.body !== undefined && options?.body !== null
  const headers: Record<string, string> = {
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  })
  if (!res.ok) {
    const raw = await res.text().catch(() => '')
    let body: unknown = raw || null
    try {
      body = raw ? JSON.parse(raw) : null
    } catch {
      // Non-JSON error body — keep the raw text as the body.
    }
    const serverMsg =
      body && typeof body === 'object' && typeof (body as { error?: unknown }).error === 'string'
        ? (body as { error: string }).error
        : null
    throw new ApiError(res.status, serverMsg ?? `API error: ${res.status}`, body)
  }

  // 204 No Content (e.g. DELETE) and other empty-body responses have no JSON
  // to parse — return null instead of throwing on an empty body.
  if (res.status === 204 || res.headers.get('Content-Length') === '0') return null

  const text = await res.text()
  if (!text) return null
  return JSON.parse(text)
}
