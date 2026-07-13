# Backend Rules

> Prescriptive standards for AI agents generating code in this project.

## 0. Workspace & `@floreat/shared`

Floreat is a single **npm workspaces** monorepo. The repo root `package.json`
declares `"workspaces": ["shared", "backend", "frontend"]`; one `npm install` at
the root links everything and symlinks the local `@floreat/shared` package into
both apps.

```
floreat/
├── package.json        # workspace root (private) — scripts: build:shared, build, test
├── shared/             # @floreat/shared — the single source of truth (see below)
├── backend/            # this package
└── frontend/
```

**`@floreat/shared`** owns everything both apps must agree on. It is written in
TypeScript, compiled to `shared/dist` (JS + `.d.ts`), and consumed **by package
name** through subpath exports — never by relative path:

| Import | Contents |
|--------|----------|
| `@floreat/shared/schemas` | Zod 4 request contracts + enums (one module per resource) and the shared `paginationSchema`. |
| `@floreat/shared/calc`    | Pure business-math / equation functions. |
| `@floreat/shared/types`   | Wire-format primitives (`DecimalString`, `Nullable<T>`). |
| `@floreat/shared/units`   | Decimal-string / unit coercion helpers (`num`, `int`). |

```
shared/src/
├── schemas/   # {resource}.schema.ts + pagination.schema.ts + index.ts (barrel)
├── calc/      # {resource}.calc.ts + index.ts
├── types/     # index.ts (DecimalString, Nullable)
└── units/     # index.ts (num, int)
```

Rules:

- **`shared` builds before the apps.** `tsc`/`tsx`/`vitest` resolve the compiled
  `dist` via the package's `exports`, so run `npm run build:shared` (root) after
  editing `shared/src`, and before `npm run build`/`dev` in an app. The root
  `build`/`dev:*` scripts do this for you.
- **Schemas, enums, and shared types have exactly one home: `shared`.** Never
  redefine a request contract or enum in `backend/` — import it (see §8).
- **Calculations are backend-authoritative.** Any value the client *could*
  compute but the server must be able to trust is derived on the server from
  validated inputs using a `@floreat/shared/calc` function; the client value is
  ignored. The frontend may reuse the same function for live preview only.
  Example: `roof.service` recomputes `sideColumnsWidthHeight` from
  `eaveHeight`/`roofSlope`/`claddingExtensionWidthHeight` via
  `deriveSideColumnsWidthHeight` and overwrites whatever the client sent.

## 1. Tech Stack

- Node.js + TypeScript (ESM, ES2023 target)
- Fastify 5 (HTTP server)
- Prisma 7 + `@prisma/adapter-pg` + `pg` (PostgreSQL data layer)
- Zod 4 (request validation) — schemas live in `@floreat/shared` (see §0)
- Clerk (`@clerk/fastify`) for authentication
- Vitest 4 + `vitest-mock-extended` + `@faker-js/faker` (testing)
- `tsx` (dev runtime), `tsc` (build / typecheck)

## 2. Directory Structure

```
backend/
├── server.ts              # App entry: Fastify + CORS + Clerk + route registration
├── config/index.ts        # Centralized env-derived config (port, corsOrigin)
├── routes/
│   ├── index.ts           # Route registry — registers every route module under /api
│   └── {resource}.routes.ts   # Route definitions + auth preHandlers per resource
├── controllers/
│   └── {resource}.controller.ts   # HTTP request/response + Zod parsing, delegates to services
├── services/
│   └── {resource}.service.ts      # ALL Prisma access + business logic
├── schemas/
│   └── {resource}.schema.ts       # Thin re-export of the contract from @floreat/shared/schemas
├── middlewares/
│   ├── auth.ts            # Clerk auth — verifies token, attaches request.userId
│   └── sync-user.ts       # Lazily provisions a local DB user from Clerk profile
├── lib/prisma.ts          # PrismaClient instance (pg adapter + connection pool)
├── utils/response.ts      # sendError() — standardized error responses
├── types/fastify.d.ts     # Fastify request augmentations (userId)
├── prisma/
│   ├── schema.prisma      # generator + datasource ONLY (multi-file schema)
│   ├── models/            # {resource}.prisma — models + enums, one file per resource
│   ├── migrations/        # Generated migration history
│   └── seed.ts            # Seed script
├── generated/prisma/      # Generated Prisma client — DO NOT edit manually
└── tests/                 # Mirrors source structure (see §12)
```

