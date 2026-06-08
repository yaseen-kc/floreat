# Frontend Rules

> Prescriptive standards for AI agents generating code in this project.

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

- All HTTP calls go through `apiFetch` from `@/lib/api`.
- One file per endpoint: `src/api/{domain}/{resource}/{verbResource}.ts`.
- Each file exports:
  1. Request/response **interfaces**.
  2. A plain **async function** (for direct use and testing).
  3. A **React Query hook** (`useCreateJob`, `useGetJobs`, etc.).
- Pass the Clerk token via `useAuth().getToken()` inside the hook.

```ts
// src/api/quotation/jobs/postJobs.ts
export interface CreateJobPayload { /* ... */ }

export async function createJob(token: string | null, payload: CreateJobPayload): Promise<Job> {
  return await apiFetch('/api/jobs', token, { method: 'POST', body: JSON.stringify(payload) })
}

export function useCreateJob() {
  const { getToken } = useAuth()
  return useMutation({
    mutationFn: async (payload: CreateJobPayload) => {
      const token = await getToken()
      return createJob(token, payload)
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

### Don't

- Edit files in `components/ui/` manually (use shadcn CLI to update).
- Use inline styles or CSS modules.
- Use `any` or untyped objects.
- Duplicate helper components across files.
- Put business logic in page components.
- Use relative imports that traverse up more than one level (`../../..`).
- Install icon libraries other than lucide-react.
- Create global CSS classes — use Tailwind utilities.
