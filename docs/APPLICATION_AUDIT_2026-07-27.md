# Application implementation audit - 2026-07-27

> **Status:** Non-normative engineering audit of the current working tree. The four pre-existing files in `docs/` are authoritative. `REFERENCE/` was used only as a supporting calculation oracle and does not override `docs/`.

## 1. Executive summary

Floreat has a recognizable three-workspace architecture, broad automated test coverage, consistent job ownership checks, shared Zod contracts, pure calculation modules, generated API documentation, and a functional signed-out runtime. It is not ready for reliable feature expansion or production quotation use without first repairing its calculation trust boundary and migration safety.

The highest-risk issue is that quantity data described as server-authoritative is merged in the wrong order, so client fields override server calculations. Persisted amount and quantity rows are not invalidated or recomputed when upstream job inputs or global rates change, while nominal `GET` handlers create rows as a side effect. Formula inputs that use positional records are loaded without deterministic ordering. Together, these behaviors can produce authoritative-looking but stale or non-deterministic quotations.

The global rate master is shared by every job and every user, yet any authenticated user can create, update, or delete it. Because amount calculation reads the complete global rate table, one user's edit changes pricing for all users. The latest migration also deliberately drops and recreates `StairItem.code`, losing existing codes; an earlier migration does the same to mezzanine extension codes. These are production data-integrity risks.

| Area | Score | Principal deductions |
|---|---:|---|
| Overall architecture | **5.5/10** | Sound workspace/layering shape, but calculation authority, global pricing authorization, and migration safety are unresolved. |
| Frontend | **5.5/10** | Strong wizard coverage and tests; build/typecheck fail, lint has 48 errors, hydration hides errors, and quantity payloads are extensively untyped. |
| Backend | **6.0/10** | Ownership, middleware, validation, and tests are broad; global rate writes, read-side writes, stale derived rows, catch-all error mapping, and missing transactions reduce confidence. |
| Shared package | **6.5/10** | Central contracts/calculators and 99 passing tests; workbook parity is not demonstrated and quantity interfaces are bypassed with `any`. |
| Documentation compliance | **5.0/10** | Standards are detailed and OpenAPI generation passes; required design assets and equation attachment are absent, OpenAPI documents only the dev bypass, and deployment guidance is intentionally insecure. |
| Maintainability | **5.5/10** | Repeated resource patterns are understandable but highly duplicated; mixed lockfiles, scratch artifacts, very wide flat models, and lint debt raise change cost. |
| Scalability | **4.5/10** | Stateless API and pagination help; global mutable rates, full relation hydration, repeated whole-job calculation reads, 99 operations, and flat 253-ish-column amount/quantity storage constrain growth. |

Rubric: 9-10 strong compliance; 7-8.5 limited gaps; 5-6.5 material inconsistency; 3-4.5 substantial architectural risk; 0-2.5 unsafe or fundamentally incomplete.

## 2. Audit scope and method

### Snapshot

| Item | Audited value |
|---|---|
| Commit | `08381fc9c971fba6825d00a4d986abe403bbbad7` |
| Branch | `feature/amount` |
| Working tree | Dirty: 2 tracked deletions, 7 tracked modifications, and untracked `.claude/settings.local.json` |
| Material dirty files | `backend/services/amount*.ts`, `frontend/.../WizardActionBar.tsx`, `AmountTable.tsx`, `frontend/src/lib/amount-payload.ts`, its test, and `shared/src/schemas/amount.schema.ts` |
| Inventory | 633 tracked files; 596 audited source/document/schema/migration files; about 69,921 lines |
| Database | 30 Prisma models, 39 enums, 37 chronological migrations |
| Runtime | Node `24.15.0`, npm `11.18.0`, TypeScript `6.0.3`, Prisma CLI `7.8.0` |

Included: all first-party frontend, backend, and shared source; tests; scripts; Prisma schema/models/migrations; README/deployment material; generated OpenAPI/Postman artifacts; and `REFERENCE/`. Excluded: dependencies, generated Prisma client, coverage, and build output. No configured database mutation or migration replay was performed.

### Authority and limitations

1. Normative sources: `docs/backend-standards.md`, `docs/frontend-standards.md`, `docs/DESIGN.md`, and `docs/AMOUNT_QUANTITY_IMPLEMENTATION_PROMPT.md`.
2. Supporting sources: `REFERENCE/amount.md`, the quantity JSON/Markdown files, generated OpenAPI/Postman files, README files, and deployment scripts.
3. `docs/DESIGN.md:10` delegates final authority to `docs/assets/app.css` and `docs/assets/app.js`; neither exists. Design-token parity is therefore unverifiable.
4. `docs/AMOUNT_QUANTITY_IMPLEMENTATION_PROMPT.md:3-5` requires `AMOUNT_N5_N40_schema_fields.md`; that attachment is absent. `REFERENCE/amount.md` appears related but cannot silently replace it.
5. No original Excel workbook is present. Calculation parity can be assessed against code tests and reference transcriptions, not independently against Excel.
6. The in-app browser was requested for local inspection, but no browser backend was available (`agent.browsers.list()` returned empty). Desktop/mobile screenshots, console logs, and browser network capture are therefore unverified.
7. No authenticated runtime navigation was performed. This avoided user-data exposure and, critically, avoided `GET` endpoints that write to the database.