## 3. File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Route module | `{resource}.routes.ts` | `canopy.routes.ts` |
| Controller | `{resource}.controller.ts` | `canopy.controller.ts` |
| Service | `{resource}.service.ts` | `canopy.service.ts` |
| Schema | `{resource}.schema.ts` | `canopy.schema.ts` |
| Test | `{source-name}.test.ts` | `roof.service.test.ts` |

- Resource names are singular (`roof`, `canopy`, `mezzanine`, `stair`).
- One file per resource per layer — never combine two resources in one file.

## 4. Architecture & Layering

Strict one-way dependency flow:

```
route  →  controller  →  service  →  lib/prisma
```

- **Routes** map URLs + HTTP verbs to controller functions and attach auth preHandlers.
- **Controllers** own HTTP concerns only: read params/query/body, validate with Zod,
  call a service, shape the reply. They **never** import `prisma` directly.
- **Services** own ALL database access and business logic. They **never** touch
  `FastifyRequest`/`FastifyReply` or HTTP status codes.
- **`lib/prisma`** is the single PrismaClient instance — never instantiate `PrismaClient`
  anywhere else.

Each layer depends only on the layer directly below it. Controllers import services;
services import `prisma`. Do not skip layers (no Prisma calls from controllers).

## 5. Routing

- Every route module exports an `async function {resource}Routes(app: FastifyInstance)`.
- All modules are registered in `routes/index.ts#registerRoutes` under the `/api` prefix.
  Add new route files there as the API grows.
- Attach `authMiddleware` as a `preHandler` on every protected route.

### 5.1 URL patterns

Resource data hangs off a job. Use **both** of these shapes per resource:

- **Nested single-job routes** — `'/jobs/:jobId/{resource}'`:
  - `POST` → `upsert`
  - `GET` → `getByJobId`
  - `PUT` → `update`
  - `DELETE` → `remove`
- **Flat list route** — `'/{resource}s'`:
  - `GET` → `getAll` (paginated)

Top-level entities (`Job`, `User`) use plain REST: `/jobs`, `/jobs/:id`, `/me`.

```ts
// src/routes/canopy.routes.ts
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import * as canopyController from '../controllers/canopy.controller.js'

export async function canopyRoutes(app: FastifyInstance) {
  app.post('/jobs/:jobId/canopy', { preHandler: [authMiddleware] }, canopyController.upsert)
  app.get('/jobs/:jobId/canopy', { preHandler: [authMiddleware] }, canopyController.getByJobId)
  app.put('/jobs/:jobId/canopy', { preHandler: [authMiddleware] }, canopyController.update)
  app.delete('/jobs/:jobId/canopy', { preHandler: [authMiddleware] }, canopyController.remove)
  app.get('/canopies', { preHandler: [authMiddleware] }, canopyController.getAll)
}
```

## 6. Controllers

- Keep controllers thin — parse, validate, delegate, reply. No business logic.
- Validate input with `schema.safeParse(...)`. On failure return **400** with the
  flattened Zod error:

  ```ts
  const result = createCanopySchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  ```
- Read path params with a typed cast: `const { jobId } = request.params as { jobId: string }`.
- Use `sendError(reply, status, message)` from `@/utils/response` for not-found and other
  domain errors — never hand-roll error bodies.
- Map service "not found" failures to **404**:
  - `getByJobId`: if the service returns `null`, `sendError(reply, 404, '...')`.
  - `update`: wrap in `try/catch`, return 404 on throw.
  - `remove`: catch Prisma `err?.code === 'P2025'` → 404; re-throw anything else.
- Status codes:
  - Create (top-level, e.g. job) → **201**
  - Upsert → **200**
  - Get / list / update → **200**
  - **Delete → 204 No Content** (empty body — see §17)

```ts
// src/controllers/canopy.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { createCanopySchema, updateCanopySchema, paginationSchema } from '../schemas/canopy.schema.js'
import * as canopyService from '../services/canopy.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/canopy — upserts a canopy for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createCanopySchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const canopy = await canopyService.upsertCanopy(jobId, result.data)
  return reply.status(200).send(canopy)
}

/** DELETE /api/jobs/:jobId/canopy — deletes the canopy for a job. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await canopyService.deleteCanopy(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Canopy not found')
    throw err
  }
}
```

