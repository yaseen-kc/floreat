import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiFetch } from '@/lib/api'

/**
 * Builds a minimal Response-like stub for the global `fetch` mock. Only the
 * members `apiFetch` touches (`ok`, `status`, `headers.get`, `text`) are
 * provided.
 */
function makeResponse(opts: {
  ok: boolean
  status: number
  body?: string
  contentLength?: string
}): Response {
  const headers = new Headers()
  if (opts.contentLength !== undefined) headers.set('Content-Length', opts.contentLength)
  return {
    ok: opts.ok,
    status: opts.status,
    headers,
    text: vi.fn().mockResolvedValue(opts.body ?? ''),
  } as unknown as Response
}

describe('apiFetch', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('parses a JSON body on a 200 response', async () => {
    const payload = { id: 'roof-1', jobId: 'job-1' }
    vi.mocked(fetch).mockResolvedValueOnce(
      makeResponse({ ok: true, status: 200, body: JSON.stringify(payload) }),
    )

    const result = await apiFetch('/api/jobs/job-1/roof', 'token-123')

    expect(result).toEqual(payload)
  })

  it('returns null on a 204 No Content response without parsing', async () => {
    const res = makeResponse({ ok: true, status: 204 })
    vi.mocked(fetch).mockResolvedValueOnce(res)

    const result = await apiFetch('/api/jobs/job-1/roof', 'token-123', { method: 'DELETE' })

    expect(result).toBeNull()
    // A 204 should short-circuit before any body read is attempted.
    expect(res.text).not.toHaveBeenCalled()
  })

  it('returns null when the body is empty', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse({ ok: true, status: 200, body: '' }))

    const result = await apiFetch('/api/jobs/job-1/roof', 'token-123')

    expect(result).toBeNull()
  })

  it('returns null when Content-Length is 0', async () => {
    const res = makeResponse({ ok: true, status: 200, contentLength: '0' })
    vi.mocked(fetch).mockResolvedValueOnce(res)

    const result = await apiFetch('/api/jobs/job-1/roof', 'token-123')

    expect(result).toBeNull()
    expect(res.text).not.toHaveBeenCalled()
  })

  it('throws on a non-ok status', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse({ ok: false, status: 404 }))

    await expect(apiFetch('/api/jobs/job-1/roof', 'token-123')).rejects.toThrow('API error: 404')
  })
})