## 3. Critical findings

### C-01 - Quantity and amount results are not reliably server-authoritative

**Impact:** A client can override calculated quantity fields; saved values can remain stale after roof/mezzanine/stair/canopy/accessory/joint/rate changes; and indexed formula inputs may resolve different records across reads. This creates a material risk of incorrect quotation totals.

**Evidence:**

- The standards require the backend to recompute trusted values (`docs/frontend-standards.md:27-30`, `docs/backend-standards.md:45-49`).
- Full quantity upsert merges `{ ...computedSection, ...clientSection }`, so client data wins (`backend/services/quantity.service.ts:52-57`). All seven section services repeat `{ ...computed?.section, ...data }` (`backend/services/quantity-peb-roof.service.ts:6-9` and peers).
- Amount `POST` correctly lets computed data win (`backend/services/amount.service.ts:10-16`), but `PUT` writes the validated client payload directly with no recomputation (`backend/services/amount.service.ts:47-52`).
- Existing amount reads return the stored row without recomputation (`backend/services/amount.service.ts:32-34`). Existing quantity reads do the same (`backend/services/quantity.service.ts:75-76`). Upstream domain writes do not invalidate/recompute either table; only roof-to-accessories derivation is wired (`backend/services/roof.service.ts:42,109`).
- Amount and quantity helpers include `floors`, `extensions`, `stairs`, and `canopies` without `orderBy` (`backend/services/amount-calc.helper.ts:27-30`, `backend/services/quantity-calc.helper.ts:36-39`), while the authoritative prompt says `[0]`/`[1]` must be deterministic (`docs/AMOUNT_QUANTITY_IMPLEMENTATION_PROMPT.md:48-51,182-183`).
- `MezzanineFloorExtension.code` lacks a uniqueness constraint (`backend/prisma/models/mezzanine.prisma:105-134`), weakening keyed lookup as well.

**Root cause:** Calculated persistence is spread across 17 services and treated as a merge convenience rather than a single invariant. There is no dependency/version model for derived snapshots.

**Recommendation:** Create one transactional quotation-calculation application service. Accept only documented manual-override fields; strip all derived fields from request schemas; deterministically order/key child relations; compute quantity then amount from one snapshot; persist both with an input/rate version or recompute on demand. Make every upstream write either invalidate derived snapshots or recompute them in the same transaction.

### C-02 - Any authenticated user can mutate global pricing for every quotation

**Impact:** A normal user can change or delete rate master rows used by all users, affecting future authoritative amounts globally. This is an authorization failure at a financial trust boundary.

**Evidence:** `Rate` has no owner or tenant relation (`backend/prisma/models/rate.prisma:8-30`). All rate writes use only `authMiddleware` (`backend/routes/rate.routes.ts:13-22`), and the route itself notes the missing role gate (`backend/routes/rate.routes.ts:6-9`). Amount calculation performs an unscoped `prisma.rate.findMany()` (`backend/services/amount-calc.helper.ts:52`). Step 10 exposes per-row edit/save controls for the shared table (`frontend/src/components/quotation/sections/rate/RateTable.tsx:56-75`).

**Root cause:** Rate was modeled as global reference data without defining who administers it or whether quotes need immutable/versioned pricing.

**Recommendation:** Choose and enforce a pricing ownership model. At minimum, add an admin/role authorization middleware to rate writes and make ordinary users read-only. Prefer tenant-scoped, versioned rate books and snapshot the selected rate/version into each quote so later master edits cannot silently change historical results. Add authorization integration tests.

### C-03 - The migration chain contains explicit data-loss operations

**Impact:** Deploying the current migration chain to a database with existing stair/mezzanine records erases identifier data used by hydration and positional/keyed calculations.

**Evidence:** `20260727071231_add_code_field_in_mezz/migration.sql:1-14` warns that it drops and recreates `StairItem.code`; no data backfill is performed. `20260723093604_rename_floor_to_code_in_mezzanine_extension/migration.sql:1-12` drops `MezzanineFloorExtension.floor` and adds an empty `code`. The current models keep these codes nullable (`backend/prisma/models/stair.prisma:72`, `backend/prisma/models/mezzanine.prisma:110`), so deployment succeeds while silently losing meaning.

