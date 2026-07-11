# Frontend Rules

> Prescriptive standards for AI agents generating code in this project.

## 0. Workspace & `@floreat/shared`

Floreat is a single **npm workspaces** monorepo (root `package.json` →
`"workspaces": ["shared", "backend", "frontend"]`). The frontend consumes the
local **`@floreat/shared`** package **by name** through subpath exports — never
by relative path:

| Import | Contents |
|--------|----------|
| `@floreat/shared/schemas` | Zod 4 request contracts + enums (one module per resource) + shared `paginationSchema`. |
| `@floreat/shared/calc`    | Pure business-math / equation functions (reused for **preview only** — see below). |
| `@floreat/shared/types`   | Wire-format primitives (`DecimalString`, `Nullable<T>`). |
| `@floreat/shared/units`   | Decimal-string / unit coercion helpers (`num`, `int`). |

Rules:

- **Schemas, enums, and shared types have one home: `shared`.** `src/schemas/{resource}.schema.ts`
  is a thin re-export of the shared contract. **Exceptions:** `roof` and `job` keep a
  *stricter* **form** schema in `src/schemas/` (all fields required for the Step form,
  plus `isRequired`/`getFieldErrors` helpers) — these import their enums from
  `@floreat/shared/schemas` so enums are never redefined. The shared module remains the
  wire contract the server validates.
- **Calculations are backend-authoritative.** The frontend may import a
  `@floreat/shared/calc` function for live preview (e.g. `deriveSideColumnsWidthHeight`
  in the quotation store's `setRoof`), but the server recomputes and persists the value
  from validated inputs — never rely on the client-computed value being trusted.
- **Decimal wire coercion uses `@floreat/shared/units`** (`num`/`int`); the hydrate
  utilities import these rather than redefining them (see §6.5).
- **`shared` builds before the app.** Run `npm run build:shared` (root) after editing
  `shared/src`; the root `dev:frontend`/`build` scripts do this for you. Vite resolves the
  compiled `dist` via the package's `exports` (add `optimizeDeps.include: ['@floreat/shared']`
  only if HMR needs it).

## 1. Tech Stack

- React 19 + TypeScript (ES2023 target)
- Vite 8 (bundler + dev server)
- Tailwind CSS v4 + shadcn/ui (radix-nova style)
- Zustand (client state) + TanStack React Query (server state)
- Clerk (`@clerk/react`) for authentication
- react-router-dom v7 (client-side routing)
- Vitest + React Testing Library (testing)
- lucide-react (icons)

## 2. Directory Structure

```
src/
├── api/{domain}/{resource}/{verbResource}.ts   # API functions + React Query hooks
├── components/
│   ├── ui/                # shadcn/ui primitives — DO NOT edit manually
│   └── {feature}/
│       ├── shared/        # Reusable components within the feature
│       ├── sections/      # Form sections, content blocks
│       └── steps/         # Wizard/multi-step flow components
├── constants/             # Static config, enums, lookup arrays
├── hooks/                 # Custom React hooks (non-store)
├── lib/                   # Core utilities (api.ts, utils.ts)
├── pages/{feature}/       # Thin route-level orchestrators
├── schemas/               # Thin re-exports of @floreat/shared contracts (roof/job add a stricter form schema)
├── stores/                # Zustand stores ({feature}-store.ts)
├── tests/                 # Mirrors src/ structure exactly
└── utils/                 # Pure utility functions
```

## 3. File Naming

| Type | Convention | Example |
|------|-----------|---------|
| React component (.tsx) | PascalCase | `WizardStepper.tsx` |
| Utility / API (.ts) | camelCase | `getJobs.ts`, `postJobs.ts` |
| Store (.ts) | kebab-case | `quotation-store.ts` |
| Test | `{source-name}.test.ts(x)` | `login.test.ts` |

## 4. Component Patterns

- Use **named exports** for all components. Use `export default` only for page components.
- Define props with `interface`, not `type`.
- Use `cn()` from `@/lib/utils` for conditional/merged Tailwind classes.
- Compose with shadcn/ui primitives (`Button`, `Input`, `Label`, etc.).
- Keep components focused and single-purpose.
- Extract repeated helper components (e.g., `Field`, `ErrMsg`) into the feature's `shared/` folder — never duplicate across files.
- Accept a `className?: string` prop on wrapper components for external styling.

