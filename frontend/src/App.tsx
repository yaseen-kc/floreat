import './App.css'
import { ClerkProvider, Show} from '@clerk/react'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/authentication/Login'
import Dashboard from './pages/Dashboard'
import { Sidebar } from './components/dashboard/sidebar'
import CreateQuotation from './pages/quotation/CreateQuotation'
import { Toaster } from './components/ui/sonner'
import { useDraftPersistenceScope } from './hooks/useDraftPersistenceScope'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key. Set VITE_CLERK_PUBLISHABLE_KEY in your .env file.')
}

function App() {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
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
 * The signed-in shell. Scopes the persisted quotation draft to the current
 * user and mounts the global toast surface.
 */
function SignedInLayout() {
  useDraftPersistenceScope()

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}

export default App
