# Floreat — Security / CVE Report

| | |
|---|---|
| **Project** | Floreat — Structural Quotation Studio (monorepo) |
| **Scope** | `backend/` (Fastify 5 + Prisma + Clerk), `frontend/` (React 19 + Vite + Clerk) |
| **Report date** | 2026-06-26 |
| **Commit** | `73f17db` (branch `dev/yaseenkc`) |
| **Method** | `npm audit` (dependency CVEs) + manual source review (application/code-level) |
| **Severity model** | CVSS v3.1 (dependency findings use the advisory's own score; code findings use an assessed band) |

> **Note on CVE identifiers.** `npm audit` resolves Floreat's advisories from the GitHub
> Advisory Database, which returned **GHSA** identifiers only — no CVE IDs were assigned at
> scan time. GHSA IDs are reproduced verbatim below; **no CVE numbers have been invented**.

---

## 1. Executive summary

The audit surfaced **11 findings**: 1 Critical, 4 High, 3 Medium, 2 Low, and 1 Informational.

The single most serious issue is **application-level, not a dependency CVE**: the API has no
object-level authorization. Every authenticated user can read, modify, and delete **every other
user's** jobs and all nested structural data, because `Job` has no owner and no query is scoped to
the caller. This is a complete horizontal-privilege-escalation / data-tenancy failure and should be
treated as a release blocker.

Dependency-wise, both packages ship a vulnerable `hono` (a transitive dependency), and the backend
additionally carries a high-severity `form-data` CRLF flaw and a Prisma toolchain chain. Most are
fixable with a non-breaking `npm audit fix`; the Prisma chain requires a semver-major downgrade and
needs judgement (see §2).

### Severity matrix

| Severity | Count | Findings |
|---|---|---|
| **Critical** | 1 | F-01 |
| **High** | 4 | F-02, D-01, D-02, D-05 |
| **Medium** | 3 | F-03, F-04, D-03 |
| **Low** | 2 | F-05, D-04 |
| **Informational** | 1 | F-06 |

### Remediation priority (roadmap)

1. **Now / blocker** — F-01 (object-level authorization). Add `Job.userId`, scope every read/write/delete by `request.userId`, and verify job ownership before any nested-resource access.
2. **Before any deploy** — F-02 (auth bypass hard-gate), D-01/D-02/D-05 (`npm audit fix` for `form-data` + `hono`).
3. **Hardening** — F-03 (helmet + rate-limit), F-04 (strict CORS allowlist in prod).
4. **Hygiene / scheduled** — F-05 (`.gitignore` `.env*`), D-03/D-04 (Prisma + esbuild; evaluate the semver-major Prisma change).

---

## 2. Dependency vulnerabilities (`npm audit`)

### 2.1 Backend (`backend/`) — 343 deps; 6 vulnerabilities (2 high, 3 moderate, 1 low)

| ID | Package (path) | Installed range | Severity (CVSS) | CWE | Advisory | Fix |
|---|---|---|---|---|---|---|
| **D-01** | `form-data` *(transitive)* | `4.0.0 – 4.0.5` | **High (7.5)** | CWE-93 | [GHSA-hmw2-7cc7-3qxx](https://github.com/advisories/GHSA-hmw2-7cc7-3qxx) — CRLF injection via unescaped multipart field names/filenames | `npm audit fix` (non-breaking) |
| **D-02** | `hono` *(transitive)* | `<= 4.12.24` | **High (7.1)** | CWE-942 (+116, 22, 345, 348) | [GHSA-88fw-hqm2-52qc](https://github.com/advisories/GHSA-88fw-hqm2-52qc) CORS reflects any Origin w/ credentials; + [GHSA-wwfh-h76j-fc44](https://github.com/advisories/GHSA-wwfh-h76j-fc44), [GHSA-j6c9-x7qj-28xf](https://github.com/advisories/GHSA-j6c9-x7qj-28xf), [GHSA-rv63-4mwf-qqc2](https://github.com/advisories/GHSA-rv63-4mwf-qqc2), [GHSA-wgpf-jwqj-8h8p](https://github.com/advisories/GHSA-wgpf-jwqj-8h8p) | `npm audit fix` (non-breaking) |
| **D-03** | `@hono/node-server` → `@prisma/dev` → `prisma` | `@hono/node-server <1.19.13`; `prisma 6.20.0-dev.1 – 7.9.0-dev.7` | **Moderate (5.3)** | CWE-22 | [GHSA-92pp-h63x-v22m](https://github.com/advisories/GHSA-92pp-h63x-v22m) — middleware bypass via repeated slashes in `serveStatic` | `npm audit fix --force` → **`prisma@6.19.3` (semver-major)** |
| **D-04** | `esbuild` *(transitive, dev)* | `0.27.3 – 0.28.0` | **Low (2.5)** | CWE-22 | [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr) — arbitrary file read via dev server on Windows | `npm audit fix` (non-breaking) |

**Notes**
- The `prisma` package is the only **direct** dependency in the vulnerable set; it is flagged because the installed build is a **7.x dev release** (`prisma ^7.8.0` in `package.json`), which pulls a vulnerable `@prisma/dev` → `@hono/node-server`. The advisory chain (D-03) is **dev/CLI tooling**, not the runtime query engine, so production exposure is limited — but the only npm-offered fix is a **major downgrade to `6.19.3`**. Decide deliberately: either downgrade to the stable 6.x line, or track the 7.x release that ships a patched `@prisma/dev`. Do **not** run `--force` blindly in CI.
- `form-data` (D-01) and `hono` (D-02) fixes are non-breaking — apply `npm audit fix` first and re-audit.

### 2.2 Frontend (`frontend/`) — 665 deps; 1 vulnerability (1 high)

| ID | Package (path) | Installed range | Severity (CVSS) | CWE | Advisory | Fix |
|---|---|---|---|---|---|---|
| **D-05** | `hono` *(transitive)* | `<= 4.12.24` | **High (7.1)** | CWE-942 (+116, 22, 345, 348) | Same 5 advisories as D-02 (top: [GHSA-88fw-hqm2-52qc](https://github.com/advisories/GHSA-88fw-hqm2-52qc)) | `npm audit fix` (non-breaking) |

> Most of the `hono` advisories (Lambda adapters, `serve-static`, body-limit) describe code paths
> Floreat does not use directly — `hono` arrives transitively through build/SDK tooling, not as the
> app server (the backend runs Fastify). Patch anyway via `npm audit fix`; residual risk before
> patching is low-to-moderate in practice but the advisory severity is High.

---

## 3. Application security findings (code-level)

### F-01 — Broken Object-Level Authorization (BOLA / IDOR) — **CRITICAL**

- **OWASP:** API1:2023 Broken Object Level Authorization · **CWE:** CWE-639, CWE-862
- **Assessed CVSS v3.1:** ~9.1 (`AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N`)

**Evidence**
- `backend/prisma/schema.prisma:24` — the `Job` model has **no owner field** and **no relation to `User`** (`model User` at `:13` is entirely disconnected from `model Job`).
- `backend/middlewares/auth.ts:25-27` — auth sets `request.userId` from `getAuth(request)` but only proves *a* session exists; nothing downstream consumes it for authorization.
- `backend/services/job.service.ts` — queries are keyed by id alone, never by owner:
  - `:14` `getJobs` → `prisma.job.findMany({ skip, take, orderBy })` — **returns every user's jobs**.
  - `:22` `getJobById` → `findUnique({ where: { id } })`.
  - `:27` `updateJob` → `update({ where: { id }, data })`.
  - `:32` `deleteJob` → `delete({ where: { id } })`.
- All nested resources are scoped only by `jobId`, with no ownership check:
  - `backend/services/roof.service.ts:43,65,70`
  - `backend/services/canopy.service.ts:39,51,56`
  - `backend/services/mezzanine.service.ts:42,57,62`
  - `backend/services/stair.service.ts:42,57,62`

**Impact.** Any authenticated user (any valid Clerk session) can enumerate, read, modify, and delete
**all** jobs and their roof/canopy/mezzanine/stair data across **all tenants**, simply by guessing or
iterating `cuid` ids — or by listing them outright via `GET /api/jobs`. Complete loss of
confidentiality and integrity of business data; no tenant isolation exists.

**Remediation.**
1. Add an owner relation: `userId String` on `Job` with `@relation` to `User`, backfilled for existing rows.
2. Set `userId` from `request.userId` on `createJob` (resolve the local `User.id` via the synced Clerk id).
3. Scope **every** job query/update/delete by owner, e.g. `where: { id, userId }`, returning 404 (not 403) on mismatch to avoid existence disclosure.
4. For nested resources, verify the parent job belongs to `request.userId` before any read/write (e.g. a shared `assertJobOwnership(jobId, userId)` guard), or scope through the relation.
5. Add the missing `userId` provisioning: `syncUser` currently runs only on `/me` (`backend/routes/user.routes.ts`), so a local `User` row may not exist when jobs are created — chain `syncUser` (or an equivalent owner-resolution step) on write routes.

---

### F-02 — Environment-flag authentication bypass — **HIGH**

- **CWE:** CWE-489 (active debug code), CWE-1188 (insecure default) · **Assessed CVSS v3.1:** ~8.1 (conditional on misconfig)

**Evidence** — `backend/middlewares/auth.ts:16-23`:
```ts
if (process.env.BYPASS_AUTH === 'true') {
  const devUserId = request.headers['x-dev-user-id'] as string
  if (devUserId) { request.userId = devUserId; return }
}
```

**Impact.** If `BYPASS_AUTH=true` is ever present in a deployed environment, **any caller** can fully
authenticate as **any user** by sending an `x-dev-user-id` header — no token, no verification. Combined
with F-01, this is unauthenticated total data access. The bypass is guarded only by an env string, with
no environment assertion, so a single misconfigured variable defeats authentication entirely.

**Remediation.** Hard-gate on a non-production assertion that fails closed, e.g.:
```ts
if (process.env.NODE_ENV !== 'production' && process.env.BYPASS_AUTH === 'true') { /* … */ }
```
Better: refuse to boot if `BYPASS_AUTH==='true'` while `NODE_ENV==='production'`. Document the flag as
local-only in `.env.example` and never set it in deploy configs.

---

### F-03 — Missing rate limiting and security headers — **MEDIUM**

- **CWE:** CWE-770 (no resource throttling), CWE-693 (protection mechanism failure) · **Assessed CVSS v3.1:** ~5.3

**Evidence** — `backend/server.ts:16-23` registers only `@fastify/cors` and `clerkPlugin`. There is no
`@fastify/helmet` (no `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, HSTS, etc.) and no
`@fastify/rate-limit`.

**Impact.** The API is exposed to brute-force / credential-stuffing against auth, request flooding
(resource exhaustion / cost), and clickjacking / MIME-sniffing on any HTML-bearing responses. Defense-in-depth
is absent.

**Remediation.** Register `@fastify/helmet` with sensible defaults and `@fastify/rate-limit` (global +
tighter limits on auth-adjacent routes). Both are first-party Fastify plugins and low-risk to add.

**Status: ✅ Remediated.** `@fastify/helmet` (defaults) and `@fastify/rate-limit` are registered in
`backend/server.ts` (order: helmet → cors → rate-limit → clerk). Global limit is env-configurable
(`RATE_LIMIT_MAX`/`RATE_LIMIT_WINDOW`, default 100/min) via `config/index.ts`; tighter 20/min limits
apply to `/me` and the job write routes (`POST`/`PUT`/`DELETE /jobs`). Covered by
`tests/integration/security.test.ts` (asserts `x-content-type-options`, `x-frame-options`,
`x-ratelimit-limit`, and both global + per-route `429`s).

---

### F-04 — CORS allows credentials with a permissive default origin — **MEDIUM**

- **OWASP:** A05:2021 Security Misconfiguration · **CWE:** CWE-942 (overly permissive CORS) · **Assessed CVSS v3.1:** ~5.4

**Evidence**
- `backend/server.ts:16-19` — `register(cors, { origin: config.corsOrigin, credentials: true, … })`.
- `backend/config/index.ts:7` — `corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'`.

**Impact.** `credentials: true` is correct **only** with a strict origin allowlist. If `CORS_ORIGIN`
is unset in production it silently falls back to `localhost:5173`; if it is ever set to `*` or a
reflected value, browsers would send credentialed cross-origin requests. Note this exactly mirrors the
`hono` CORS advisory (D-02/D-05, CWE-942) — the same class of bug appears in both the dependency and
the app's own configuration posture.

**Remediation.** Require `CORS_ORIGIN` in production (fail fast if missing), restrict to an explicit
allowlist of known frontend origins, and never combine `credentials: true` with `*` or origin
reflection. Validate config at startup.

---

### F-05 — Secret-file hygiene in `.gitignore` — **LOW**

- **CWE:** CWE-538 (information exposure through files) · **Assessed CVSS v3.1:** ~3.1

**Evidence**
- `backend/.gitignore` ignores only `.env` (not `.env.*`). `git ls-files` shows **`backend/.env.test` is tracked**.
- `backend/.env.test` contains placeholder/fake secrets only (`CLERK_SECRET_KEY=sk_test_fake`, a local DB DSN) — **no real credentials**.
- **Positive:** `git log --all -- backend/.env` returns nothing — the real `backend/.env` was **never committed**. `frontend/.gitignore` correctly ignores `.env`, and `frontend/.env` is **not tracked** (it holds a Clerk *publishable* key, which is public by design).

**Impact.** Low today (only fake secrets are tracked), but the narrow ignore rule (`/.env` vs `.env*`)
makes it easy for a future real `.env.local`/`.env.production` to be committed accidentally.

**Remediation.** Broaden `backend/.gitignore` to `.env*` with an exception for the template:
```
.env*
!.env.example
```
Keep `.env.test` tracked only while it contains exclusively non-secret fixtures.

---

### F-06 — Frontend API error handling — **INFORMATIONAL (no action)**

**Evidence** — `frontend/src/lib/api.ts` throws `Error(\`API error: ${res.status}\`)` on `!res.ok`
and returns `null` for empty/204 bodies. It surfaces only the status code, leaks no server internals,
and parses bodies safely. **Acceptable as-is.** (Optional: surface server-provided error messages to
users where useful, without exposing stack traces.)

---

## 4. Configuration & secrets review

| Item | Status | Evidence |
|---|---|---|
| Real `backend/.env` committed to history | ✅ Pass | `git log --all -- backend/.env` → empty |
| `frontend/.env` tracked | ✅ Pass | not in `git ls-files`; ignored by `frontend/.gitignore` |
| `.env.example` documents keys (no values) | ✅ Pass | `backend/.env.example`, `frontend/.env.example` tracked, keys only |
| `backend/.gitignore` covers all `.env*` | ⚠️ Partial | ignores `/.env` only; `.env.test` tracked (fake secrets) — see **F-05** |
| Tracked env files contain real secrets | ✅ Pass | `backend/.env.test` = `sk_test_fake` / local DSN; `frontend/.env` = public `pk_test_…` (not tracked) |
| CORS origin allowlisted for prod | ⚠️ Fail | defaults to `localhost:5173`; `credentials: true` — see **F-04** |
| Auth bypass disabled in prod | ⚠️ Fail | `BYPASS_AUTH` not environment-gated — see **F-02** |
| Security headers / rate limiting | ✅ Pass | `@fastify/helmet` + `@fastify/rate-limit` (global 100/min + 20/min on `/me` and job writes) registered in `server.ts` — **F-03 remediated** |

---

## 5. Reproduction

```bash
# Dependency CVEs
cd backend  && npm audit            # 6 vulns: 2 high, 3 moderate, 1 low
cd frontend && npm audit            # 1 high (hono)

# Tracked env files / secret history
git ls-files backend/.env backend/.env.test frontend/.env
git log --all -- backend/.env       # empty == never committed
```

Application findings (F-01…F-06) are evidenced by the `file:line` references in §3, against commit `73f17db`.

---

## 6. Appendix — advisory index

| GHSA | Package | CWE | CVSS |
|---|---|---|---|
| GHSA-hmw2-7cc7-3qxx | form-data | CWE-93 | 7.5 |
| GHSA-88fw-hqm2-52qc | hono | CWE-942 | 7.1 |
| GHSA-wwfh-h76j-fc44 | hono | CWE-22 | 5.9 |
| GHSA-rv63-4mwf-qqc2 | hono | CWE-345 | 6.5 |
| GHSA-j6c9-x7qj-28xf | hono | CWE-116 | 5.3 |
| GHSA-wgpf-jwqj-8h8p | hono | CWE-348 | 4.8 |
| GHSA-92pp-h63x-v22m | @hono/node-server | CWE-22 | 5.3 |
| GHSA-g7r4-m6w7-qqqr | esbuild | CWE-22 | 2.5 |

*No CVE IDs were assigned by the advisory source at scan time; GHSA identifiers are authoritative here.*