## 7. Services

- All Prisma access lives here. Export plain `async`/function declarations — no classes.
- Each function carries a **JSDoc** comment describing what it does and its failure mode.
- **Upsert by unique `jobId`** for nested resources:

  ```ts
  return prisma.canopy.upsert({
    where: { jobId },
    create: { jobId, ...rest, canopies: { createMany: { data: canopyData } } },
    update: { ...rest, canopies: { deleteMany: {}, createMany: { data: canopyData } } },
    include: { canopies: true },
  })
  ```
- **Inline child arrays use a replace-all strategy.** On create use `createMany`; on
  update/upsert-update use `{ deleteMany: {}, createMany: { data } }`. Always `include`
  the children so the response is complete.
- On `update`, only touch the child relation when the array is actually provided:

  ```ts
  if (canopies !== undefined) {
    updateData.canopies = { deleteMany: {}, createMany: { data: canopies } }
  }
  ```
- **List functions return `{ data, total, page, pageSize }`**, computed with a single
  `Promise.all` of `findMany` + `count`, ordered `createdAt: 'desc'`:

  ```ts
  export async function getCanopies(page: number, pageSize: number) {
    const [data, total] = await Promise.all([
      prisma.canopy.findMany({ skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' }, include: { canopies: true } }),
      prisma.canopy.count(),
    ])
    return { data, total, page, pageSize }
  }
  ```
- Delete by `jobId`. Let Prisma throw `P2025` on a missing record — the controller maps
  it to 404. Do not pre-check existence.

## 8. Validation Schemas

- One module per resource **in `@floreat/shared/schemas`** (the `backend/schemas/{resource}.schema.ts`
  file is a thin `export * from '@floreat/shared/schemas'` shim so controllers/services keep
  importing from `../schemas/{resource}.schema.js`). Author new contracts in `shared`, not here.
  Export, per resource:
  1. `create{Resource}Schema` — a `z.object({...})`.
  2. `update{Resource}Schema = create{Resource}Schema.partial()`.
  3. Inferred payload types: `export type Create{Resource}Input = z.infer<typeof create{Resource}Schema>`
     (and the matching `Update...Input`).
- Model enums as `z.enum([...])`, declared as named consts and reused across fields.
- Constrain numbers precisely: `z.number().positive()`, `.int().nonnegative()`, etc.
- Use `z.coerce` for values arriving as strings (query params, dates):
  `z.coerce.number()`, `z.coerce.date()`.
- **Pagination uses the single shared schema** exported from `@floreat/shared/schemas`
  (re-exported by every backend `*.schema.ts` shim):

  ```ts
  export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  })
  ```

```ts
// shared/src/schemas/canopy.schema.ts — the single source of truth
import { z } from 'zod'

export const canopyHeightFromEnum = z.enum(['GROUND', 'FF', 'SF', 'FLOOR_3', 'FLOOR_4', 'FLOOR_5'])
export const canopySheetTypeEnum = z.enum(['NCGL', 'PPGL', 'PUFF', 'OTHER'])

export const canopyItemSchema = z.object({
  code: z.string().regex(/^CANOPY-[1-9][0-9]*$/).optional(),
  heightFrom: canopyHeightFromEnum.optional(),
  length: z.number().positive().optional(),
  canopySheet: canopySheetTypeEnum.optional(),
})

export const createCanopySchema = z.object({
  canopies: z.array(canopyItemSchema).optional(),
})

export const updateCanopySchema = createCanopySchema.partial()

export type CreateCanopyInput = z.infer<typeof createCanopySchema>
export type UpdateCanopyInput = z.infer<typeof updateCanopySchema>
```

```ts
// backend/schemas/canopy.schema.ts — thin re-export shim
export * from '@floreat/shared/schemas'
```

## 9. Data Layer / Prisma

- Single client instance in `lib/prisma.ts` using the pg adapter + a connection pool:

  ```ts
  import { PrismaClient } from '../generated/prisma/client.js'
  import { PrismaPg } from '@prisma/adapter-pg'
  import pg from 'pg'

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  export const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })
  ```