**Root cause:** Prisma-generated destructive enum conversions were committed without expand/backfill/contract migration steps or production-data rehearsal.

**Recommendation:** Replace each destructive migration before deployment: add the new enum column, map existing string values with explicit SQL, verify unmapped rows, add constraints/indexes, then drop the old column in a later release. Test the full chain against a disposable PostgreSQL snapshot with representative data. Do not rewrite migrations already applied to shared environments; issue corrective migrations there.

## 4. Major findings

### M-01 - `GET` requests perform database writes

Amount and all seven quantity-section `getByJobId` services provision missing rows with `upsert` (`backend/services/amount.service.ts:31-43`; `backend/services/quantity-peb-roof.service.ts:19-33` and six peers). The full quantity `GET` also provisions data (`backend/services/quantity.service.ts:74-86`). This violates safe/idempotent HTTP semantics, complicates caching/retries, creates rows during read-only inspection, and was the reason authenticated runtime coverage was intentionally skipped. Return an ephemeral computed representation from `GET`; persist only through an explicit command.

### M-02 - Production build and typecheck are currently blocked

Root build and root typecheck both fail at `frontend/src/components/quotation/WizardActionBar.tsx:70` because `ratesPage` is declared but unused. The same file is part of the dirty working tree. CI/deployment cannot pass in this state. Remove or use the query and add root build/typecheck as required PR gates.

### M-03 - Frontend lint has systemic debt

`npm run lint --workspace frontend` reports 48 errors and one warning. Root categories are: 31+ explicit `any`/unused-field issues in `frontend/src/lib/quantity-payload.ts`; synchronous state update in an effect (`TextListField.tsx:38`); missing effect dependency (`QuantityTableSection.tsx:70`); Fast Refresh mixed exports in UI/shared modules; and the unused rate query. This directly violates `docs/frontend-standards.md:251-258`. Split non-components from component files, replace `any` with schema-derived section types, and make lint blocking.

### M-04 - Workbook parity and the prompt's definition of done are not demonstrated

All 36 `qtyN5..qtyN40` functions exist (`shared/src/calc/amount.calc.ts:251-778`) and shared tests pass, but the tests mostly use synthetic partial inputs and assertions such as `toBeGreaterThan(0)` rather than one workbook computed oracle per function (`shared/tests/calc/amount.calc.test.ts:42-380`). The prompt requires 36 sample-oracle tests within `1e-6` (`docs/AMOUNT_QUANTITY_IMPLEMENTATION_PROMPT.md:132-142,192-197`). Missing attachments and workbook make actual parity **unverifiable**, not failed. Restore the attachment/workbook-derived fixture, preserve the N14 quirk explicitly, and add a named oracle test for every line.

### M-05 - Cross-resource writes are not transactional

Roof upsert/update commits the roof and then separately recomputes accessories (`backend/services/roof.service.ts:25-44,105-111`). A second-operation failure leaves a committed roof with stale accessories. Similar derived quantity/amount invalidation is absent entirely. Put source write plus dependent derivation/invalidation in a Prisma transaction or use a durable recalculation job with explicit stale status.

### M-06 - Controller error mapping hides operational failures as 404

Multiple update controllers use bare `catch { return 404 }`, for example `backend/controllers/roof.controller.ts:38-45` and `quantity-peb-roof.controller.ts:27-34`. Database outages, serialization errors, or calculation exceptions will be mislabeled as missing data, defeating monitoring and clients. Inspect only `P2025` (and known domain errors), otherwise rethrow to the centralized error handler. Validation bodies are also hand-rolled instead of consistently using the response helper, contrary to `docs/backend-standards.md:172-176,350-356`.

### M-07 - API authentication documentation describes only the dev bypass

Generated OpenAPI covers all 99 registered operations and `docs:check` passes, but its only security scheme is `LocalDevUserId` / `x-dev-user-id` (`backend/docs/openapi.ts:91-96,428`). It does not describe Clerk bearer authentication used in production. The Postman pre-request script injects the bypass header (`backend/docs/floreat-api.postman_collection.json:5225-5227`). Add a bearer/JWT scheme as the primary security contract and clearly label the dev header as an opt-in local alternative.

### M-08 - Error/loading behavior is incomplete for hydration and list pages

Most step hydration hooks return `void` and silently do nothing when a query fails; only Rate exposes `isLoading/isError` (`frontend/src/hooks/useRateHydration.ts:6-28`). `SavedDrafts` reads `isLoading` but not `isError` (`frontend/src/pages/SavedDrafts.tsx:22,63-79`). Users can edit defaults after failed hydration and overwrite existing server data. Standardize a hydration state contract, block saves until load resolves, and provide retry/error UI.

