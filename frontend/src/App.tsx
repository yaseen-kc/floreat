import { useCallback, useEffect, useRef, useState } from 'react'
import { ClerkProvider, Show } from '@clerk/react'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/authentication/Login'
import Dashboard from './pages/Dashboard'
import { Sidebar } from './components/dashboard/sidebar'
import { Topbar } from './components/dashboard/Topbar'
import CreateQuotation from './pages/quotation/CreateQuotation'
import SavedDrafts from './pages/SavedDrafts'
import { Toaster } from './components/ui/sonner'
import { useDraftPersistenceScope } from './hooks/useDraftPersistenceScope'
import { useSearchShortcuts } from './hooks/useSearchShortcuts'
import { clerkAppearance } from './lib/clerk'
import { resolveInitialCollapsed, setCollapsedPref } from './lib/sidebar'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key. Set VITE_CLERK_PUBLISHABLE_KEY in your .env file.')
}

function App() {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={clerkAppearance}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      signInUrl="/login"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      afterSignOutUrl="/"
    >
      <Routes>
        {/* Splat route so Clerk can drive its nested sign-in sub-flows. */}
        <Route path="/login/*" element={<Login />} />

        {/* Every other route is protected: signed-out users are sent to /login. */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/quotations/new" element={<CreateQuotation />} />
          <Route path="/drafts" element={<SavedDrafts />} />

        </Route>
      </Routes>
    </ClerkProvider>
  )
}

/**
 * Gate for authenticated-only routes. Renders the matched child route when the
 * user is signed in, otherwise redirects to /login.
 */
function ProtectedLayout() {
  return (
    <Show when="signed-in" fallback={<Navigate to="/login" replace />}>
      <SignedInLayout />
    </Show>
  )
}

/**
 * The signed-in shell (DESIGN.md §8.1): a CSS grid of `var(--sidebar-w) 1fr`
 * with a sticky sidebar, a sticky blurred topbar, and a scrolling content well.
 * Scopes the persisted quotation draft to the current user and mounts the
 * global toast surface.
 */
function SignedInLayout() {
  useDraftPersistenceScope()
  const [navOpen, setNavOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(resolveInitialCollapsed)
  const searchRef = useRef<HTMLInputElement>(null)
  useSearchShortcuts(searchRef)

  // Mirror the collapsed preference onto <html> so the CSS width override
  // (index.css) applies, and persist the choice.
  useEffect(() => {
    const root = document.documentElement
    if (collapsed) root.setAttribute('data-sidebar', 'collapsed')
    else root.removeAttribute('data-sidebar')
    setCollapsedPref(collapsed)
  }, [collapsed])

  const toggleCollapse = useCallback(() => setCollapsed((c) => !c), [])

  return (
    <div className="grid min-h-screen grid-cols-[var(--sidebar-w)_1fr] transition-[grid-template-columns] duration-200 ease-(--ease)">
      <Sidebar
        navOpen={navOpen}
        onClose={() => setNavOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Scrim behind the mobile drawer. */}
      {navOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-40 hidden bg-foreground/40 backdrop-blur-[1px] max-[768px]:block"
        />
      )}

      {/* Force the content well into the second grid column. On mobile the
          sidebar is position:fixed (off-canvas) and leaves the grid flow, so
          without this the content auto-places into the 0px sidebar column. */}
      <div className="col-start-2 flex min-h-screen min-w-0 flex-col">
        <Topbar onMenu={() => setNavOpen(true)} searchRef={searchRef} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  )
}

export default App