- The generated client lives in `generated/prisma` (configured by the `generator` block)
  and is imported via the `../generated/prisma/client.js` specifier. Never edit it; run
  `npm run db:generate` after schema changes.
- Schema conventions:
  - IDs: `String @id @default(cuid())`.
  - Nested resources own a `jobId String @unique` with
    `@relation(fields: [jobId], references: [id], onDelete: Cascade)`.
  - Precision numerics: `Decimal @db.Decimal(10, 3)`.
  - Enums use `@map` for human-facing DB values (e.g. `FE_345 @map("FE 345")`).
- **Wire format:** Prisma `Decimal` columns serialize to JSON **strings** over HTTP
  (`Decimal.prototype.toJSON`). The create/update payloads accept `number`, but response
  consumers see `string`. Keep this in mind for any response typing (mirrors the frontend
  rule in `frontend-standards.md §6.5`). The shared `DecimalString`/`Nullable` primitives
  (`@floreat/shared/types`) and the `num`/`int` coercion helpers (`@floreat/shared/units`)
  model this boundary.
- Migration / DB workflow (npm scripts): `db:generate`, `db:migrate`,
  `db:migrate:deploy`, `db:push`, `db:studio`, `db:seed`.

## 10. Authentication

- `authMiddleware` (`middlewares/auth.ts`) runs as a `preHandler` on every protected
  route. It resolves the Clerk `userId` via `getAuth(request)`, returns **401** if absent,
  and attaches `request.userId`.
- `syncUser` (`middlewares/sync-user.ts`) lazily provisions a local DB `User` from the
  Clerk profile on first request. Chain it after `authMiddleware` where a local user row
  is required (e.g. `/me`): `{ preHandler: [authMiddleware, syncUser] }`.
- `request.userId` is declared via Fastify module augmentation in `types/fastify.d.ts`.
- **Dev-only bypass:** `authMiddleware` honors `BYPASS_AUTH=true` + an `x-dev-user-id`
  header to skip Clerk during local testing (e.g. Postman). This is **development only** —
  never enable `BYPASS_AUTH` in any deployed environment.

## 11. Error Handling

- Use the shared helper for all error responses — never hand-roll error bodies:

  ```ts
  // src/utils/response.ts
  export function sendError(reply: FastifyReply, statusCode: number, message: string) {
    return reply.status(statusCode).send({ error: message })
  }
  ```
- Standard error body shape is `{ error: <message-or-flattened-zod> }`:
  - Validation failures → `{ error: result.error.flatten() }` (400).
  - Domain errors (not found, etc.) → `{ error: 'message' }` via `sendError`.
- Map Prisma `P2025` (record not found) to **404** in delete handlers; re-throw unknown
  errors so Fastify's logger surfaces them.

## 12. Testing

- Framework: Vitest 4 with `globals: true`, `environment: 'node'`. Setup file
  `tests/setup.ts` loads `.env.test`.
- Tests live in `tests/` mirroring source: `tests/unit/{services,controllers,middlewares}`
  and `tests/integration/routes`.
- **Prisma is mocked** with `vitest-mock-extended`: `tests/mocks/prisma.ts` exports
  `prismaMock` (`mockDeep<PrismaClient>`) and `mockReset`s it in `beforeEach`. Import the
  mock module for its side effect before importing the unit under test.
- **Clerk is mocked** in `tests/mocks/clerk.ts` (`getAuth`, `clerkPlugin`, `clerkClient`).
- Build a real Fastify instance for integration tests with `tests/helpers/app.ts#buildApp()`
  and drive it via `app.inject(...)`.
- Use faker `make*Input` / `make*` builders from `tests/helpers/factories.ts` — never
  hand-build fixtures inline.
- **Unit service tests** assert the exact Prisma call args:

  ```ts
  expect(prismaMock.roof.findUnique).toHaveBeenCalledWith({ where: { jobId: 'job-1' }, include: { sidewalls: true } })
  ```
- **Integration route tests** assert status codes + JSON, and cover the 401-unauthenticated
  path:

  ```ts
  it('returns 401 when unauthenticated', async () => {
    mockGetAuth.mockReturnValueOnce({ userId: null })
    const res = await app.inject({ method: 'GET', url: '/api/jobs/job-1/roof' })
    expect(res.statusCode).toBe(401)
  })
  ```