### M-09 - Deployment guidance is unsafe for production and dependency installs are non-reproducible

README explicitly deploys Clerk test keys and plain HTTP (`README.md:9-13`) and recommends `npm install` (`README.md:755-759`); `scripts/deploy.sh:43-46` repeats it. The repository contains root and workspace npm lockfiles plus root/shared pnpm lockfiles, making the authoritative dependency graph ambiguous. Use one package manager and one workspace lockfile with `npm ci` (or equivalent). Split the current guide into explicitly local/staging guidance and a production guide requiring TLS, live Clerk keys, backups, secret management, and rollback.

### M-10 - Storage shape is very wide and duplicates derived data

`Amount` stores seven numeric fields for each of 36 items in a roughly 296-line flat model (`backend/prisma/models/amount.prisma:1-296`); quantity is seven similarly wide optional one-to-one tables (`backend/prisma/models/quantity.prisma:3-259`). This preserves spreadsheet naming but causes schema/migration churn, misspellings such as `Errection`, large payloads, duplicated rate snapshots without explicit versioning, and difficult generic reporting. Introduce normalized line items keyed by a stable code with quantity, unit, rates, amounts, source/manual flags, and calculation version. Preserve external compatibility with mapping DTOs during migration.

## 5. Minor findings

| ID | Finding and evidence | Recommendation |
|---|---|---|
| m-01 | `docs/DESIGN.md:10` cites missing `docs/assets/app.css` and `app.js`. | Restore assets or make the implemented token file (`frontend/src/index.css`) normative. |
| m-02 | Backend standards still claim some DELETE handlers return 200 (`docs/backend-standards.md:591-595`), but audited handlers return 204. | Mark the known deviation resolved. |
| m-03 | Both `/api/all/:jobId` and `/api/jobs/:jobId/all` are registered/documented (`backend/routes/job.routes.ts:17-18`). | Deprecate the legacy alias and keep the canonical nested route. |
| m-04 | Checked-in scratch/extraction artifacts include `scratch.cjs`, `backend/scratch/*`, `frontend/parsed.json`, `extracted_rows.txt`, and `sections_parsed.json`. | Move maintained tooling under `scripts/` with documentation; remove generated scratch artifacts. |
| m-05 | `frontend/src/lib/api.ts:1` does not validate `VITE_API_URL`, while the frontend standard requires it (`docs/frontend-standards.md:260-269`) and `.env.example` intentionally permits empty same-origin URLs. | Amend the standard to allow empty same-origin base URLs and validate only type/shape. |
| m-06 | The Vite alias points `@floreat/shared` directly to source (`frontend/vite.config.ts:13`), while standards say Vite resolves compiled `dist` (`docs/frontend-standards.md:32-35`). | Document source aliasing as the dev/build policy or use package exports consistently. |
| m-07 | Quantity/amount/rate/stair frontend API modules have little or no direct API-hook coverage; existing API tests are concentrated in jobs/roof/spec and a few resources. | Add a parameterized contract suite for all resource modules and invalidation keys. |
| m-08 | `getJobWithAllData` eagerly includes every relation (`backend/services/job.service.ts:36-62`). | Keep for draft hydration but add selective endpoints/fields or conditional includes as payloads grow. |
| m-09 | Global rate rows are ordered by `createdAt`, while the UI restores a default order by item-name merging. | Give rate items stable codes and explicit display order. |
| m-10 | `BYPASS_AUTH` is not present in `backend/.env.example`, though standards and README discuss it. | Document it as local-only with a fail-fast production guard in configuration. |

## 6. Compliance matrix

Status meanings: **C** compliant, **P** partial, **V** violated, **O** outdated documentation, **U** unverifiable.