```tsx
// ✅ Correct
interface SectionCardProps {
  icon: ReactNode
  title: string
  children: ReactNode
  className?: string
}

export function SectionCard({ icon, title, children, className }: SectionCardProps) {
  return (
    <div className={cn('border border-border rounded-[14px] bg-card p-[22px]', className)}>
      {children}
    </div>
  )
}
```

## 5. State Management (Zustand)

- One store per feature: `src/stores/{feature}-store.ts`.
- Define the state shape with an `interface`.
- Use `persist` middleware when data should survive page refresh (drafts, preferences).
- Export the hook directly: `export const useQuotationStore = create<State>()(...)`.
- Consume with selectors to minimize re-renders: `useQuotationStore((s) => s.currentStep)`.
- Keep actions inside the store (not in components).

## 6. API Layer

The **roof API** (`src/api/quotation/roof/`) is the canonical reference. All current
and future resource APIs must follow this standard exactly.

### 6.1 Structure

- All HTTP calls go through `apiFetch` from `@/lib/api`. `apiFetch` already maps
  `204 No Content` (and empty bodies) to `null` — never parse the body yourself.
- One file per HTTP verb: `src/api/{domain}/{resource}/{verbResource}.ts`
  (`get{Resource}s.ts`, `post{Resource}s.ts`, `put{Resource}s.ts`, `delete{Resource}s.ts`).
- A single centralized **query-key factory** per resource in `queryKeys.ts`.
- Each verb file exports, in this order:
  1. Request/response **interfaces** (and a payload type aliasing the Zod-derived schema input).
  2. A plain **async function** `(token, ...args)` (for direct use and testing).
  3. A **React Query hook** (`useRoofs`, `useRoof`, `useUpsertRoof`, `useUpdateRoof`, `useDeleteRoof`).
- The Clerk token is resolved **inside the hook** via `useAuth().getToken()` and passed
  into the plain async function — never call `getToken()` in the plain function.
- Every exported function, hook, and interface carries a **JSDoc** comment describing
  its endpoint, auth requirement, and any non-obvious behavior.

### 6.2 Query keys

Mandatory factory shape (mirror per resource so invalidation is reliable by prefix):

```ts
export const roofKeys = {
  all: ['roofs'] as const,
  lists: () => [...roofKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...roofKeys.lists(), { page, pageSize }] as const,
  details: () => [...roofKeys.all, 'detail'] as const,
  detail: (id: string) => [...roofKeys.details(), id] as const,
}
```

### 6.3 Read hooks

- Provide a **list hook** keyed by `keys.list(page, pageSize)`.
- Provide a **detail hook** keyed by `keys.detail(id)`. Detail hooks **must** guard with
  `enabled: !!id` so they never fire with an empty path segment.

### 6.4 Mutation invalidation

- **Create** invalidates `keys.lists()` only (a create yields a new server id that no
  detail query is keyed on yet).
- **Update / upsert / delete** invalidate **both** `keys.detail(id)` and `keys.lists()`,
  so listings and any detail view stay in sync.
- The delete hook takes the `id` as its mutation variable and resolves to `void`.

### 6.5 Typing the wire format

Prisma `Decimal` columns serialize to JSON **strings** over HTTP
(`Decimal.prototype.toJSON`). Type numeric-precision response fields as `string` even
when the create/update payload accepts `number`. Document this with a `NOTE:` comment
on the response interface. The `@floreat/shared/types` primitives (`DecimalString`,
`Nullable<T>`) model this boundary, and the `@floreat/shared/units` helpers (`num`, `int`)
coerce it back to numbers in the `hydrate*` utilities.

### 6.6 Canonical example

```ts
// src/api/quotation/roof/deleteRoof.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { roofKeys } from './queryKeys'

/**
 * Deletes the roof for a job via DELETE /api/jobs/:jobId/roof.
 * The backend responds with 204 No Content, so this resolves to `void`.
 * Requires a Clerk session token for authentication.
 */
export async function deleteRoof(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/roof`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's roof. The mutation variable is the
 * `jobId`. On success it invalidates both the roof detail and every paginated
 * roofs list so listings and the roof view stay in sync.
 */