- Coverage threshold is **80%** (lines/functions/branches/statements) over
  `services`, `controllers`, `middlewares`, `routes`, `utils`. Keep new code above it.

## 13. TypeScript

- ESM only (`"type": "module"`). **Relative imports MUST use the `.js` specifier**
  (e.g. `import { prisma } from '../lib/prisma.js'`), even though the source is `.ts` —
  required by `moduleResolution: bundler` + ESM output.
- Target ES2023, `strict: true`.
- Never use `any` in source. Use precise types or `unknown` + narrowing. (Test files may
  use `as any` for Prisma mock return values where exact generated types are noisy.)
- Use `import type` for type-only imports (e.g. `import type { CreateCanopyInput } from ...`).
- Type function params and return values; prefer `interface` for object shapes, `type`
  for unions/inferred (`z.infer`) aliases.

## 14. Environment Variables

- Config is read from the environment and centralized in `config/index.ts` with sensible
  local defaults:

  ```ts
  export const config = {
    port: Number(process.env.PORT) || 3000,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  }
  ```
- Files: `.env` (local dev), `.env.test` (loaded by the test setup), `.env.example`
  (documents every key — keys only, no values).
- Documented keys: `DATABASE_URL`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `PORT`,
  `CORS_ORIGIN`. Add any new key to `.env.example`.
- Prefer reading config through `config/index.ts`; read `process.env` directly only for
  infra wiring (`DATABASE_URL` in `lib/prisma.ts`, the dev `BYPASS_AUTH` flag).

## 15. Canonical Example

The **roof / canopy** resources are the canonical reference. A new nested resource is a
vertical slice across four files plus tests, all following the rules above.

```ts
// shared/src/schemas/roof.schema.ts (excerpt) — backend re-exports it via a shim
import { z } from 'zod'

const sideWallSideEnum = z.enum(['FRONT', 'BACK', 'RIGHT', 'LEFT'])
const typeOfWallEnum = z.enum(['BRICK', 'PANEL', 'LATERITE', 'AAC', 'BLOCK'])

export const sidewallSchema = z.object({
  side: sideWallSideEnum,
  wallType: typeOfWallEnum,
  thickness: z.number().positive(),
  height: z.number().positive(),
})

export const createRoofSchema = z.object({
  buildingOverallLength: z.number().positive(),
  eaveHeight: z.number().positive(),
  roofSlope: z.number().positive(),
  mainRoofFrames: z.number().int().positive(),
  sidewalls: z.array(sidewallSchema).optional(),
})

export const updateRoofSchema = createRoofSchema.partial()
export type CreateRoofInput = z.infer<typeof createRoofSchema>
export type UpdateRoofInput = z.infer<typeof updateRoofSchema>
```

```ts
// src/services/roof.service.ts
import { prisma } from '../lib/prisma.js'
import type { CreateRoofInput } from '../schemas/roof.schema.js'

/** Creates or updates a roof for a given job. Sidewalls are replaced entirely on update. */
export function upsertRoof(jobId: string, data: CreateRoofInput) {
  const { sidewalls, ...rest } = data
  const sidewallData = sidewalls ?? []
  return prisma.roof.upsert({
    where: { jobId },
    create: { jobId, ...rest, sidewalls: { createMany: { data: sidewallData } } },
    update: { ...rest, sidewalls: { deleteMany: {}, createMany: { data: sidewallData } } },
    include: { sidewalls: true },
  })
}

/** Deletes a roof by its associated job ID. Throws P2025 if not found. */
export function deleteRoof(jobId: string) {
  return prisma.roof.delete({ where: { jobId } })
}
```

```ts
// src/controllers/roof.controller.ts (excerpt)
import { FastifyRequest, FastifyReply } from 'fastify'
import { createRoofSchema } from '../schemas/roof.schema.js'
import * as roofService from '../services/roof.service.js'
import { sendError } from '../utils/response.js'

/** GET /api/jobs/:jobId/roof — returns the roof for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const roof = await roofService.getRoofByJobId(jobId)
  if (!roof) return sendError(reply, 404, 'Roof not found')
  return reply.send(roof)
}
```