| Requirement | Status | Evidence / assessment |
|---|:---:|---|
| npm workspaces and shared package by name | C | Root workspaces; application imports use `@floreat/shared/*`. |
| Shared owns cross-app schemas/enums/calculations | P | Shared barrels are complete, but quantity persistence bypasses types with repeated `as any`; frontend keeps substantial payload shaping. |
| Backend-authoritative calculations | V | C-01: client-overridable quantity merge, direct amount PUT, stale snapshots. |
| Backend route -> controller -> service -> Prisma layers | P | Generally consistent; `jobOwnership` middleware directly accesses Prisma by design (`backend/middlewares/job-ownership.ts:16-22`). |
| Nested REST and ownership middleware | C | Job-scoped routes use `owned = { preHandler: [authMiddleware, jobOwnership] }`; collection services filter by related `userId`. |
| Standard error response and precise mapping | V | Hand-rolled validation errors and catch-all 404 mapping. |
| Prisma singleton | C | `backend/lib/prisma.ts`; no second application client found. |
| Transactions for multi-write invariants | V | Roof and accessories are separate operations; calculation snapshot invalidation absent. |
| Pagination and deterministic ordering | P | Collections paginate/order; formula child arrays do not order. |
| Frontend API canonical roof pattern | P | Query factories and hooks are broadly repeated; coverage/JSDoc/typing varies and amount/quantity paths lag. |
| Detail hooks guard empty IDs | C | Audited query hooks use `enabled: !!jobId`/`!!id`. |
| Mutation invalidates detail + lists | P | Common pattern exists, but derived cross-resource dependencies (amount/quantity after source/rate changes) are not invalidated. |
| Zustand selectors and user-scoped persistence | C | Store uses selectors and user-namespaced manual hydration; `partialize` excludes server amount/quantity. |
| Loading/error/save visibility | P | Save status and rate states exist; most hydration errors are silent. |
| TypeScript no `any` | V | Lint reports extensive `any`; backend quantity services also cast nested Prisma writes. |
| Tailwind/tokens/lucide/accessibility basics | P | Token utilities, Lucide, labels, aria-live, and responsive classes are present; authoritative design assets and visual QA are unavailable. |
| Required focus/responsive design parity | U | Static code is promising; browser backend unavailable and canonical assets missing. |
| Tests mirror behavior | P | 1,076 passing tests; workbook oracle, real-DB migration, rate authorization, GET purity, and most newer frontend API modules are uncovered. |
| Amount prompt: 36 functions | C | `qtyN5..qtyN40` all exist. |
| Amount prompt: 36 workbook oracle tests | V | Synthetic tests do not meet the stated definition of done. |
| Amount prompt: deterministic indexed relations | V | No `orderBy` on included child collections. |
| Amount prompt: independent Excel parity | U | Workbook and required attachment absent. |
| Design source of truth | U | Referenced canonical assets absent. |

## 7. End-to-end domain coverage

The repeated canonical flow is: Step component/form -> `useQuotationStore` draft -> shared or stricter form schema -> `WizardActionBar` payload builder -> React Query mutation and `apiFetch` -> job-scoped route -> auth/ownership -> controller validation -> service -> Prisma -> query invalidation -> step hydration -> Zustand.

| Domain | Frontend/store/schema/API | Backend/data | Calculation and principal deviation |
|---|---|---|---|
| Project/job | Step 1; persisted store; stricter job form; jobs API | Auth + `syncUser` on create; owner-scoped service | Foundation for all domains. Aggregated hydration exists, but wizard steps still issue separate reads. |
| Roof | Step 2; rich validation/sections; roof hydration | Nested CRUD; `Roof` + `Sidewall` replace-all | Shared roof/accessory derivations; recompute accessories is non-transactional. |
| Mezzanine | Step 3; floor/extension arrays | Nested CRUD; parent + floors/extensions | Used positionally in amount/quantity; extension code is not unique and was destructively migrated. |
| Stair | Step 4; items/deductions | Nested CRUD; parent + items/deductions | Used positionally; latest migration drops item codes. |
| Canopy | Step 5; item array | Nested CRUD; parent + items | Used positionally without ordered relation load. |
| Accessories | Step 6; flattened feature sections | One wide `Accessories` model | Some quantities are server-derived with manual flags; cross-domain refresh is only wired from roof. |
| Load | Step 7 | Nested one-to-one CRUD | No amount/quantity formula integration found; otherwise conventional. |
| Joint | Step 8; diagram + keyed bolt tables | Parent + three keyed child tables | Shared joint calc; N14 intentionally preserves documented Excel quirk. |
| Specification | Step 9; products | Parent + keyed products | No price calculation linkage; hydration and CRUD follow common pattern. |
| Rates | Step 10; local row editing; not job store | Global `Rate` CRUD | Shared breakdown calc; any user can mutate global rates (C-02). |
| Amount | Step 11; store hydration/table; wizard submits `{}` | Flat `Amount`; helper reads full job + all rates | 36 functions exist; stale/direct PUT/non-deterministic issues in C-01; `GET` writes. |
| Quantity root | Step 12; store + local drafts; full payload | `Quantity` parent + seven one-to-one sections | Server computes but client wins merge; repeated whole-job calculation; `GET` writes. |
| Quantity PEB roof | Table subsection + dedicated API | `QuantityPebRoof` | Shared `peb.calc`; extensively flattened and untyped payload boundary. |
| Quantity cladding | Table subsection + dedicated API | `QuantityCladding` | Shared `cladding.calc`; reference artifacts exist but no workbook proof. |
| Quantity canopy | Table subsection + dedicated API | `QuantityCanopy` | Shared `canopy.calc`; positional canopy ordering risk. |
| Quantity accessories | Table subsection + dedicated API | `QuantityAccessories` | Shared calc; manual/derived distinction is not encoded strongly in API schema. |
| Quantity mezzanine | Table subsection + dedicated API | `QuantityMezzanine` | Shared calc; positional/key migration risks. |
| Quantity stair | Table subsection + dedicated API | `QuantityStair` | Shared calc; positional/key migration risks. |
| Quantity additional bolts | Table subsection + dedicated API | `QuantityAdditionalBolts` | Shared calc; dedicated API has no direct frontend API tests. |