export function useDeleteRoof() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteRoof(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: roofKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: roofKeys.lists() })
    },
  })
}
```

## 7. Routing & Pages

- All routes defined in `App.tsx` inside `<Routes>`.
- Pages are **default-exported**, thin orchestrators that compose feature components.
- Protected routes wrap in `<Show when="signed-in" fallback={<Navigate to="/login" replace />}>`.
- URL pattern: `/{feature}/{action}` (e.g., `/quotations/new`).

## 8. Styling

- Use Tailwind CSS v4 utility classes exclusively. No inline `style` props.
- Use `cn()` for conditional/merged classes.
- Reference shadcn/ui design tokens: `text-foreground`, `bg-card`, `border-border`, `text-muted-foreground`, `bg-primary`, etc.
- Use `@/` path alias for all imports — never relative paths beyond `./` within the same directory.
- Font: Geist Variable (configured in `index.css`).
- Icons from `lucide-react` only. Size with Tailwind classes (`w-4 h-4`).
- Responsive: mobile-first with `md:` breakpoint for grid layouts.

## 9. Testing

- Framework: Vitest + React Testing Library + jsdom.
- Tests live in `src/tests/` mirroring the source structure.
- Setup file: `src/tests/setup.ts` (imports `@testing-library/jest-dom/vitest`, runs `cleanup` after each test).
- Mock Clerk with `vi.mock('@clerk/react')` — use a hoisted `authState` object to control signed-in/signed-out.
- Mock API calls by mocking `@/lib/api` (`vi.mock('@/lib/api')`).
- Use `describe`/`it`/`expect` from vitest. Use `render`/`screen` from RTL.
- Test files: `{name}.test.ts` for logic, `{name}.test.tsx` for components.

```ts
// Pattern for auth-aware component tests
const authState = vi.hoisted(() => ({ signedIn: false }))
vi.mock('@clerk/react', () => ({
  Show: ({ when, fallback, children }) => {
    const pass = when === 'signed-in' ? authState.signedIn : !authState.signedIn
    return <>{pass ? children : fallback}</>
  },
}))
```

## 10. TypeScript

- Target: ES2023. Module: ESNext. JSX: react-jsx.
- `noUnusedLocals: true`, `noUnusedParameters: true`.
- Use `interface` for object shapes. Use `type` for unions/intersections/mapped types.
- Use `import type` for type-only imports.
- Never use `any`. Use `unknown` + type narrowing if needed.
- Export interfaces/types from the file where they're defined (co-locate with usage).

## 11. Environment Variables

- Prefix all client-side vars with `VITE_`.
- Document every var in `.env.example` (key only, no values).
- Access via `import.meta.env.VITE_*`.
- Validate required vars at app startup — throw descriptive errors if missing.

```ts
const API_URL = import.meta.env.VITE_API_URL
if (!API_URL) throw new Error('Missing VITE_API_URL. Set it in your .env file.')
```

## 12. Do's and Don'ts

### Do

- Use the `@/` path alias for all imports.
- Co-locate React Query hooks with their API functions.
- Extract duplicated UI helpers into `shared/`.
- Use selectors when consuming Zustand stores.
- Write tests for API functions and page-level routing.
- Use `cn()` for all conditional class logic.
- Keep pages thin — delegate to feature components.
- Type all function parameters and return values.
- Import request contracts, enums, `calc`, and wire helpers from `@floreat/shared/*` by
  package name (see §0). Run `npm run build:shared` after editing `shared/src`.

### Don't

- Edit files in `components/ui/` manually (use shadcn CLI to update).
- Use inline styles or CSS modules.
- Use `any` or untyped objects.
- Duplicate helper components across files.
- Put business logic in page components.
- Use relative imports that traverse up more than one level (`../../..`).
- Install icon libraries other than lucide-react.
- Create global CSS classes — use Tailwind utilities.
- Redefine a shared schema or enum locally — re-export from `@floreat/shared` (only
  `roof`/`job` keep a stricter *form* schema, and they import their enums from shared).
- Treat a `@floreat/shared/calc` result as authoritative — it is preview only; the
  backend recomputes and persists the value.