```ts
// src/routes/roof.routes.ts
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import * as roofController from '../controllers/roof.controller.js'

export async function roofRoutes(app: FastifyInstance) {
  app.post('/jobs/:jobId/roof', { preHandler: [authMiddleware] }, roofController.upsert)
  app.get('/jobs/:jobId/roof', { preHandler: [authMiddleware] }, roofController.getByJobId)
  app.put('/jobs/:jobId/roof', { preHandler: [authMiddleware] }, roofController.update)
  app.delete('/jobs/:jobId/roof', { preHandler: [authMiddleware] }, roofController.remove)
  app.get('/roofs', { preHandler: [authMiddleware] }, roofController.getAll)
}
```

```ts
// tests/unit/services/roof.service.test.ts (excerpt)
import { describe, it, expect } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeRoof } from '../../helpers/factories.js'
import { getRoofByJobId } from '../../../services/roof.service.js'

describe('roof.service', () => {
  it('returns roof when found', async () => {
    const roof = makeRoof()
    prismaMock.roof.findUnique.mockResolvedValue(roof as any)
    const result = await getRoofByJobId('job-1')
    expect(result).toEqual(roof)
    expect(prismaMock.roof.findUnique).toHaveBeenCalledWith({ where: { jobId: 'job-1' }, include: { sidewalls: true } })
  })
})
```

```ts
// tests/integration/routes/roof.routes.test.ts (excerpt)
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance
beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

it('deletes a roof', async () => {
  prismaMock.roof.delete.mockResolvedValue({} as any)
  const res = await app.inject({ method: 'DELETE', url: '/api/jobs/job-1/roof' })
  expect(res.statusCode).toBe(204)
})
```

## 16. Do's and Don'ts

### Do

- Keep controllers thin — validate, delegate, reply.
- Put ALL Prisma access in services; import the single `prisma` instance from `lib/prisma`.
- Use the `.js` specifier on every relative import.
- Validate every request body/query with Zod `safeParse` and return 400 with `flatten()`.
- Use `sendError` for error responses and map `P2025` → 404.
- Return `{ data, total, page, pageSize }` from list endpoints.
- Register every new route module in `routes/index.ts`.
- Add `authMiddleware` as a `preHandler` on protected routes.
- Write both a unit service test (assert Prisma args) and an integration route test
  (assert status + JSON, including the 401 path). Keep coverage ≥ 80%.
- Document new env keys in `.env.example`.
- Author request contracts, enums, and business calculations in `@floreat/shared`;
  run `npm run build:shared` after editing it so the apps resolve the compiled `dist`.

### Don't

- Edit the generated client in `generated/prisma/` (regenerate with `npm run db:generate`).
- Import `prisma` or call the DB from controllers or routes.
- Instantiate `new PrismaClient()` outside `lib/prisma.ts`.
- Use `any` in source files.
- Use extension-less or `.ts` relative import specifiers.
- Hand-roll error response bodies — use `sendError`.
- Enable `BYPASS_AUTH` outside local development.
- Redefine a request contract, enum, or the pagination schema in `backend/` — import
  them from `@floreat/shared/schemas` (see §0/§8).
- Trust a client-sent *computed* value — recompute it server-side from validated inputs
  via a `@floreat/shared/calc` function (see §0).
- Hand-build test fixtures — use the factories in `tests/helpers/factories.ts`.

## 17. Known Deviations to Fix

These are points where the current code diverges from the standard above. New code MUST
follow the standard; existing code should be migrated when touched.

- **DELETE status code.** Some delete handlers (e.g. `roof`, `canopy`) currently return
  `200` with `{ message: '... deleted successfully' }`. The standard is **204 No Content**
  with an empty body (matches the frontend `apiFetch` contract and the roof integration
  test, which asserts `204`). *Fix:* change `remove` handlers to `reply.status(204).send()`
  and update any assertion expecting the message body.
- **Duplicated `paginationSchema`.** *Resolved.* The single `paginationSchema` now lives
  in `@floreat/shared/schemas` (`shared/src/schemas/pagination.schema.ts`); every backend
  `*.schema.ts` re-exports it. Do not reintroduce a per-file copy.