## 8. API reconciliation

The route registry and generated OpenAPI agree on 42 paths and 99 operations; `npm run docs:check` passes. Every non-health operation declares a generated security requirement. Frontend callers use the job-nested endpoints for quotation resources and top-level `/api/rates` for the global rate master. No unmatched frontend endpoint was proven.

| API group | Registered pattern | Frontend caller | Auth/ownership | Tests/docs | Assessment |
|---|---|---|---|---|---|
| Health | `GET /api/health` | Runtime/ops | Public | Integration + OpenAPI | C |
| User | `GET /api/me` | Login | Auth + sync | Integration + OpenAPI | C |
| Jobs | `/api/jobs`, `/:id`, two all-data paths | Yes | Owner-scoped in service | Strong | P: duplicate all-data alias |
| Roof/mezz/stair/canopy/load/accessories/joint/spec | Four nested methods + top-level list | Yes | Nested ownership; list relation filter | Broad backend; uneven frontend | C/P |
| Rates | Five top-level methods | Yes | Authentication only | Backend tests; no frontend API tests | V: missing authorization |
| Quantity root | Four nested + list | Yes | Ownership | Backend + frontend root tests | V: client override and GET write |
| Seven quantity sections | Four nested each + list each | Yes | Ownership | Backend integration; no direct frontend API tests | V/P |
| Amount | Four nested + list | Yes | Ownership | Backend; no direct frontend API tests | V: stale/direct PUT/GET write |

Response conventions are mostly 200 upsert, 201 top-level create, 204 delete, 400 validation, 401 auth, and 404 missing/hidden ownership. The docs' DELETE known deviation is outdated. OpenAPI schema shape coverage is broad but authentication modeling is development-only (M-07).

## 9. Calculation parity

| Calculator | Shared implementation/tests | Server integration | Reference parity status |
|---|---|---|---|
| Roof derivation | `roof.calc.ts`; passing tests | Recomputed on roof writes | Proven against code tests only |
| Accessories | `accessories.calc.ts`; passing tests | Recomputed on accessory and roof writes | Supporting reference exists; workbook absent |
| Joint | `joint.calc.ts`; passing tests | Used through persisted joint inputs | Code-tested; workbook absent |
| Rate | `rate.calc.ts`; passing tests | Derived breakdown stored on rate writes | Formula behavior code-tested; authorization unsafe |
| Amount N5-N40 | 36 functions; passing synthetic tests | `computeJobAmount` on amount POST/first GET | **Unverifiable Excel parity**; required 36-oracle suite absent |
| Quantity PEB | Pure shared calc; passing tests | `computeJobQuantities` | Supporting JSON/Markdown only; client override breaks authority |
| Quantity cladding | Pure shared calc; passing tests | Same | Supporting reference only |
| Quantity canopy/accessories/mezz/stair/bolts | Pure shared calcs; passing tests | Same | Code-tested; workbook/original oracle absent |

Nulls generally coerce to zero and denominator guards are present in amount calc, matching the prompt. Decimal values are converted with `Number` before pure calculations. Persisted database precision is `Decimal(10,3)`, but JavaScript calculation and response payload construction use binary numbers and do not establish a single rounding boundary. Manual overrides are present in accessory/quantity fields, but schema naming rather than an explicit discriminated model controls them. Rate application maps stable descriptions to global item strings; missing or renamed rate rows become zero rates, which should be surfaced as validation errors rather than silent zero-price lines.

## 10. Database and migration assessment

The current Prisma schema validates. One-to-one job domains use unique `jobId`; child rows generally cascade on parent deletion; collection child keys use composite uniqueness where codes exist; list queries have useful user/time indexes. These are sound foundations.

Material issues:

1. Destructive code conversions are covered in C-03. Static review also found many generated type-change warnings; these need data-range/cast rehearsal even where PostgreSQL can cast automatically.
2. `MezzanineFloorExtension` has only `@@index([mezzanineId])`, not `@@unique([mezzanineId, code])`, unlike floors, stairs, canopy items, joint rows, and spec products.
3. Nullable coded children permit multiple `NULL` rows by design. That is reasonable for drafts but unsafe as a calculation input unless save validation rejects uncoded rows.
4. Amount/quantity derived snapshots have no `calculationVersion`, `sourceUpdatedAt`, `rateBookId`, or stale flag.
5. `Rate.item` is a mutable human string used as an identity/mapping key. Use an immutable code.
6. No migration was replayed, per safety constraint. `prisma validate` proves current schema syntax, not chronological deployability or data preservation.

Before deployment, create an isolated PostgreSQL migration rehearsal that: applies all 37 migrations from empty; loads representative pre-conversion records before destructive steps; continues the chain; compares the final database to the Prisma schema; and asserts keyed values, counts, FKs, uniqueness, nullability, defaults, and decimal values.

## 11. Runtime and verification results

| Check | Result |
|---|---|
| Root build | **FAIL** - unused `ratesPage` in `WizardActionBar.tsx:70` |
| Root workspace typecheck | **FAIL** - same TypeScript error |
| Shared tests | **PASS** - 12 files, 99 tests |
| Backend tests | **PASS** - 41 files, 359 tests |
| Frontend tests | **PASS** - 109 files, 618 tests |
| Complete total | **PASS** - 162 files, 1,076 tests (root command timed out only after shared/backend passed; frontend rerun passed independently) |
| Frontend lint | **FAIL** - 48 errors, 1 warning |
| Backend docs check | **PASS** - current, 99 operations |
| Prisma validate | **PASS** - multi-file schema valid |
| Migration replay | **NOT RUN** - remote/configured database protected; static chain review only |

Read-only local runtime on backend `3100` and Vite `5173`:

- `GET /api/health`: 200, `{"status":"ok","db":"up"}`.
- Helmet headers present, including CSP, HSTS, `nosniff`, frame, referrer, and cross-origin policies.
- `GET /api/jobs` without authentication: 401 `{"error":"Unauthorized"}`.
- Allowed origin `http://localhost:5173`: exact `Access-Control-Allow-Origin` plus credentials.
- Unlisted `https://evil.example`: no allow-origin header (credentials header alone does not grant browser access).
- Swagger UI `/docs/`: 200 in development.
- Frontend root: 200 HTML and Vite startup successful.
- Signed-out routing, responsive layout, browser console, and browser failed-request inspection: **not verified**, because no in-app browser instance was available.
- Authenticated navigation: **not performed**; no existing session could be inspected and quotation `GET`s may write.

## 12. Documentation mismatch register

| Documented claim | Implementation/evidence | Status |
|---|---|---|
| Design assets are canonical (`DESIGN.md:10`) | Assets absent | U/outdated |
| Vite consumes shared compiled exports | Vite aliases shared source | Outdated |
| `VITE_API_URL` must be present | Empty is intentional for same-origin and `api.ts` permits it | Conflict between standard and deployment docs |
| Existing DELETE handlers return 200 | Audited handlers return 204 | Outdated known deviation |
| Calculations are backend-authoritative | Quantity client payload overrides computed values; amount PUT bypasses compute | Violated |
| Amount prompt attachments are supplied | Required equation attachment absent | Incomplete |
| One workbook oracle test per N5-N40 | Synthetic tests, several positivity assertions | Violated definition of done |
| Deterministic ordering for indexed relations | No `orderBy` in calculation relation loads | Violated |
| OpenAPI describes authenticated API | Only dev bypass header is modeled | Partial |
| README is deployment guidance | Explicitly test Clerk keys and no TLS | Phase-limited, unsafe as production guidance |
| One npm workspace install/lock | Multiple npm and pnpm lockfiles checked in | Inconsistent |
| No `any` in frontend | Lint finds extensive quantity payload `any` | Violated |

## 13. Prioritized remediation

1. **Stop financial/data-integrity exposure:** role-gate rate writes; disable or remove destructive migrations from undeployed chains; issue corrective expand/backfill migrations for applied environments.
2. **Rebuild the calculation boundary:** derived-only request schemas, deterministic relation loading, one transactional compute service, explicit manual overrides, rate version snapshots, stale/version metadata, and no writes on `GET`.
3. **Prove calculation correctness:** restore the missing equation attachment and original workbook-derived fixture; add 36 exact N5-N40 oracle tests plus quantity workbook fixtures, ordering/null/zero/rounding tests, and server integration tests that malicious derived inputs cannot win.
4. **Restore release gates:** fix the unused query, clear lint errors, require build/typecheck/lint/docs/test/Prisma validate in CI, and add migration rehearsal against disposable PostgreSQL.
5. **Harden API behavior:** precise domain/Prisma error mapping, production bearer scheme in OpenAPI, remove the legacy all-data alias, and standardize hydration error/retry states.
6. **Reduce structural debt:** normalize amount line items and quantity sections behind compatibility DTOs, eliminate repeated services/API modules with established generic factories only where behavior is truly identical, and add calculation/rate versioning.
7. **Repair repository/documentation hygiene:** select one lockfile/package manager, remove scratch/extraction artifacts, restore or supersede design assets, update known deviations, and publish production-safe deployment guidance.

## Remediation status - 2026-07-28

This section supersedes the implementation and verification claims in sections 8-14 where they describe the pre-remediation code. The original findings remain useful as the audit baseline.

### Completed

- Amount and quantity `GET` handlers are read-only; they no longer create or recalculate database rows.
- Amount and quantity writes calculate from canonical job data. Client-provided derived quantities, rates, and amounts cannot replace server calculations.
- Calculation relation loads use deterministic ordering and stable keyed lookups where the equations require indexed records.
- Missing required amount rates now fail clearly instead of silently producing zero-rate lines.
- Amount and quantity rows now expose `calculationVersion`, `sourceUpdatedAt`, `rateVersion`, and `isStale` provenance fields.
- Stair and mezzanine migrations preserve existing identifiers/data and add coded-child uniqueness where supported.
- The legacy `/api/all/:jobId` route was removed. OpenAPI and Postman artifacts were regenerated and checked.
- API authentication documentation now describes Clerk bearer tokens and labels `BYPASS_AUTH` as local development only. Production startup rejects the bypass flag.
- Frontend quantity payloads use schema-derived types. The frontend lint, hook dependency, effect, Fast Refresh, and unused-value issues found in the audit were corrected.
- Hydration/save behavior and related frontend API invalidation contracts were updated, and stale integration expectations were brought in line with server-authoritative behavior.
- Repository hygiene was improved by retaining npm as the package manager, removing the duplicate pnpm lockfile, and removing scratch/diagnostic artifacts.

### Deferred or not yet implemented

These are intentionally not claimed as complete:

1. **Clerk/admin authorization for rate mutations is deferred.** Authenticated users can still mutate the global rate master. Add role/organization authorization before production use.
2. **Official workbook parity is still pending.** The original workbook and equation attachment were unavailable. Current calculator fixtures are provisional and based on checked-in reference equations; replace them with the official workbook oracle, including the documented N14 quirk, when supplied.
3. **Disposable PostgreSQL migration rehearsal was not run.** `prisma validate` passes, but the complete migration chain still needs to be replayed against representative legacy data and checked for preservation, constraints, and decimal values.
4. **Source-change invalidation is incomplete.** The provenance columns exist, but all upstream roof/mezzanine/stair/canopy/accessory/joint/rate writes do not yet atomically recompute or mark dependent amount/quantity rows stale. This must be completed before treating stored quotations as continuously current.
5. **The calculation write path is not fully transactional.** Source snapshot reads, rate reads, calculation, and derived-row persistence are not yet one Prisma transaction with a consistent source/rate snapshot.
6. **Storage normalization is incomplete.** Amounts remain a compatibility flat model. Stable line-item codes, explicit units/order, manual/source flags, immutable rate codes, and a real rate-book/version snapshot still need a normalized persistence model and DTO migration.
7. **CI and production deployment gates are not fully added.** The checks pass locally, but CI still needs enforced build, typecheck, lint, tests, docs, Prisma validation, and migration-rehearsal jobs, along with separate production TLS/secrets/backup/rollback guidance.

### Current verification

| Check | Result |
|---|---|
| Shared tests | PASS - 99 tests |
| Backend tests | PASS - 357 tests |
| Frontend tests | PASS - 618 tests |
| Frontend lint | PASS |
| Workspace typecheck | PASS |
| Production build | PASS |
| OpenAPI documentation check | PASS - 98 operations |
| Prisma validation | PASS |
| Migration rehearsal | NOT RUN |
| Official workbook parity | PENDING |

The application is materially safer than the baseline audit state, but rate authorization, authoritative freshness after source changes, transactional snapshotting, official calculation parity, migration rehearsal, and CI enforcement remain release-blocking follow-up work.

## 14. Final assessment

The assessment below records the pre-remediation baseline. For the current implementation status and remaining release blockers, see the remediation status section above.

Architectural fidelity is mixed: the repository follows the intended workspace, route/controller/service, shared-schema, React Query, Zustand, and design-token direction, but the most important invariant - server-authoritative, reproducible quotation math - is not currently enforced end to end. Scalability is acceptable for a small internal tool but not for multi-tenant financial workflows because pricing is global and mutable, derived snapshots have no provenance, and the flat schema/API surface is expanding rapidly.

Developer onboarding is helped by strong standards and tests but hindered by contradictory/missing sources, generated/scratch artifacts, mixed package-manager state, and a red default build. Technical debt is **material and concentrated in core quotation correctness**, not merely cosmetic. Complete remediation items 1-4 before adding quotation features; otherwise new features will compound an untrusted calculation and migration foundation.
